import { queryDataService } from "./search.types"
import { BadRequestError } from "../../errors/bad-request-error.ts";

import {
    searchRepo,
} from "./search.repository.ts"
export async function getSearchResultService(query: queryDataService) {
    if (query.q === "") throw new BadRequestError("Query param q required")
    let result = await searchRepo(query)
    console.log(result)
    let users = [], businesses = [], posts = [], events = [], data = {}

    switch (query.type) {
        case "users":
            users = result.filter(r => r.type==="user")
            data = {
                "users": users,
            }
            break;
        case "businesses":
            businesses = result.filter(r => r.type==="business")
            data = {
                "businesses": businesses,
            }
            break;
        case "events":
            events = result.filter(r => r.type==="event")
            data = {
                "events": events,
            }
            break;
        case "posts":
            posts = result.filter(r => r.type==="post")
            data = {
                "posts": posts,
            }
            break;
        default:
            users = result.filter(r => r.type==="user")
            businesses = result.filter(r => r.type==="business")
            events = result.filter(r => r.type==="event")
            posts = result.filter(r => r.type==="post")

            data = {
                "users": users,
                "businesses": businesses,
                "events": events,
                "posts": posts
            }
            break
        }
    return data
}