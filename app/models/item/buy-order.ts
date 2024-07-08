import { BuyProduct, BuyProductSubtotal } from "./buy-product";

export interface BuyOrder {
	order: string;
	items: Array<BuyProduct>;
	subtotal: BuyProductSubtotal | undefined;
}