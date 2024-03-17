import express from "express";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import { createPost } from "./post.controller.js";
import multer from "multer";
const router = express.Router();
// Setting up multer middlware to handle file upload
const upload = multer({ dest: "uploads/" });
router.post(
  "/post/create",
  isAuthenticated,
  upload.single("image"),
  createPost
);
export default router;
