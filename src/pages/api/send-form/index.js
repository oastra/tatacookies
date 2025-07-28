import formidable from "formidable";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { createElement } from "react";
import ContactConfirmation from "@/emails/contactConfirmation";
import CustomOrderConfirmation from "@/emails/customOrderConfirmation";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const form = formidable({
    keepExtensions: true,
    maxFileSize: 2 * 1024 * 1024,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("❌ Form parse error:", err);
      return res.status(500).json({ error: "Error parsing form data" });
    }

    res.status(200).json({ success: true }); // Respond quickly

    const formType = fields.formType?.toString() || "other";
    const isContact = formType === "contact";
    const isOrder = formType === "order";

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
      // === TEAM email ===
      const teamMailText = isOrder
        ? `
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
        `
        : `
New Contact Message:
Name: ${fields.name}
Email: ${fields.email}
Phone: ${fields.phone}
Message: ${fields.message || "-"}
        `;

      await transporter.sendMail({
        from: `"Tatacookies ${formType}" <${authUser}>`,
        to: teamRecipient,
        subject: `📩 New ${formType} submission from ${fields.name}`,
        text: teamMailText,
        replyTo: fields.email,
        attachments: files.image?.[0]
          ? [
              {
                filename: files.image[0].originalFilename,
                path: files.image[0].filepath,
              },
            ]
          : [],
      });

      console.log("✅ Team email sent");

      // === CUSTOMER email ===
      const confirmationHtml = isOrder
        ? await render(
            <CustomOrderConfirmation
              name={fields.name}
              eventDate={fields.eventDate}
              theme={fields.theme}
              quantity={fields.quantity}
              deliveryMethod={fields.deliveryOption}
            />
          )
        : await render(
            createElement(ContactConfirmation, { name: fields.name })
          );

      await transporter.sendMail({
        from: `"Tatacookies" <${authUser}>`,
        to: fields.email,
        subject: isOrder
          ? "Tatacookies – We've received your cookie order!"
          : "Tatacookies – We've received your message!",
        html: confirmationHtml,
      });

      console.log(`✅ Confirmation sent to ${fields.email}`);
    } catch (err) {
      console.error("❌ Sending email failed:", err);
    }
  });
}
