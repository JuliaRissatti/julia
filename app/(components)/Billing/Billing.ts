import { Line } from "tesseract.js";
import { Orders } from "../Order/Orders";

export interface Billing {
	filial: string;
	cliente: string;
	pedidos: Array<Orders>;
	subtotal: Line;
}

export interface RawBilling {
	header: Line;
	orders: Array<Line>;
	subtotal: Line;
}
