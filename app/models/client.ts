import { Order } from "./order";

export class Client {
	name: string | undefined = undefined;
	orders: Array<Order> = new Array<Order>();
}
