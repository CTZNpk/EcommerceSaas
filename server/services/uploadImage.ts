import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { Request } from "express";

export interface MulterRequest extends Request {
  userId?: string;
  file?: Express.Multer.File;
}

export async function uploadImageToCloudinary(
  folder: string,
  req: MulterRequest,
): Promise<string> {
  const multerReq = req as MulterRequest;

  const result = await cloudinary.uploader.upload(multerReq.file!.path, {
    folder: folder,
  });

  fs.unlinkSync(multerReq.file!.path);
  return result.secure_url;
}
