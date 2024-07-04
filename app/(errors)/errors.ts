export class MalformedItem extends Error {
	constructor(message: string) {
		super(message);

		this.name = "Malformed Item";
	}
}
