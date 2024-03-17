import { NextFunction, Request, Response } from "express";
import cloudinary from "cloudinary";
import { IUser, User } from "../models/user.model";
import { AuthRequest } from "../middleware/auth.middleware";
import { Post } from "../models/post.model";
import ErrorHandler from "../utils/errorHandler";

export const createPost = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) {
    return next(new ErrorHandler("Please enter all fields", 400));
  }

  const myCloud = await cloudinary.v2.uploader.upload(req.file.path, {
    folder: "gallery",
  });

  const newPostData = {
    caption: req.body.caption ? req.body.caption : "",
    image: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
    owner: req.user?._id,
  };

  if (!newPostData.owner) {
    return res.status(400).json({
      success: false,
      message: "Unauthorized. User not found.",
    });
  }

  const newPost = await Post.create(newPostData);

  const user = await User.findById(req.user?._id);
  if (user) {
    user.posts.unshift(newPost._id);
    await user.save();
  }

  return res.status(201).json({
    success: true,
    message: "Post created.",
  });
};
