import type { Request, Response } from "express";
import { registerUserService } from "./users.services.ts";

export const registerUserController = async (
  req: Request,
  res: Response
) => {

    console.log("Logging req.body:",req.body);
  const user = await registerUserService(req.body);

  return res.status(201).json({
    success: true,
    message: "User created successfully. Please verify Email",
    user,
  });
};