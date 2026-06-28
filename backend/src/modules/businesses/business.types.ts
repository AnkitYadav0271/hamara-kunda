export interface BusinessDataIO {
  userId: number;
  businessName: string;
  businessAddress: string;
  categoryName: Category;
  contactNumber: string;
  profileImage?: {
    imageUrl: string;
    imagePublicId: string;
  };
  businessDescription?: string;
  website?: string;
  email?: string;
}

export interface BusinessDataIORepo {
  userId: number;
  businessName: string;
  businessAddress: string;
  categoryId: number;
  contactNumber: string;
  profileImage?: {
    imageUrl: string;
    imagePublicId: string;
  };
  businessDescription?: string;
  website?: string;
  email?: string;
}

export interface Business {
  id: number;
  category_id: number;
  business_name: string;
  business_address: string;
  user_id: number;
  website?: string;
  contact_number: string;
  email?: string;
  status: "deleted" | "active" | "hidden";
  verified_at: Date | null;
  sponsored_until: Date | null;
}

export type Category =
  | "Education"
  | "Grocery"
  | "Hospital"
  | "Fruits"
  | "Vegetables"
  | "Pharmacy"
  | "Dental Clinic"
  | "Optical"
  | "Beauty & Salon"
  | "Fashion & Clothing"
  | "Footwear"
  | "Jwellery"
  | "Mobile & Electronics"
  | "Sweets"
  | "Automobile"
  | "Computer Services"
  | "CSC Center"
  | "Fuel Station"
  | "Furniture"
  | "Others";

export interface UpdateBusinessData {
  userId: number;
  id: number;
  businessName: string;
  businessAddress: string;
  businessDescription?: string;
  contactNumber: string;
  categoryName: Category;
  email?: string;
  website?: string;
}

export interface UpdateBusinessDataRepo {
  userId: number;
  id: number;
  businessName: string;
  businessAddress: string;
  businessDescription?: string;
  contactNumber: string;
  categoryId: number;
  email?: string;
  website?: string;
}
