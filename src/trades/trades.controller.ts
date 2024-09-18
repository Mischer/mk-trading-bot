import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { TradesService } from './trades.service';
import { SymbolEnum } from '../types/symbols.types';

@Controller('/v1/trades')
export class TradesController {
	constructor(private readonly tradesService: TradesService) {}

	@Get(':symbol')
	async getTrades(@Param('symbol') symbol: SymbolEnum, @Query('limit') limit?: number) {
		return this.tradesService.fetchAndStoreTrades(symbol, limit);
	}

	@Post(':symbol/start')
	async executeStrategy(@Param('symbol') symbol: SymbolEnum) {
		return this.tradesService.executeTradingStrategy(symbol);
	}
}
