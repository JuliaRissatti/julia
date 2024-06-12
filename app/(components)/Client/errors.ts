export class MalformedClient extends Error {
	constructor(message: string) {
		super(message);

		this.name = "Malformed Client";
	}
}