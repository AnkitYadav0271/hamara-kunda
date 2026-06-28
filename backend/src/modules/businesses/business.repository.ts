import { resourceUsage } from "node:process";
import { pool } from "../../config/db.ts";
import {
  Business,
  BusinessDataIORepo,
  Category,
  UpdateBusinessData,
  UpdateBusinessDataRepo,
} from "./business.types.ts";

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

//* GetBusiness

export async function getAllBusinesses(limit: number, cursor?: number) {
  let query;
  let values;
  if (cursor) {
    query = `
    SELECT *
    FROM businesses b
    WHERE b.id > $1 AND business_status = $3
    ORDER BY b.id ASC
    LIMIT $2
  `;

    values = [cursor, limit, "active"];
  } else {
    query = `
    SELECT *
    FROM businesses b
    WHERE b.business_status = $2
    ORDER BY b.id ASC
    LIMIT $1
  `;

    values = [limit, "active"];
  }
  try {
    const businesses = await pool.query(query, values);
    return businesses.rows;
  } catch (err) {
    throw err;
  }
}

//*get business by Id
export async function findBusinessById(id: number): Promise<Business | null> {
  const query = `SELECT * FROM businesses WHERE id = $1 AND business_status = $2`;
  const value = [id, "active"];
  try {
    const business = await pool.query(query, value);
    return business.rows[0];
  } catch (err) {
    throw err;
  }
}

//*getBusinessByUserId

export async function findBusinessByUserId(
  userId: number,
): Promise<Business[] | null> {
  const query = `SELECT * FROM businesses WHERE user_id = $1 WHERE business_status = $2`;
  const value = [userId, "active"];

  try {
    const businesses = await pool.query(query, value);
    return businesses.rows;
  } catch (err) {
    throw err;
  }
}

export async function findBusinessByName(
  name: string,
): Promise<Business | null> {
  const query = `SELECT * FROM businesses WHERE business_name = $1 WHERE business_status = $2`;
  const value = [name, "active"];

  try {
    return (await pool.query(query, value)).rows[0];
  } catch (err) {
    throw err;
  }
}

//*updateBusiness

export async function updateBusiness(
  data: UpdateBusinessDataRepo,
): Promise<Business | null> {
  const query = `UPDATE businesses SET business_name = $1,business_address = $2, business_description = $3,
                 email= $4 , contact_number = $5,website = $6,category_id = $7 WHERE id = $8 RETURNING *`;
  const values = [
    data.businessName,
    data.businessAddress,
    data.businessDescription,
    data.email,
    data.contactNumber,
    data.website,
    data.categoryId,
    data.id,
  ];

  try {
    return (await pool.query(query, values)).rows[0];
  } catch (err) {
    throw err;
  }
}

//*Delete Business

export async function deleteBusiness(businessId: number) {
  const query = `UPDATE businesses SET business_status = $2 WHERE id = $1 RETURNING *`;
  const values = [businessId, "deleted"];
  try {
    return (await pool.query(query, values)).rows[0];
  } catch (err) {
    throw err;
  }
}
