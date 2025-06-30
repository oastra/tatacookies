import formidable from "formidable";
import nodemailer from "nodemailer";

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

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error("Form parse error:", err);
      return res.status(500).json({ error: "Error parsing form data" });
    }

    // ✅ Send success response immediately
    res.status(200).json({ success: true });

    // ✅ Prepare attachment if present
    const attachments = [];
    const imageFile = files.image?.[0];

    if (imageFile && imageFile.filepath) {
      attachments.push({
        filename: imageFile.originalFilename,
        path: imageFile.filepath,
        contentType: imageFile.mimetype,
      });
    }

    // ✅ Prepare email
    const mailOptions = {
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

    // ✅ Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ✅ Send email in background
    transporter.sendMail(mailOptions).catch((error) => {
      console.error("Email send error (non-blocking):", error);
    });
  });
}
