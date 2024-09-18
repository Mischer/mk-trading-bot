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
				throw new Error('Unknown trading strategy');
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
		this.logger.log(`START BOT`);
		/*		const trades = await this.tradesRepository.findRecentTrades(symbol, 100);
		if (!trades.length) {
			return startDeposit;
		}*/
		const trades: Trade[] = [
			{
				id: 1,
				price: '100',
				qty: '1',
				quoteQty: '100',
				time: 1499865549590,
				isBuyerMaker: true,
				isBestMatch: true,
			},
			{
				id: 1,
				price: '101',
				qty: '1',
				quoteQty: '101',
				time: 1499865549591,
				isBuyerMaker: true,
				isBestMatch: true,
			},
			{
				id: 1,
				price: '99',
				qty: '1',
				quoteQty: '99',
				time: 1499865549592,
				isBuyerMaker: true,
				isBestMatch: true,
			},
		];

		if (!this.strategy) {
			this.logger.error('Trading strategy must be set', this.strategy);
			throw new InternalServerErrorException('Trading strategy must be set');
		}
		return this.strategy.execute(symbol, trades, startDeposit);

		/*		const percentage = this.configService.get('SIMPLE_BUY_SELL_STRATEGY_PERCENTAGE', 1);
		// const percentage = this.configService.get('SIMPLE_BUY_SELL_STRATEGY_BUYING_SELLING_DEPOSIT_PERCENTAGE', 10);
		let resultAmount: number = startDeposit;
		let lastBuyingTrade: SimpleTrade = null;
		let lastSellingTrade: SimpleTrade = null;
		for (const trade of trades) {
			const price = parseFloat(trade.price);
			const targetBuyPrice = price * (1 - percentage / 100);
			const targetSellPrice = price * (1 + percentage / 100);

			const count = 1; // FIXME calculate it
			const amount = price * count;
			if (price <= targetBuyPrice && !lastBuyingTrade && resultAmount >= amount) {
				lastBuyingTrade = {
					price,
					count,
					amount,
				};
				this.logger.log(`Buying ${symbol} at ${price}`, lastBuyingTrade);
				resultAmount -= amount;
				lastSellingTrade = null;
			} else if (price >= targetSellPrice && !lastSellingTrade && lastBuyingTrade) {
				const amount = price * lastBuyingTrade.count;
				lastSellingTrade = {
					price,
					count: lastBuyingTrade.count,
					amount,
				};
				this.logger.log(`Selling ${symbol} at ${price}`, lastSellingTrade);
				resultAmount += amount;
				lastBuyingTrade = null;
			}
		}
		this.logger.log(`FINISH BOT`);
		return resultAmount;*/
	}
}
