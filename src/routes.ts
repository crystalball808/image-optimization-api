import {
	type NextFunction,
	type Request,
	type Response,
	Router,
} from "express";
import multer from "multer";
import sharp from "sharp";
import {
	validateConvertParams,
	validateResizeParams,
	validateImageUpload,
} from "./middleware";

export const router = Router();

// Set up multer for file upload (in-memory storage)
const upload = multer({ storage: multer.memoryStorage() });

// Allowed image formats
const allowedFormats = ["jpeg", "png", "webp", "tiff", "gif"] as const;
type FormatType = (typeof allowedFormats)[number];

// Endpoint for resizing images
router.post(
	"/resize",
	upload.single("image"),
	validateImageUpload,
	validateResizeParams,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const width = req.query.width
				? Number.parseInt(req.query.width as string, 10)
				: undefined;
			const height = req.query.height
				? Number.parseInt(req.query.height as string, 10)
				: undefined;

			// Determine the original image format
			const metadata = await sharp(req.file!.buffer).metadata();
			const imageFormat = metadata.format || "jpeg"; // Default to jpeg if format is undefined

			// Resize the image using sharp
			const resizedImageBuffer = await sharp(req.file!.buffer)
				.resize(width, height)
				.toFormat(imageFormat)
				.toBuffer();

			res.set("Content-Type", `image/${imageFormat}`);
			res.send(resizedImageBuffer);
		} catch (error) {
			next(error);
		}
	},
);

// Endpoint for converting image formats
router.post(
	"/convert",
	upload.single("image"),
	validateImageUpload,
	validateConvertParams,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const format = req.query.format as FormatType;

			const convertedImageBuffer = await sharp(req.file!.buffer)
				.toFormat(format)
				.toBuffer();

			res.set("Content-Type", `image/${format}`);
			res.send(convertedImageBuffer);
		} catch (error) {
			next(error);
		}
	},
);
