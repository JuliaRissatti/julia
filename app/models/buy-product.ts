import { Line } from "tesseract.js";
import { BuyItem, BuyItemSubtotal } from "./buy-item";

export interface BuyProduct {
	id: string;
	items: Array<BuyItem>;
	subtotal: BuyItemSubtotal;
}

export interface RawBuyProduct {
	id: Line;
	items: Array<Line>;
	subtotal: Line;
}
