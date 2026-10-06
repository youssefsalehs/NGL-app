import { createTransport } from "nodemailer";
import { env } from "../config/env.js";

const transporter = createTransport({
  host: env.nodemailer.host || "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: env.nodemailer.user,
    pass: env.nodemailer.password,
  },
});

export async function sendEmail(to, subject, html) {
  try {
    const info = await transporter.sendMail({
      from: `"NGL App" <${env.nodemailer.user}>`,
      to,
      subject,
      html,
    });
    return info;
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Email could not be sent");
  }
}
