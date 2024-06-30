import { Line } from "tesseract.js";
import { SellItem } from "./sell-item";

export interface SellProduct {
	id: string;
	items: Array<SellItem>;
}

export interface RawSellProduct {
	id: string;
	items: Array<Line>;
}
