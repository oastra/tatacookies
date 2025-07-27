import formidable from "formidable";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { createElement } from "react";
import ContactConfirmation from "@/emails/contactConfirmation";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const form = formidable({
    keepExtensions: true,
    maxFileSize: 2 * 1024 * 1024,
  });

  form.parse(req, async (err, fields) => {
    if (err) {
      console.error("❌ Form parse error:", err);
      return res.status(500).json({ error: "Error parsing form data" });
    }

    res.status(200).json({ success: true });

    const formType = fields.formType?.toString() || "other";
    const isContact = formType === "contact";

    const authUser = isContact
      ? process.env.INFO_EMAIL_USER
      : process.env.ORDER_EMAIL_USER;
    const authPass = isContact
      ? process.env.INFO_EMAIL_PASS
      : process.env.ORDER_EMAIL_PASS;
    const teamRecipient = authUser;

    const transporter = nodemailer.createTransport({
      host: "mail.privateemail.com",
      port: 465,
      secure: true,
      auth: { user: authUser, pass: authPass },
    });

    try {
      // Send email to Tatacookies team
      const teamMail = await transporter.sendMail({
        from: `"Tatacookies ${formType}" <${authUser}>`,
        to: teamRecipient,
        subject: `📩 New ${formType} submission from ${fields.name}`,
        text: `
Name: ${fields.name}
Email: ${fields.email}
Phone: ${fields.phone}
Message: ${fields.message || "-"}
        `,
        replyTo: fields.email,
      });

      console.log("✅ Team email sent:", teamMail.response);

      // Confirmation to customer
      try {
        const confirmationHTML = await render(
          createElement(ContactConfirmation, { name: fields.name })
        );

        await transporter.sendMail({
          from: `"Tatacookies" <${authUser}>`,
          to: fields.email,
          subject: "🎉 We received your message!",
          html: confirmationHTML,
        });

        console.log(`✅ Confirmation sent to ${fields.email}`);
      } catch (renderErr) {
        console.error("❌ Email render/send error:", renderErr);
      }
    } catch (emailErr) {
      console.error("❌ Email send error:", emailErr);
    }
  });
}
