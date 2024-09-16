import { Controller, Get, Param, Query } from '@nestjs/common';
import { TradesService } from './trades.service';

@Controller('trades')
export class TradesController {
	constructor(private readonly tradesService: TradesService) {}

	@Get(':symbol')
	async getTrades(@Param('symbol') symbol: string, @Query('limit') limit?: number) {
		return this.tradesService.fetchAndStoreTrades(symbol, limit);
	}

	@Get(':symbol/strategy')
	async executeStrategy(@Param('symbol') symbol: string) {
		return this.tradesService.executeTradingStrategy(symbol);
	}
}
