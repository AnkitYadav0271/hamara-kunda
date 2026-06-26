export interface PostDataRepo {
  title: string;
  description?: string;
  userId: number;
  businessId: number | null;
  postType: "user" | "alert" | "business" | "news" | "sponsored";
  mediaDetails?: {
    mediaUrl: string;
    cloud_id: string;
  } | null;
}

export interface PostDataService {
  userId: number;
  businessId: number | null;
  title: string;
  description?: string;
  postType: "user" | "alert" | "business" | "news" | "sponsored";
  media?: Buffer; //buffer ke jagah multer karenge aur dekhenge kya kar sakete hai
}

export interface Post {
  id: number;
  user_id: number;
  business_id: number | null;
  post_title: string;
  post_description: string | null;
  created_at: Date;
  post_status: "active" | "hidden" | "deleted";
  post_type: "user" | "business" | "alert" | "news" | "sponsored";
}
