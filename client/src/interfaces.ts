export interface Colors {
	1: number[];
	2: number[];
	3: number[];
}
export interface ImageUrl {
	name: string;
	dataUrl: string;
}

export interface ImagePreview {
	w: number;
	h: number;
	borderProportion: number;
}

export interface Checker {
	isCheckNumerate?: string;
	isCheckBorder?: string;
}

export interface ImagesFormats {
	png: string;
	jpeg: string;
	webp: string;
}
