import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { getMongoConfig } from './config/mongo.config';
import { TradesModule } from './trades/trades.module';
import { BinanceModule } from './binance/binance.module';

@Module({
	imports: [
		ConfigModule.forRoot(),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: getMongoConfig,
			inject: [ConfigService],
		}),
		TradesModule,
		BinanceModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
