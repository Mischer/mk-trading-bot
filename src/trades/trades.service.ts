import { Injectable } from '@nestjs/common';
import { TradesRepository } from './trades.repository';
import { TradeModel } from './models/trade.model';
import { ConfigService } from '@nestjs/config';
import { BinanceService } from '../binance/binance.service';
import { BinanceTradeDto } from '../binance/dto/binance-trade.dto';

@Injectable()
export class TradesService {
	constructor(
		private configService: ConfigService,
		private tradesRepository: TradesRepository,
		private binanceService: BinanceService,
	) {}

	async fetchAndStoreTrades(symbol: string, limit?: number): Promise<TradeModel[]> {
		const trades = await this.binanceService.fetchRecentTrades(symbol, limit);

		const formattedTrades = trades.map((trade: BinanceTradeDto) => {
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

	async executeTradingStrategy(symbol: string) {
		const trades = await this.tradesRepository.findRecentTrades(symbol, 50);
		const latestTrade = trades[0];

		if (!latestTrade) return;

		const percentage = this.configService.get('SIMPLE_BUY_SELL_STRATEGY_PERCENTAGE', 5);
		const lastPrice = parseFloat(latestTrade.price);
		const targetBuyPrice = lastPrice * (1 - percentage / 100);
		const targetSellPrice = lastPrice * (1 + percentage / 100);

		if (lastPrice <= targetBuyPrice) {
			console.log(`Buying ${symbol} at ${lastPrice}`);
			// TODO implement buy logic
		} else if (lastPrice >= targetSellPrice) {
			console.log(`Selling ${symbol} at ${lastPrice}`);
			// TODO implement sell logic
		}
	}
}
