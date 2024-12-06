import { Router } from "express";
import { registerUser } from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 }, // Keep field name as "avatar"
        { name: "coverImage", maxCount: 1 }, // Use consistent camelCase
    ]),
  registerUser
);

export default router;
