function getARGB(data, i) {
	const offset = i * 4;

	return (
		((data[offset + 3] << 24) & 0xff000000) |
		((data[offset] << 16) & 0x00ff0000) |
		((data[offset + 1] << 8) & 0x0000ff00) |
		(data[offset + 2] & 0x000000ff)
	);
}

function setPixels(pixels, data) {
	let offset = 0;

	for (let i = 0, al = pixels.length; i < al; i++) {
		offset = i * 4;
		pixels[offset + 0] = (data[i] & 0x00ff0000) >>> 16;
		pixels[offset + 1] = (data[i] & 0x0000ff00) >>> 8;
		pixels[offset + 2] = data[i] & 0x000000ff;
		pixels[offset + 3] = (data[i] & 0xff000000) >>> 24;
	}

	return pixels;
}

function invertColors(pixels) {
	for (var i = 0; i < pixels.length; i += 4) {
		pixels[i] = pixels[i] ^ 255; // Invert Red
		pixels[i + 1] = pixels[i + 1] ^ 255; // Invert Green
		pixels[i + 2] = pixels[i + 2] ^ 255; // Invert Blue
	}

	return pixels;
}

export { getARGB, setPixels, invertColors };
