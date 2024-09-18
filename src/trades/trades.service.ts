import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { TradesRepository } from './trades.repository';
import { TradeModel } from './models/trade.model';
import { ConfigService } from '@nestjs/config';
import { BinanceService } from '../binance/binance.service';
import { Trade } from '../binance/models/trades-response';
import { SymbolEnum } from '../types/symbols.enum';
import { TradingStrategy } from './trading-strategy.interface';
import { BuyLowSellHighStrategy } from './buy-low-sell-high.strategy';
import { TradingStrategyName } from '../types/trading-stratagy.enum';

/*type SimpleTrade = {
	price: number;
	count: number;
	amount: number;
};*/
@Injectable()
export class TradesService {
	private logger;
	private strategy: TradingStrategy;

	constructor(
		private readonly configService: ConfigService,
		private readonly tradesRepository: TradesRepository,
		private readonly binanceService: BinanceService,
		private readonly buyLowSellHighStrategy: BuyLowSellHighStrategy,
	) {
		this.logger = new Logger(BinanceService.name);
	}

	setStrategy(strategyName: string): void {
		switch (strategyName) {
			case TradingStrategyName.BUY_LOW_SELL_HIGH:
				this.strategy = this.buyLowSellHighStrategy;
				break;
			default:
				throw new InternalServerErrorException('Unknown trading strategy');
		}
	}

	async fetchAndStoreTrades(symbol: SymbolEnum, limit?: number): Promise<TradeModel[]> {
		const trades = await this.binanceService.fetchRecentTrades(symbol, limit);

		const formattedTrades = trades.map((trade: Trade) => {
			return {
				symbol,
				price: trade.price,
				quantity: trade.qty,
				quoteQuantity: trade.quoteQty,
				timestamp: new Date(trade.time),
				isBuyerMaker: trade.isBuyerMaker,
				isBestMatch: trade.isBestMatch,
			};
		});
		return this.tradesRepository.insertTrades(formattedTrades);
	}

	async executeTradingStrategy(symbol: SymbolEnum, startDeposit: number): Promise<number> {
		const trades: TradeModel[] = await this.tradesRepository.findRecentTrades(symbol, 100);
		if (!trades.length) {
			this.logger.warn('There are no trades in DB');
			return startDeposit;
		}

		if (!this.strategy) {
			this.logger.error('Trading strategy must be set', this.strategy);
			throw new InternalServerErrorException('Trading strategy must be set');
		}
		return this.strategy.execute(symbol, trades, startDeposit);
	}
}
