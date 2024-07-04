import { SellProduct } from "./sell-product";

export interface SellOrder {
	orderNumber: number;
	items: Array<SellProduct>;
}
