import formidable from "formidable";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import ContactConfirmation from "@/emails/contactConfirmation";
import { colors } from "@/emails/styles";

export const config = {
  api: {
    bodyParser: false, // Required for formidable
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const form = formidable({
    keepExtensions: true,
    maxFileSize: 2 * 1024 * 1024, // 2MB file size limit
  });

  form.parse(req, async (err, fields) => {
    if (err) {
      console.error("Form parse error:", err);
      return res.status(500).json({ error: "Error parsing form data" });
    }

    //  Send success response immediately
    res.status(200).json({ success: true });

    //  Create transporter for Private Email
    const transporter = nodemailer.createTransport({
      host: "mail.privateemail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER, // e.g., info@tatacookies.com
        pass: process.env.EMAIL_PASS,
      },
    });

    try {
      //  Email to Tatacookies Team
      await transporter.sendMail({
        from: `"Tatacookies Contact Form" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_TO, // e.g., info@tatacookies.com
        subject: `📩 New Contact Form Submission from ${fields.name}`,
        text: `
New Contact Form Submission:

Name: ${fields.name}
Email: ${fields.email}
Message: ${fields.message}
        `,
        replyTo: fields.email,
      });

      console.log("✅ Notification sent to Tatacookies team");

      // Confirmation Email to Customer
      const confirmationHTML = render(
        <ContactConfirmation name={fields.name} />
      );

      await transporter.sendMail({
        from: `"Tatacookies" <${process.env.EMAIL_USER}>`,
        to: fields.email,
        subject: " We received your message!",
        html: confirmationHTML,
      });

      console.log(`✅ Confirmation email sent to ${fields.email}`);
    } catch (error) {
      console.error("Email send error:", error);
    }
  });
}
