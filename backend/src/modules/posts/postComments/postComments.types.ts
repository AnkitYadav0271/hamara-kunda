

export interface Comment {
    id:number;
    user_id:number;
    post_id:number;
    comment:string;
    created_at:Date;
    updated_at:Date;
    comment_status:"active"|"hidden"|"deleted";
    
}