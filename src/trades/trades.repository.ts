import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TradeModel } from './models/trade.model';
import { SymbolEnum } from '../types/symbols.enum';

@Injectable()
export class TradesRepository {
	constructor(@InjectModel(TradeModel.name) private readonly tradeModel: Model<TradeModel>) {}

	async insertTrades(trades: Partial<TradeModel>[]): Promise<TradeModel[]> {
		return this.tradeModel.insertMany(trades, { ordered: false }); // In case of some incorrect trade exists the app should still save all correct docs
	}

	async findRecentTrades(symbol: SymbolEnum, limit: number): Promise<TradeModel[]> {
		return this.tradeModel.find({ symbol }).sort({ timestamp: -1 }).limit(limit).lean().exec();
	}
}
