import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { TradesService } from './trades.service';
import { SymbolEnum } from '../types/symbols.enum';
import { ExecuteStrategyDto } from './dto/execute-strategy.dto';

@Controller('/v1/trades')
export class TradesController {
	constructor(private readonly tradesService: TradesService) {}

	@Get(':symbol')
	async getTrades(@Param('symbol') symbol: SymbolEnum, @Query('limit') limit?: number) {
		return this.tradesService.fetchAndStoreTrades(symbol, limit);
	}

	@Post('/start')
	async executeStrategy(@Body() dto: ExecuteStrategyDto): Promise<number> {
		this.tradesService.setStrategy(dto.strategyName);
		return this.tradesService.executeTradingStrategy(dto.symbol, dto.startDeposit); // TODO should run in background
	}
}
