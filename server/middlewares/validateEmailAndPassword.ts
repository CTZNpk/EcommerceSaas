import { validateEmail, validatePassword } from "utils/authUtils";
import { Request, Response, NextFunction } from "express";

export function validateEmailPassword(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { email, password } = req.body;

  const isValidEmail = validateEmail(email);
  if (!isValidEmail) {
    res.status(400).json({ message: "Invalid Email" });
    return;
  }

  const isValidPass = validatePassword(password);
  if (!isValidPass) {
    res.status(400).json({
      message:
        "Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character.",
    });
    return;
  }

  next();
}
