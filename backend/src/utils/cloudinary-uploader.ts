import { json } from "node:stream/consumers";
import cloudinary from "../config/cloudinary.config.ts";
import streamifier from "streamifier";

export const cloudinaryUploader = async (file: Buffer, path: string) => {
  try {
    const uploadResult = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: `${path}` },
        (error, result) => {
          if (error) {
            console.error("Logging the error", JSON.stringify(error));
            return reject(error);
          }
          console.log("Logging the result :", result);
          resolve(result);
        },
      );

      console.log("Logging the stream", stream);

      streamifier.createReadStream(file).pipe(stream);
    });

    return uploadResult;
  } catch (err) {
    console.error("Logging error:::", JSON.stringify(err));
    throw err;
  }
};
