import { CreateUserData, User } from "../../utils/users.types.ts";
import {createUser, findUserByEmail} from "./users.repository.ts"



export async function registerUserService(data:CreateUserData){
    const existingUser =await findUserByEmail(data.email);
    if(existingUser){
        
    }
    const result = await createUser(data);
    return result;
}