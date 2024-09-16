import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BinanceTradeDto } from './dto/binance-trade.dto';
import { plainToInstance } from 'class-transformer';
import axios from 'axios';

@Injectable()
export class BinanceService {
	private readonly binanceApiUrl: string;
	constructor(private readonly configService: ConfigService) {
		this.binanceApiUrl = configService.get('BINANCE_API_URL');
	}

	async getTrades(symbol: string, limit?: number): Promise<BinanceTradeDto[]> {
		try {
			const response = await axios.get(
				`${this.binanceApiUrl}/api/v3/trades?symbol=${symbol}${limit ? `&limit=${limit}` : ''}`,
			);

			// should check it before map to DTO object for success TS compile
			if (!Array.isArray(response.data)) {
				throw new InternalServerErrorException('Expected an array of trades from Binance API');
			}

			return plainToInstance(BinanceTradeDto, response.data) as BinanceTradeDto[];
		} catch (error) {
			console.log('Error fetching trades from Binance API:', error.message || error);

			throw new InternalServerErrorException('Failed to fetch recent trades from Binance API');
		}
	}
}
