import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import Cors from "cors";
import cloudinary from "cloudinary";
const app = express();
dotenv.config({
    path: "src/config/.env",
});
// Using middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(Cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}));
// Connecting to the databse
connectDB();
// Configuring Cloudinary
cloudinary.v2.config({
    cloud_name: process.env.CLD_NAME,
    api_key: process.env.CLD_API_KEY,
    api_secret: process.env.CLD_API_SECRET,
});
app.get("/", (req, res) => {
    res.send("Hello World!");
});
// Importing routes
import AuthRoutes from "./auth/auth.routes.js";
import ErrorMiddleware from "./middleware/error.js";
import PostRoutes from "./post/post.routes.js";
// Using routes
app.use("/api/v1", AuthRoutes);
app.use("/api/v1", PostRoutes);
// Using middleware for exception handling
app.use(ErrorMiddleware);
app.listen(process.env.PORT, () => {
    return console.log(`Express is listening at http://localhost:${process.env.PORT}`);
});
