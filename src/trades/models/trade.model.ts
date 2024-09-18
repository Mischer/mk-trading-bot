import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SymbolEnum } from '../../types/symbols.enum';

@Schema()
export class TradeModel extends Document {
	@Prop({ required: true })
	symbol: SymbolEnum;

	@Prop({ required: true })
	price: string;

	@Prop({ required: true })
	quantity: string;

	@Prop({ required: true })
	quoteQuantity: string;

	@Prop({ required: true })
	timestamp: Date;

	@Prop({ required: true })
	isBuyerMaker: boolean;

	@Prop({ required: true })
	isBestMatch: boolean;
}

export const TradeSchema = SchemaFactory.createForClass(TradeModel);
