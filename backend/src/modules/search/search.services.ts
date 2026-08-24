import {queryDataService} from "./search.types"
import {searchUserRepo,
    searchBusinessRepo,
    searchPostRepo,
    searchEventRepo,
} from "./search.repository.ts"
export async function getSearchResultService(query: queryDataService) {
    const users = await searchUserRepo(query)
    const businesses = await searchBusinessRepo(query)
    const posts = await searchPostRepo(query)
    const events = await searchEventRepo(query)

    const data={
        "users": users,
        "businesses":businesses,
        "posts":posts,
        "events":events,
    }
    return data
}