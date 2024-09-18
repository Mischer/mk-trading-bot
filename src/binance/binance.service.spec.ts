import { Test, TestingModule } from '@nestjs/testing';
import { BinanceService } from './binance.service';
import { ConfigService } from '@nestjs/config';
import { TradesResponse } from './models/trades-response';
import { InternalServerErrorException } from '@nestjs/common';
import { SymbolEnum } from '../types/symbols.enum';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
describe('BinanceService tests', () => {
	let service: BinanceService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				BinanceService,
				{
					provide: ConfigService,
					useValue: {
						get: jest.fn().mockReturnValue('https://api.binance.com'), // TODO get from config
					},
				},
			],
		}).compile();

		service = module.get<BinanceService>(BinanceService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	afterAll(() => {
		jest.restoreAllMocks();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should fetch trades successfully', async () => {
		const mockResponse = [
			{
				id: 28457,
				price: '4.00000100',
				qty: '12.00000000',
				quoteQty: '48.000012',
				time: 1499865549590,
				isBuyerMaker: true,
				isBestMatch: true,
			},
		] as TradesResponse;

		mockedAxios.get.mockResolvedValue({ data: mockResponse });

		const symbol = SymbolEnum.BTCUSDT;
		const result = await service.fetchRecentTrades(symbol);

		expect(result).toEqual(mockResponse);
		expect(mockedAxios.get).toHaveBeenCalledWith(`https://api.binance.com/api/v3/trades`, { params: { symbol } });
	});

	it('should handle errors when fetching trades', async () => {
		mockedAxios.get.mockRejectedValue(new Error('Network error'));

		const symbol = SymbolEnum.BTCUSDT;
		await expect(service.fetchRecentTrades(symbol)).rejects.toThrow(InternalServerErrorException);
		expect(mockedAxios.get).toHaveBeenCalledWith(`https://api.binance.com/api/v3/trades`, { params: { symbol } });
	});
});
