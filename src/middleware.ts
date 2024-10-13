import type { Request, Response, NextFunction } from "express";

// Allowed image formats
const allowedFormats = ["jpeg", "png", "webp", "tiff", "gif"] as const;
type FormatType = (typeof allowedFormats)[number];

const isPositiveInteger = (value: string): boolean => {
	const num = Number(value);
	return Number.isInteger(num) && num > 0;
};

export const validateResizeParams = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { width, height } = req.query;

	if (!width && !height) {
		return res.status(400).json({ error: "Width or height must be specified" });
	}

	// Validate width and height
	if (width && !isPositiveInteger(width as string)) {
		return res.status(400).json({ error: "Width must be a positive integer" });
	}

	if (height && !isPositiveInteger(height as string)) {
		return res.status(400).json({ error: "Height must be a positive integer" });
	}

	next();
};

export const validateConvertParams = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { format } = req.query;

	if (!format) {
		return res.status(400).json({ error: "Format is required" });
	}

	if (!allowedFormats.includes(format as FormatType)) {
		return res.status(400).json({
			error: `Invalid format. Allowed formats are: ${allowedFormats.join(", ")}`,
		});
	}

	next();
};

export const errorHandler = (
	err: Error,
	_req: Request,
	res: Response,
	_next: NextFunction,
) => {
	console.error(err);
	res.status(500).json({ error: "Internal Server Error" });
};

export const validateImageUpload = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	if (!req.file) {
		return res.status(400).json({ error: "No image file uploaded" });
	}
	next();
};
