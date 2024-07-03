import { SellProduct } from "./sell-product";

export interface SellOrder {
	orderId: string;
	items: Array<SellProduct>;
}
