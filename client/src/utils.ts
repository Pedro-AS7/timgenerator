export function hexToRgb(hex: string) {
	const cleanHex = hex.startsWith("#") ? hex.slice(1) : hex;

	if (cleanHex.length === 3) {
		const r = cleanHex[0];
		const g = cleanHex[1];
		const b = cleanHex[2];
		return {
			r: parseInt(r + r, 16),
			g: parseInt(g + g, 16),
			b: parseInt(b + b, 16),
		};
	}

	if (cleanHex.length === 6) {
		const r = parseInt(cleanHex.substring(0, 2), 16);
		const g = parseInt(cleanHex.substring(2, 4), 16);
		const b = parseInt(cleanHex.substring(4, 6), 16);
		return { r, g, b };
	}

	return {
		r: 255,
		g: 255,
		b: 255,
	};
}

export function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
