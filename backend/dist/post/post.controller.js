var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
import cloudinary from "cloudinary";
import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";
import ErrorHandler from "../utils/errorHandler.js";
export const createPost = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (!req.file) {
      return next(new ErrorHandler("Please enter all fields", 400));
    }
    const myCloud = yield cloudinary.v2.uploader.upload(req.file.path, {
      folder: "gallery",
    });
    const newPostData = {
      caption: req.body.caption ? req.body.caption : "",
      image: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
      owner: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
    };
    if (!newPostData.owner) {
      return res.status(400).json({
        success: false,
        message: "Unauthorized. User not found.",
      });
    }
    const newPost = yield Post.create(newPostData);
    const user = yield User.findById(
      (_b = req.user) === null || _b === void 0 ? void 0 : _b._id
    );
    if (user) {
      user.posts.unshift(newPost._id);
      yield user.save();
    }
    return res.status(201).json({
      success: true,
      message: "Post created.",
    });
  });
