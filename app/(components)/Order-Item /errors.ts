export class MalformedOrder extends Error {
	constructor(message: string) {
		super(message);

		this.name = "Malformed Order";
	}
}
