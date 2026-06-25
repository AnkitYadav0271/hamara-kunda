import { BadRequestError } from "../../errors/bad-request-error.ts";
import { cloudinaryUploader } from "../../utils/cloudinary-uploader.ts";
import { PostDataService } from "./post.types.ts";
import { createPost, getFeedRepo, findPostById } from "./posts.repository.ts";

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

export async function getPostService(id: number) {
  if (!id) {
    throw new BadRequestError("post id is Required");
  }

  try {
    const post = await findPostById(id);
    return post[0];
  } catch (err) {
    throw err;
  }
}
