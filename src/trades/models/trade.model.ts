import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class TradeModel extends Document {
	@Prop({ required: true })
	symbol: string;

	@Prop({ required: true })
	price: number;

	@Prop({ required: true })
	quantity: number;

	@Prop({ required: true })
	timestamp: Date;
}

export const TradeSchema = SchemaFactory.createForClass(TradeModel);
