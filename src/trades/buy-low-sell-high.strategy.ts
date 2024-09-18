import { Injectable } from '@nestjs/common';
import { TradingStrategy } from './trading-strategy.interface';
import { Trade } from '../binance/models/trades-response';

@Injectable()
export class BuyLowSellHighStrategy implements TradingStrategy {
	execute(symbol: string, trades: Trade[], startDeposit: number): number {
		//TODO Implement "Buy low, sell high"
		// const buyPrice = Math.min(...trades.map((trade) => trade.price));
		// const sellPrice = Math.max(...trades.map((trade) => trade.price));
		return startDeposit;
	}
}
