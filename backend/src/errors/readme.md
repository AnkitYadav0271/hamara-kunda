# Global Error Handler Middleware

A centralized error handling utility for the application. It catches all operational and unhandled errors, formats the response consistently, and logs details for debugging.



## Features

- **Standardized Payloads:** Ensures all API errors return a uniform JSON structure.
- **Environment Aware:** Automatically hides stack traces in production while showing them in development.
- **Integration Ready:** Plugs directly into our web framework middleware chain.
- **Logging:** Sends critical `500 Internal Server Error` events to our logging service.

## Standard Error Response Format

All caught errors are formatted into the following JSON structure:

```json
{
  "success": false,
  "error": {
    "statusCode": 400,//status code varies with error type
    "status": "fail",
    "message": "Invalid email address format.",
  }
}
```


# Usage 

- **ES6

import {NotFoundError} from "@/errors/not-found-error.ts"; //here NotFoundError is class


if(!user){
    throw new NotFoundError();
}

//thats it
