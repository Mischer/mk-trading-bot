import { Module } from '@nestjs/common';
import { TradesService } from './trades.service';
import { TradesController } from './trades.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TradeModel, TradeSchema } from './models/trade.model';

@Module({
	imports: [MongooseModule.forFeature([{ name: TradeModel.name, schema: TradeSchema }])],
	providers: [TradesService],
	controllers: [TradesController],
})
export class TradesModule {}
