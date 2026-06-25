import { BadRequestError } from "../../errors/bad-request-error.ts";
import { NotAuthorizedError } from "../../errors/not-authorised-error.ts";
import { NotFoundError } from "../../errors/not-found-error.ts";
import { cloudinaryUploader } from "../../utils/cloudinary-uploader.ts";
import { PostDataService } from "./post.types.ts";
import {
  createPost,
  getFeedRepo,
  findPostById,
  getPostDetails,
  updatePost,
  deletePost,
} from "./posts.repository.ts";

export async function postService(data: PostDataService) {
  try {
    if (!data.title.trim()) {
      throw new BadRequestError("title is required");
    }

    let cloudinaryUploadResult;
    if (data.media) {
      cloudinaryUploadResult = await cloudinaryUploader(data.media);
    }

    let post;

    if (cloudinaryUploadResult) {
      post = await createPost({
        ...data,
        mediaDetails: {
          cloud_id: cloudinaryUploadResult.public_id,
          mediaUrl: cloudinaryUploadResult.secure_url,
        },
      });
    } else {
      post = await createPost({ ...data, mediaDetails: null });
    }

    return post;
  } catch (err) {
    throw err;
  }
}

//* getFeed service

export async function getFeedService(cursor?: number, limit: number = 20) {
  try {
    const posts = await getFeedRepo(cursor, limit);
    return posts;
  } catch (err) {
    throw err;
  }
}

//* getPostById do not confuse with getPostById service its for when users wants to see specific post i do know how this thing is gone to be

export async function getPostDetailsService(id: number) {
  if (!id) {
    throw new BadRequestError("post id is Required");
  }

  try {
    const post = await getPostDetails(id);
    return post[0];
  } catch (err) {
    throw err;
  }
}

//*Update postDetails Service

export async function updatePostDetailsService(
  postId: number,
  userId: number,
  title: string,
  description: string,
) {
  const post = await findPostById(postId);

  if (!post) {
    return new NotFoundError("Post Not found");
  }

  if (post.user_id != userId) {
    return new NotAuthorizedError();
  }

  return await updatePost(postId, title, description);
}

//*Delete Post

export async function deletePostService(id: number, userId: number) {
  const post = await findPostById(id);
  if (!post) {
    throw new NotFoundError("Post not found");
  }

  if (post.user_id != userId) {
    throw new NotAuthorizedError();
  }

  return await deletePost(id);
}
