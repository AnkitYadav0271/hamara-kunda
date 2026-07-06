import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import express from "express";
import UserRouter from "./modules/users/users.route.ts";
import PostRouter from "./modules/posts/posts.route.ts";
import PostCommentRouter from "./modules/posts/postComments/postComments.route.ts";
import LikePostRouter from "./modules/posts/postLikes/postLike.route.ts";
import BusinessRouter from "./modules/businesses/business.route.ts";
import BusinessFollowRouter from "./modules/businesses/businessFollowers/businessFollowers.route.ts";
import BusinessRatingRouter from "./modules/businesses/businessRatings/businessRatings.route.ts";
import EventRouter from "./modules/events/events.route.ts";
import { errorHandler } from "./errors/error-handler.ts";

const PORT = process.env.PORT || 6969;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/users", UserRouter);
app.use("/api/posts", PostRouter);
app.use("/api/posts", LikePostRouter);
app.use("/api/posts", PostCommentRouter);
app.use("/api/business", BusinessRouter);
app.use("/api/business", BusinessFollowRouter);
app.use("/api/business", BusinessRatingRouter);
app.use("/api/events", EventRouter);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log("app is running on port:6969");
});
