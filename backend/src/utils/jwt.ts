import jwt, { JwtPayload } from "jsonwebtoken";
import { NotAuthorizedError } from "../errors/not-authorised-error";

interface JwtUserPayload extends JwtPayload {
  userId: number;
}

export async function jwtTokenSign(
  userId: number,
  expiresAt: string,
): Promise<string> {
  try {
    const token = jwt.sign({ userId: userId }, process.env.JWT_SECRET!, {
      expiresIn: expiresAt,
    });

    return token;
  } catch (err) {
    throw err;
  }
}

export function decodeToken(token: string): number {
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET!) as JwtUserPayload;
    return decode?.userId;
  } catch {
    throw new NotAuthorizedError();
  }
}
