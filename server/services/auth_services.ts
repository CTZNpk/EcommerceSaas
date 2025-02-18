import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

export function generateAccessToken(id: string): string {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "15m" });
}

export function generateRefreshToken(id: string): string {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "7d" });
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
