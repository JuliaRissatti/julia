import { BuyItem, BuyItemSubtotal, RawBuyItem, RawBuyItemSubtotal } from "./buy-item";

export interface BuyProduct {
	orderId: number;
	productId: string;
	items: Array<BuyItem>;
	subtotal: BuyItemSubtotal;
}

export interface RawBuyProduct {
	orderId: string;
	productId: string;
	items: Array<RawBuyItem>;
	subtotal: RawBuyItemSubtotal;
}