import {queryData} from "./search.types.ts"
import {User} from "../users/users.types.ts"
import {Business} from "../businesses/business.types.ts"
import {Post} from "../posts/post.types.ts"
import {Event} from "../events/events.types.ts"

import {pool} from "../../config/db.ts"


export async function searchUserRepo(
    data: queryData,
):Promise<User[]>{

    const query= "SELECT * FROM users WHERE full_name ILIKE $1 OR user_name ILIKE $1"
    const values = [`%${data.q}%`]
    const users = await pool.query(query,values)
    
    return users.rows
}

export async function searchBusinessRepo(
    data: queryData,
):Promise<Business[]>{

    const query= "SELECT * FROM businesses WHERE business_name ILIKE $1 OR business_description ILIKE $1"
    const values = [`%${data.q}%`]
    const businesses = await pool.query(query,values)
    
    return businesses.rows
}

export async function searchPostRepo(
    data: queryData,
):Promise<Post[]>{

    const query= "SELECT * FROM posts WHERE post_title ILIKE $1 OR post_description ILIKE $1"
    const values = [`%${data.q}%`]
    const posts = await pool.query(query,values)
    
    return posts.rows
}
export async function searchEventRepo(
    data: queryData,
):Promise<Event[]>{

    const query= "SELECT * FROM events WHERE event_title ILIKE $1 OR event_description ILIKE $1"
    const values = [`%${data.q}%`]
    const events = await pool.query(query,values)
    
    return events.rows
}

