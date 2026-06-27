import { pool } from "../../config/db.ts";
import { Business, BusinessDataIORepo, Category } from "./business.types.ts";

//*create business repository
export async function createBusiness(
  data: BusinessDataIORepo,
): Promise<Business | undefined> {
  const query = `INSERT INTO businesses(user_id,business_name,business_description,business_address,category_id,contact_number,email,website,business_profile_image_url,business_profile_image_public_id)
                   VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`;

  const {
    userId,
    businessName,
    businessAddress,
    businessDescription,
    categoryId,
    contactNumber,
    email,
    website,
  } = data;

  let imageUrl;
  let imagePublicId;

  if (data.profileImage) {
    imagePublicId = data.profileImage.imagePublicId;
    imageUrl = data.profileImage.imageUrl;
  }
  const values = [
    userId,
    businessName,
    businessDescription,
    businessAddress,
    categoryId,
    contactNumber,
    email,
    website,
    imageUrl,
    imagePublicId,
  ];

  try {
    const business = await pool.query(query, values);
    return business.rows[0];
  } catch (err) {
    throw err;
  }
}

//*FindCategoryIdByCategoryName

export async function findCategoryIdByCategoryName(
  categoryName: Category,
): Promise<number | undefined> {
  const query = `SELECT * FROM business_categories WHERE category_name = $1`;
  const values = [categoryName];
  try {
    return (await pool.query(query, values)).rows[0]?.id;
  } catch (error) {
    throw error;
  }
}
