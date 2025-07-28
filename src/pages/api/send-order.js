import formidable from "formidable";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import CustomOrderConfirmation from "@/emails/customOrderConfirmation"; // adjust if needed

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const form = formidable({
    keepExtensions: true,
    maxFileSize: 2 * 1024 * 1024, // 2MB
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parse error:", err);
      return res.status(500).json({ error: "Error parsing form data" });
    }

    res.status(200).json({ success: true }); // ✅ Respond fast

    // === Build attachments ===
    const attachments = [];
    const imageFile = files.image?.[0];
    if (imageFile && imageFile.filepath) {
      attachments.push({
        filename: imageFile.originalFilename,
        path: imageFile.filepath,
        contentType: imageFile.mimetype,
      });
    }

    // === Create transporter ===
    const transporter = nodemailer.createTransport({
      host: "mail.privateemail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // === Admin email ===
    const adminMailOptions = {
      from: `"Tatacookies" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: `New Cookie Order from ${fields.name}`,
      text: `
New Cookie Order:

Name: ${fields.name}
Email: ${fields.email}
Phone: ${fields.phone}
Theme: ${fields.theme}
Event Date: ${fields.eventDate}
Delivery Method: ${fields.deliveryOption}
Quantity: ${fields.quantity}
Budget per Cookie: ${fields.budgetOption}
Address: ${fields.address}
Design Details: ${fields.detailsOption}
Notes: ${fields.notes || "None"}
      `,
      attachments,
    };

    transporter.sendMail(adminMailOptions).catch((error) => {
      console.error("Admin email send error:", error);
    });

    // === Customer email (rendered HTML) ===
    const confirmationHtml = render(
      <CustomOrderConfirmation
        name={fields.name}
        eventDate={fields.eventDate}
        theme={fields.theme}
        quantity={fields.quantity}
        deliveryMethod={fields.deliveryOption}
      />
    );

    const customerMailOptions = {
      from: `"Tatacookies" <${process.env.EMAIL_USER}>`,
      to: fields.email,
      subject: "Tatacookies – We've received your order!",
      html: confirmationHtml,
    };

    transporter.sendMail(customerMailOptions).catch((error) => {
      console.error("Customer email send error:", error);
    });
  });
}
