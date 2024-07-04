import { BuyProduct, BuyProductSubtotal, RawBuyProduct, RawBuyProductSubtotal } from "./buy-order";

export interface BuyOrder {
	orderId: number;
	productId: string;
	items: Array<BuyProduct>;
	subtotal: BuyProductSubtotal;
}

export interface RawBuyOrder {
	orderId: string;
	productId: string;
	items: Array<RawBuyProduct>;
	subtotal: RawBuyProductSubtotal;
}
