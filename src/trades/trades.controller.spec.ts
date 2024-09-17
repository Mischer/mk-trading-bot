import { Test, TestingModule } from '@nestjs/testing';
import { TradesController } from './trades.controller';
import { TradesService } from './trades.service';

const mockTradesService = {
	fetchAndStoreTrades: jest.fn(),
	executeTradingStrategy: jest.fn(),
};

describe('TradesController', () => {
	let tradesController: TradesController;
	let tradesService: TradesService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [TradesController],
			providers: [
				{
					provide: TradesService,
					useValue: mockTradesService,
				},
			],
		}).compile();

		tradesController = module.get<TradesController>(TradesController);
		tradesService = module.get<TradesService>(TradesService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(tradesController).toBeDefined();
	});

	describe('getTrades', () => {
		it('should call fetchAndStoreTrades with correct parameters', async () => {
			const symbol = 'BTCUSDT';
			const limit = 10;
			const result = [{ symbol, price: '123.45', quantity: '0.5' }];

			mockTradesService.fetchAndStoreTrades.mockResolvedValue(result);

			expect(await tradesController.getTrades(symbol, limit)).toBe(result);
			expect(tradesService.fetchAndStoreTrades).toHaveBeenCalledWith(symbol, limit);
		});

		it('should handle errors thrown by fetchAndStoreTrades', async () => {
			const symbol = 'BTCUSDT';
			const limit = 10;
			mockTradesService.fetchAndStoreTrades.mockRejectedValue(new Error('Error fetching trades'));

			await expect(tradesController.getTrades(symbol, limit)).rejects.toThrow('Error fetching trades');
		});
	});

	describe('executeStrategy', () => {
		it('should call executeTradingStrategy with correct parameters', async () => {
			const symbol = 'BTCUSDT';
			const result = { message: 'Strategy executed' };

			mockTradesService.executeTradingStrategy.mockResolvedValue(result);

			expect(await tradesController.executeStrategy(symbol)).toBe(result);
			expect(tradesService.executeTradingStrategy).toHaveBeenCalledWith(symbol);
		});

		it('should handle errors thrown by executeTradingStrategy', async () => {
			const symbol = 'BTCUSDT';
			mockTradesService.executeTradingStrategy.mockRejectedValue(new Error('Error executing strategy'));

			await expect(tradesController.executeStrategy(symbol)).rejects.toThrow('Error executing strategy');
		});
	});
});
