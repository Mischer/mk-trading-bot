import { Trade } from '../binance/models/trades-response';
import { TradeModel } from './models/trade.model';

export interface TradingStrategy {
	execute(symbol: string, trades: Trade[] | TradeModel[], startDeposit: number): number;
}
