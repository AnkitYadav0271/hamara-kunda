import { BadRequestError } from "../../errors/bad-request-error.ts";
import { cloudinaryUploader } from "../../utils/cloudinary-uploader.ts";
import { PostDataService } from "./post.types.ts";
import { createPost, getFeedRepo } from "./posts.repository.ts";

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

export async function getFeedService(cursor?: number, limit: number = 20) {
  try {
    const posts = await getFeedRepo(cursor, limit);
    return posts;
  } catch (err) {
    throw err;
  }
}
