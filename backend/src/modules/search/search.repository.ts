import {queryData} from "./search.types.ts"
import {User} from "../users/users.types.ts"
import {Business} from "../businesses/business.types.ts"
import {Post} from "../posts/post.types.ts"
import {Event} from "../events/events.types.ts"

import {pool} from "../../config/db.ts"


export async function searchRepo(
    data: queryData,
):Promise<User[]>{
    let query = ""
    let values = []
    
    if (data.limit !== "") {
        const limit = parseInt(data.limit)
        query += `SELECT id, full_name AS name, NULL AS description, 'user' AS type
    FROM users 
    WHERE full_name ILIKE $1 OR user_name ILIKE $1

    UNION ALL
    
    SELECT id, business_name AS name, business_description AS description,'business' AS type
    FROM businesses
    WHERE business_name ILIKE $1 OR business_description ILIKE $1
    
    UNION ALL 

    SELECT id, post_title AS name, post_description AS description,'post' AS type
    FROM posts
    WHERE post_title ILIKE $1 OR post_description ILIKE $1
    
    UNION ALL

    SELECT id, event_title AS name, event_description AS description,'event' AS type
    FROM events
    WHERE event_title ILIKE $1 OR event_description ILIKE $1

    LIMIT $2;`

        values = [`%${data.q}%`,limit]
       
    } else {
        query += query= `SELECT id, full_name AS name, NULL AS description, 'user' AS type
    FROM users 
    WHERE full_name ILIKE $1 OR user_name ILIKE $1

    UNION ALL
    
    SELECT id, business_name AS name, business_description AS description,'business' AS type
    FROM businesses
    WHERE business_name ILIKE $1 OR business_description ILIKE $1
    
    UNION ALL 

    SELECT id, post_title AS name, post_description AS description,'post' AS type
    FROM posts
    WHERE post_title ILIKE $1 OR post_description ILIKE $1
    
    UNION ALL

    SELECT id, event_title AS name, event_description AS description,'event' AS type
    FROM events
    WHERE event_title ILIKE $1 OR event_description ILIKE $1;`

        values = [`%${data.q}%`]
    }

    const result = await pool.query(query,values)
    return result.rows 

}

// export async function searchEventRepo(
//     data: queryData,
// ):Promise<Event[]>{

//     const query= "SELECT * FROM events WHERE event_title ILIKE $1 OR event_description ILIKE $1"
//     const values = [`%${data.q}%`]
//     const events = await pool.query(query,values)
    
//     return events.rows
// }

