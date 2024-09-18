import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { BuyLowSellHighStrategy } from './buy-low-sell-high.strategy';
import { Trade } from '../binance/models/trades-response';
import { SymbolEnum } from '../types/symbols.enum';

describe('BuyLowSellHighStrategy Tests', () => {
	let strategy: BuyLowSellHighStrategy;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [ConfigService, BuyLowSellHighStrategy],
		}).compile();

		strategy = module.get<BuyLowSellHighStrategy>(BuyLowSellHighStrategy);
	});

	it('should be defined', () => {
		expect(strategy).toBeDefined();
	});

	it('should buy assets when price is at or below target buy price', () => {
		const trades: Trade[] = [
			{ id: 1, price: '100', qty: '1', quoteQty: '100', time: 1, isBuyerMaker: false, isBestMatch: true },
			{ id: 2, price: '99', qty: '1', quoteQty: '99', time: 2, isBuyerMaker: false, isBestMatch: true },
		];

		const finalCash = strategy.execute(SymbolEnum.BTCUSDT, trades, 1000);
		expect(finalCash).toBe(0);
	});

	it('should buy and sell correctly based on the trade data', () => {
		const trades: Trade[] = [
			{ id: 1, price: '100', qty: '1', quoteQty: '100', time: 1, isBuyerMaker: false, isBestMatch: true },
			{ id: 2, price: '99', qty: '1', quoteQty: '99', time: 2, isBuyerMaker: false, isBestMatch: true },
			{ id: 3, price: '101', qty: '1', quoteQty: '101', time: 3, isBuyerMaker: false, isBestMatch: true },
		];

		const finalCash = strategy.execute(SymbolEnum.BTCUSDT, trades, 1000);
		expect(finalCash).toBeGreaterThan(1000);
	});
});
