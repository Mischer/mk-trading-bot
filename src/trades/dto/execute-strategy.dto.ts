import { SymbolEnum } from '../../types/symbols.enum';
import { IsEnum, IsNumber, IsPositive } from 'class-validator';
import { TradingStrategyName } from '../../types/trading-stratagy.enum';

export class ExecuteStrategyDto {
	@IsEnum(SymbolEnum)
	symbol: SymbolEnum;

	@IsNumber()
	@IsPositive()
	startDeposit: number;

	@IsEnum(TradingStrategyName)
	strategyName: TradingStrategyName;
}
