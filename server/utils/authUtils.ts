import { ENV } from "config/env";
import jwt from "jsonwebtoken";
import { Response } from "express";

export function generateRefreshToken(id: string): string {
  return jwt.sign({ id }, ENV.JWT_SECRET, { expiresIn: "15m" });
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): boolean {
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/;
  return passwordRegex.test(password);
}

export function attachAccessToken(
  res: Response,
  id: string,
  accountType: string,
) {
  const accessToken = jwt.sign({ id, accountType }, ENV.JWT_SECRET, {
    expiresIn: "15m",
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 60 * 1000,
    path: "/",
  });
}

export function attachRefreshToken(
  res: Response,
  id: string,
  accountType: string,
) {
  const refreshToken = jwt.sign({ id, accountType }, ENV.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use HTTPS in production
    sameSite: "lax", // Use 'lax' for cross-origin navigation support
    maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
    path: "/", // Ensure it's available for all routes
  });
}
