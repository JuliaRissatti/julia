import { SellItem } from "./sell-item"

export interface SellOrder {
	orderId: string
	items: Array<SellItem>
}