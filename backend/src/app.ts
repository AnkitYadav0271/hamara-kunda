import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import express from "express";
import UserRouter from "./modules/users/users.route.ts";
import PostRouter from "./modules/posts/posts.route.ts";
import { errorHandler } from "./errors/error-handler.ts";

const PORT = process.env.PORT || 6969;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/users", UserRouter);
app.use("/api", PostRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log("app is running on port:6969");
});
