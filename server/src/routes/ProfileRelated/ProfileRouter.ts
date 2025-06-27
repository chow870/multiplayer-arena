// routes/user.ts
import express from "express";
import { getUserProfile } from "../../controllers/ProfileRelated/getUserProfile";
import { updateUserProfile } from "../../controllers/ProfileRelated/updateUserProfile";
import { upload, uploadAvatar } from "../picUploads/avatarUpload";



const ProfileRouter = express.Router();

ProfileRouter.get("/profile",  getUserProfile);
ProfileRouter.patch("/profile", updateUserProfile);
ProfileRouter.post("/upload-avatar", upload.single("image"), uploadAvatar);


export default ProfileRouter;
