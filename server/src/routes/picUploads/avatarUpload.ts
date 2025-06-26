import { Request, Response } from "express";
// import cloudinary from "../utils/cloudinary";
import multer from "multer";
import cloudinary from "../../utils/cloudinary";
import prisma from "../../prisma/client";
// import prisma from "../prisma/client";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const uploadAvatarMiddleware = upload.single("avatar");

export const uploadAvatar = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "avatars",
      transformation: [{ width: 256, height: 256, crop: "thumb", gravity: "face" }],
    });

    const updatedUser = await prisma.user.update({
      where: { id: (req as any).user.id },  // assumes authenticateToken middleware adds req.user
      data: { avatarUrl: result.secure_url },
    });

    return res.status(200).json({
      message: "Avatar uploaded and user updated successfully",
      avatarUrl: updatedUser.avatarUrl,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Upload failed" });
  }
};
