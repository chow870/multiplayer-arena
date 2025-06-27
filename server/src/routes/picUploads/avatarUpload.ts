import { Request, Response } from "express";
import cloudinary from "../../utils/cloudinary";
import multer from "multer";
import fs from "fs";

// Multer config
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (_, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

export const upload = multer({ storage });

export const uploadAvatar = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const result = await cloudinary.uploader.upload(file.path, {
      folder: "avatars",
      width: 300,
      height: 300,
      crop: "fill", // Optional server-side crop
    });

    // Clean up local temp file
    fs.unlinkSync(file.path);

    return res.status(200).json({ imageUrl: result.secure_url });
  } catch (err) {
    return res.status(500).json({ message: "Upload failed", error: err });
  }
};
