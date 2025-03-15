import { ENV } from "config/env";
import nodemailer from "nodemailer";

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
): Promise<void> {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: ENV.EMAIL_USER,
      pass: ENV.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: ENV.EMAIL_USER,
    to: to,
    subject: subject,
    html: html,
  };

  await transporter.sendMail(mailOptions);
}
