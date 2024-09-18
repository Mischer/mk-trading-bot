import { Trade } from '../binance/models/trades-response';

export interface TradingStrategy {
	execute(symbol: string, trades: Trade[], startDeposit: number): number;
}
