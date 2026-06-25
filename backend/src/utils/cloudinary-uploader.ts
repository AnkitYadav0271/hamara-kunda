import cloudinary from "../config/cloudinary.config.ts";
import streamifier from "streamifier";

export const cloudinaryUploader = async (file: Buffer) => {
    try{
  const uploadResult = await new Promise<any>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "dravidian-campus/gallery" },
      (error, result) => {
        if (error) {
          console.log("Logging the error", error);
          reject(error);
        }
        console.log("Logging the result :", result);
        resolve(result);
      },
    );

    console.log("Logging the stream", stream);

    streamifier.createReadStream(file).pipe(stream);
  });

  return uploadResult;
}catch(err){
    throw new Error("Error while uploading cloudinary image");
}
};
