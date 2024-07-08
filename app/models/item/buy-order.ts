import { BuyProduct, BuyProductSubtotal, RawBuyProduct, RawBuyProductSubtotal } from "./buy-product";

export interface BuyOrder {
	order: number;
	items: Array<BuyProduct>;
	subtotal: BuyProductSubtotal | undefined;
}

export interface RawBuyOrder {
	productId: string;
	items: Array<RawBuyProduct>;
	subtotal: RawBuyProductSubtotal;
}
