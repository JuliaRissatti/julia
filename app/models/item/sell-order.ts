import { SellProduct } from "./sell-product";

export interface SellOrder {
	orderNumber: number|undefined;
	items: Array<SellProduct>;
}
