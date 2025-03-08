import { v2 as cloudinary } from "cloudinary"
//sharp is a high-performance image processing library, allows to manipulate images quickly like resizing, converting formats, compressing
import sharp from "sharp";
import crypto from "crypto";

function generateSignature(params: Record<string, string>) {
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (!apiSecret) {
        throw new Error("CLOUDINARY_API_SECRET is missing");
    }

    // Step 1: Sort parameters alphabetically and format as `key=value`
    const sortedParams = Object.keys(params)
        .sort()
        .map((key) => `${key}=${params[key]}`)
        .join("&");



    // Step 2: Generate SHA-1 hash for Cloudinary
    return crypto.createHash("sha1").update(`${sortedParams}${apiSecret}`).digest("hex");
}


cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    signature_algorithm: 'sha1'
});
export const uploadOnCloudinary = async (fileBuffer: Buffer, fileType: string) => {
    try {
        //fileBuffer will have uploaded file
        if (!fileBuffer) return null;

        //why convert to .webp - Smaller file sizes with almost no loss in quality,faster loading
        // The quality parameter determines the compression level 1 is very low quality used for tiny previews, small logos
        const processedImage = await sharp(fileBuffer)
            .webp({ quality: 1 }) // Converts image to .webp with low quality (1)
            .toBuffer();

        //Converting an image to Base64 transforms it into a text-based string that can be easily transferred over HTTP protocols without being corrupted.also using base64 cloudinary handels everything in memory hence no need for temporary file storage on server
        const fileStr = `data:image/webp;base64,${processedImage.toString('base64')}`;

        let timestamp = Math.floor(Date.now() / 1000);

        const params = {
            timestamp: timestamp.toString(),
            folder: "testimonials/logoandavatar",
            format: "webp",

        };
        timestamp = timestamp;
        const signature = generateSignature(params);
        console.log("Generated Signature:", signature);

        const response = await cloudinary.uploader.upload(fileStr, {

            folder: "testimonials/logoandavatar",
            format: "webp",
            api_key: process.env.CLOUDINARY_API_KEY!,
            timestamp: timestamp,
            signature,
        });

        //response will have url for http url and public_id for unique path to image in cloudinary
        return response;
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        return null;
    }
};

export const deleteFromCloudinary = async (publicId: string) => {
    try {
        const res = await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error("Error deleting from Cloudinary:", error);
    }
}

export async function doesCloudinaryResourceExist(publicId: string): Promise<boolean> {
    try {
        await cloudinary.api.resource(publicId);
        return true; // Resource exists
    } catch (error: any) {
        if (error.http_code === 404) {
            return false; // Resource not found
        }
        return false; // For any other error, return false without throwing
    }
}

