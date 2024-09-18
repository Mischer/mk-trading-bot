import { Injectable, Logger } from '@nestjs/common';
import { TradesRepository } from './trades.repository';
import { TradeModel } from './models/trade.model';
import { ConfigService } from '@nestjs/config';
import { BinanceService } from '../binance/binance.service';
import { Trade } from '../binance/models/trades-response';
import { SymbolEnum } from '../types/symbols.types';

@Injectable()
export class TradesService {
	private readonly logger;
	constructor(
		private configService: ConfigService,
		private tradesRepository: TradesRepository,
		private binanceService: BinanceService,
	) {
		this.logger = new Logger(BinanceService.name);
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

	async executeTradingStrategy(symbol: SymbolEnum) {
		const trades = await this.tradesRepository.findRecentTrades(symbol, 50);
		const latestTrade = trades[0];

		if (!latestTrade) return;

		const percentage = this.configService.get('SIMPLE_BUY_SELL_STRATEGY_PERCENTAGE', 5);
		const lastPrice = parseFloat(latestTrade.price);
		const targetBuyPrice = lastPrice * (1 - percentage / 100);
		const targetSellPrice = lastPrice * (1 + percentage / 100);

		if (lastPrice <= targetBuyPrice) {
			logger.log(`Buying ${symbol} at ${lastPrice}`);
			// TODO implement buy logic
		} else if (lastPrice >= targetSellPrice) {
			logger.log(`Selling ${symbol} at ${lastPrice}`);
			// TODO implement sell logic
		}
	}
}
