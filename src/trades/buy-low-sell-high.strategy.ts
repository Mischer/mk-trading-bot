import { Injectable, Logger } from '@nestjs/common';
import { TradingStrategy } from './trading-strategy.interface';
import { Trade } from '../binance/models/trades-response';
import { ConfigService } from '@nestjs/config';
import { SymbolEnum } from '../types/symbols.enum';

@Injectable()
export class BuyLowSellHighStrategy implements TradingStrategy {
	private logger: Logger;
	private cash: number;
	private assetQty: number;
	private percentage: number;
	private startPriceForTradingSession: number | null = null;

	constructor(private readonly configService: ConfigService) {
		this.logger = new Logger(BuyLowSellHighStrategy.name);
	}

	execute(symbol: SymbolEnum, trades: Trade[], startDeposit: number): number {
		this.cash = startDeposit;
		this.assetQty = 0;
		this.percentage = this.configService.get('SIMPLE_BUY_SELL_STRATEGY_PERCENTAGE', 1);

		trades.forEach((trade, index) => {
			const currentPrice = parseFloat(trade.price);

			// Set start price for all trading session
			if (index === 0) {
				this.startPriceForTradingSession = currentPrice;
				return;
			}

			// Check current price for buying
			if (this.cash > 0 && this.shouldBuy(currentPrice)) {
				this.logger.log(`Buying ${symbol} at price: ${currentPrice}`);
				this.buy(currentPrice);
			}

			// Check current price for selling
			if (this.assetQty > 0 && this.shouldSell(currentPrice)) {
				this.logger.log(`Selling ${symbol} at price: ${currentPrice}`);
				this.sell(currentPrice);
			}
		});

		this.logger.log(`Final cash after trading ${symbol}: ${this.cash}`);
		return this.cash;
	}

	private buy(currentPrice: number): void {
		const buyQty = this.cash / currentPrice; // How many assets can be bought with the available cash
		this.assetQty += buyQty; // Increase the number of assets
		this.cash = 0; // Reset cash after buying
	}

	private sell(currentPrice: number): void {
		const sellValue = this.assetQty * currentPrice; // Calculate the revenue from selling all assets
		this.cash += sellValue; // Increase cash after selling
		this.assetQty = 0; // Reset the number of assets
	}

	private shouldBuy(currentPrice: number): boolean {
		if (!this.startPriceForTradingSession) return false; // If there is no previous price, do not buy

		// Calculate how much the current price has dropped compared to the previous one
		const priceDrop = ((this.startPriceForTradingSession - currentPrice) / this.startPriceForTradingSession) * 100;
		return priceDrop >= this.percentage; // Check if the price has dropped by the specified percentage
	}

	private shouldSell(currentPrice: number): boolean {
		if (!this.startPriceForTradingSession) return false; // If there is no previous price, do not sell

		// Calculate how much the current price has risen compared to the previous one
		const priceRise = ((currentPrice - this.startPriceForTradingSession) / this.startPriceForTradingSession) * 100;
		return priceRise >= this.percentage; // Check if the price has risen by the specified percentage
	}
}
