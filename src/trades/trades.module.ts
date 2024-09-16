import { Module } from '@nestjs/common';
import { TradesService } from './trades.service';
import { TradesController } from './trades.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TradeModel, TradeSchema } from './models/trade.model';
import { TradesRepository } from './trades.repository';
import { BinanceModule } from '../binance/binance.module';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [ConfigModule, MongooseModule.forFeature([{ name: TradeModel.name, schema: TradeSchema }]), BinanceModule],
	providers: [
		TradesService, // Separate business layer
		TradesRepository, // Separate DB layer
	],
	controllers: [TradesController],
	exports: [TradesService],
})
export class TradesModule {}
