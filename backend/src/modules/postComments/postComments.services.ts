import { ForbiddenError } from "../../errors/forbidden-error.ts";
import { NotAuthorizedError } from "../../errors/not-authorised-error.ts";
import { NotFoundError } from "../../errors/not-found-error.ts";
import { findPostById } from "../posts/posts.repository.ts";
import { findUserById } from "../users/users.repository.ts";
import {
  createPostComment,
  deletePostComment,
  updatePostComment,
  findPostCommentById,
  getPostComments,
} from "./postComments.repository.ts";

//* createPostComment
export async function createPostCommentService(
  postId: number,
  userId: number,
  comment: string,
) {
  try {
    const post = await findPostById(postId);
    if (!post) {
      throw new NotFoundError("Post Not found");
    }

    const user = await findUserById(userId);

    if (!user) {
      throw new NotAuthorizedError("User with given id is not present");
    }

    return await createPostComment(postId, userId, comment);
  } catch (err) {
    throw err;
  }
}

//*getPostComments

export async function getPostCommentsService(postId: number) {
  try {
    const post = await findPostById(postId);
    if (!post) {
      throw new NotFoundError("post Not Found");
    }

    return await getPostComments(postId);
  } catch (err) {
    throw err;
  }
}

//*editPost comment

export async function updatePostCommentService(
  commentId: number,
  userId: number,
  comment: string,
) {
  try {
    const commentExist = await findPostCommentById(commentId);
    const user = await findUserById(userId);
    if (!commentExist) {
      throw new NotFoundError("comment not found");
    }
    if (!user) {
      throw new NotAuthorizedError("Can not find user with given Id");
    }

    if (commentExist.user_id != userId) {
      throw new ForbiddenError();
    }

    return await updatePostComment(commentId, userId, comment);
  } catch (err) {
    throw err;
  }
}

//*deletePostComment

export async function deletePostCommentService(
  commentId: number,
  userId: number,
) {
  try {
    const comment = await findPostCommentById(commentId);
    if (!comment) {
      throw new NotFoundError("Comment not Found");
    }
    const user = await findUserById(userId);
    if (!user) {
      throw new NotAuthorizedError("Can not find user with given Id");
    }

    if (comment.user_id != userId) {
      throw new ForbiddenError();
    }

    return await deletePostComment(commentId, userId);
  } catch (err) {
    throw err;
  }
}
