import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET || "your_secret_key";

export interface CustomRequest extends Request {
  userId?: string;
}

export const authMiddleware = (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.cookies?.accessToken;

  if (!token) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, secretKey) as JwtPayload;
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
