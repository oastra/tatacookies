import { Resend } from "resend";
import { renderToString } from "react-dom/server";
import EmailTemplate from "@/components/EmailTemplate";
import ContactConfirmation from "@/emails/contactConfirmation";
import CustomOrderConfirmation from "@/emails/customOrderConfirmation";
import { parseForm, config as formidableConfig } from "@/lib/parseForm";
import fs from "fs";

export const config = formidableConfig;

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { fields, files } = await parseForm(req);

    const normalize = (val) => (Array.isArray(val) ? val[0] : val);

    const name = normalize(fields.name);
    const email = normalize(fields.email);
    const message = normalize(fields.message);
    const formType = normalize(fields.formType);
    const phone = normalize(fields.phone);
    const theme = normalize(fields.theme);
    const eventDate = normalize(fields.eventDate);
    const deliveryOption = normalize(fields.deliveryOption);
    const quantity = normalize(fields.quantity);
    const budgetOption = normalize(fields.budgetOption);
    const address = normalize(fields.address);
    const notes = normalize(fields.notes);
    const detailsOption = normalize(fields.detailsOption);

    const from =
      formType === "order"
        ? process.env.ORDER_EMAIL_FROM
        : process.env.INFO_EMAIL_FROM;

    const to =
      formType === "order"
        ? process.env.ORDER_EMAIL_TO
        : process.env.INFO_EMAIL_TO;

    const imageFileRaw = files?.image;
    const imageFile = Array.isArray(imageFileRaw)
      ? imageFileRaw[0]
      : imageFileRaw;

    const attachments =
      imageFile && imageFile.filepath
        ? [
            {
              filename: imageFile.originalFilename || "attachment.jpg",
              content: fs.readFileSync(imageFile.filepath).toString("base64"),
              encoding: "base64",
            },
          ]
        : [];

    // ✅ 1. Send Admin Email with Attachment using HTML
    const htmlContent = renderToString(
      <EmailTemplate
        firstName={name}
        email={email}
        message={message || notes}
        phone={phone}
        theme={theme}
        date={eventDate}
        delivery={deliveryOption}
        quantity={quantity}
        budget={budgetOption}
        address={address}
        details={detailsOption}
      />
    );

    const { error: adminError } = await resend.emails.send({
      from: `Tatacookies <${from}>`,
      to,
      subject: `New ${formType === "order" ? "Order" : "Contact"} Message from ${name}`,
      html: htmlContent, // ✅ Use html instead of react
      attachments,
    });

    if (adminError) {
      console.error("❌ Resend error:", adminError);
      return res.status(400).json({ error: adminError });
    }

    // ✅ 2. Confirmation email to user (no attachment, can use JSX)
    await resend.emails.send({
      from: `Tatacookies <${from}>`,
      to: email,
      subject:
        formType === "order"
          ? "We’ve received your custom cookie order!"
          : "We’ve received your message!",
      react:
        formType === "order" ? (
          <CustomOrderConfirmation
            name={name}
            eventDate={eventDate}
            theme={theme}
            quantity={quantity}
            deliveryMethod={deliveryOption}
            address={address}
            budget={budgetOption}
          />
        ) : (
          <ContactConfirmation name={name} />
        ),
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Email sending failed:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
