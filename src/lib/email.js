import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
 service: "gmail", // or your SMTP provider
 auth: {
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS, // Use an App Password for Gmail
 },
});
