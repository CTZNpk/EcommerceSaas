import { AccountType } from "@models/user";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { attachRefreshToken } from "utils/authUtils";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

export interface CustomRequest extends Request {
  userId?: string;
  accountType?: string;
}

export const auth = (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): void => {
  const accessToken = req.cookies?.accessToken;
  const refreshToken = req.cookies?.refreshToken;

  if (!accessToken || !refreshToken) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(accessToken, JWT_SECRET) as {
      id: string;
      accountType: string;
    };

    req.userId = decoded.id;
    req.accountType = decoded.accountType;
    return next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      try {
        const refreshDecoded = jwt.verify(
          refreshToken,
          JWT_SECRET,
        ) as JwtPayload;

        attachRefreshToken(res, refreshDecoded.id, refreshDecoded.accountType);

        req.userId = refreshDecoded.id;
        return next();
      } catch (refreshError) {
        res
          .status(401)
          .json({ message: "Unauthorized: Invalid or expired refresh token" });
        return;
      }
    }

    res.status(401).json({ message: "Unauthorized: Invalid access token" });
  }
};

export const isAdmin = (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  if (req.accountType !== AccountType.ADMIN) {
    res.status(403).json({ message: "Access denied, admin only" });
    return;
  }
  next();
};

export const isUser = (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  if (req.accountType !== AccountType.USER) {
    res.status(403).json({ message: "Access denied, admin only" });
    return;
  }
  next();
};

export const isVendor = (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  if (req.accountType !== AccountType.VENDOR) {
    res.status(403).json({ message: "Access denied, admin only" });
    return;
  }
  next();
};
