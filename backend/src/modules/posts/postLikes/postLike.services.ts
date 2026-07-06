import { BadRequestError } from "../../../errors/bad-request-error.ts";
import { NotAuthorizedError } from "../../../errors/not-authorised-error.ts";
import { NotFoundError } from "../../../errors/not-found-error.ts";
import { findPostById } from "../posts.repository.ts";
import { findUserById } from "../../users/users.repository.ts";
import {
  doLikePost,
  findLikesByPost,
  undoLikes,
} from "./postLike.repository.ts";

//*Do post Likes
export async function doLikePostService(postId: number, userId: number) {
  if (!postId) {
    throw new BadRequestError("Missing postId");
  }

  if (!userId) {
    throw new NotAuthorizedError();
  }

  try {
    const post = await findPostById(postId);
    if (!post) {
      return new NotFoundError("Post not found");
    }
    const like = await doLikePost(postId, userId);
    return like;
  } catch (err) {
    throw err;
  }
}

//*getLikes of posts

export async function getPostLikesService(postId: number) {
  if (!postId) {
    throw new BadRequestError("postId is missing");
  }

  try {
    const post = await findPostById(postId);

    if (!post) {
      return new NotFoundError("Post not found");
    }
    return await findLikesByPost(postId);
  } catch (err) {
    throw err;
  }
}

//* undoLike
export async function undoLikeService(postId: number, userId: number) {
  try {
    const post = await findPostById(postId);
    if (!post) {
      return new NotFoundError("Post not found");
    }

    const user = await findUserById(userId);

    if (!user) {
      return new NotFoundError("User not found");
    }

    return await undoLikes(postId, userId);
  } catch (err) {
    throw err;
  }
}
