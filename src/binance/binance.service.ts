import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TradesResponse } from './models/trades-response';
import axios, { AxiosResponse } from 'axios';
import { SymbolEnum } from '../types/symbols.types';

@Injectable()
export class BinanceService {
	private readonly binanceApiUrl: string;
	private readonly logger: Logger;

	constructor(private readonly configService: ConfigService) {
		this.binanceApiUrl = configService.get('BINANCE_API_URL');
		this.logger = new Logger(BinanceService.name);
	}

	public async fetchRecentTrades(symbol: SymbolEnum, limit?: number): Promise<TradesResponse> {
		try {
			const response: AxiosResponse<TradesResponse> = await axios.get<TradesResponse>(
				`${this.binanceApiUrl}/api/v3/trades`,
				{
					params: {
						symbol,
						...(limit && { limit }),
					},
				},
			);

			return response.data;
		} catch (error) {
			logger.error('Error fetching trades from Binance API:', error.message || error);

			throw new InternalServerErrorException('Failed to fetch recent trades from Binance API');
		}
	}
}
