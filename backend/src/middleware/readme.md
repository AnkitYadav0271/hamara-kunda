# Global Middleware 

 Centralized middleware that are currently (auth.middleware.ts) and (mediaUpload.middleware.ts). Name suggest it self first one is for authentication and second one is to upload media over cloudinary

# Features 

- **Each middleware is responsible for one task

# Auth Middleware

Auth Middleware extracts token from request header and verify it against jwt

- **if token is not present returns NotAuthorized error handler Middleware.
- **if token is present then simply then add req.user = user in the req field and calls nextFunction();


# mediaUpload Middleware

- ** just returns mediaUploadMiddleware then we can use.
