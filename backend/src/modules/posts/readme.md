# Post

this module is created for post api.There is sub modules named postComments and postLikes
as name suggest postComment module is to handle post comments and postLikes is to handle postLikes separately and making code clean and scalable


# APIs

- ** https.post(/posts/create-post) :-
     requires authentication if user is not authorized

     - **Controller :-
          postController() required: {title,description,postType,businessId} where description and businessId can be null;

        and process if user has uploaded files with post or not then according to process result calls postService() args : {
      title,
      description,
      postType,
      userId,
      media: file,
      businessId,
    }


       ```json
      return res
      .status(201)
      .json({ success: true, message: "post uploaded successfully", post });  
      ```


in future i will do more wait until      