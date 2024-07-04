import { Line } from "tesseract.js";

export interface Billing {
	filial: string;
	cliente: string;
	pedidos: Array<number>;
	subtotal: Line;
}

export interface RawBilling {
	header: Line;
	orders: Array<Line>;
	subtotal: Line;
}
