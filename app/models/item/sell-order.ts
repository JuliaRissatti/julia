import { SellProduct } from "./sell-product";

export interface SellOrder {
	order: number|undefined;
	items: Array<SellProduct>;
}
