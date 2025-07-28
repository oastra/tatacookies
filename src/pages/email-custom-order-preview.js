// pages/email-preview.js
import CustomOrderConfirmation from "../emails/customOrderConfirmation";
import { render } from "@react-email/render";

export default function EmailPreviewPage({ html }) {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: html }}
      style={{
        maxWidth: "800px",
        margin: "40px auto",
        background: "#fff",
        padding: "2rem",
        fontFamily: "sans-serif",
      }}
    />
  );
}

export async function getServerSideProps() {
  const html = await render(
    <CustomOrderConfirmation
      name="Olha"
      eventDate="2025-08-15"
      theme="Unicorn Birthday"
      quantity="24"
      deliveryMethod="Pick-Up"
    />
  );

  return { props: { html } };
}
