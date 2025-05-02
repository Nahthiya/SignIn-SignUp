import dotenv from 'dotenv';
dotenv.config(); 
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export function sendMail({ to, subject, html }) {
  return transporter.sendMail({
    from: `"MyApp Support" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}
