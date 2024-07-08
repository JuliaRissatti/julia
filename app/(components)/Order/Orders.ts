import { BuyOrder } from "../../models/item/buy-order";
import { SellOrder } from "../../models/item/sell-order";

export interface Orders {
	number: number;
	buyOrder?: BuyOrder;
	sellOrder?: SellOrder;
}
