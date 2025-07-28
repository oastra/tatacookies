import { render } from "@react-email/render";
import ContactConfirmation from "../emails/contactConfirmation";

export default async function EmailPreviewPage() {
  const html = await render(<ContactConfirmation name="Olha" />);

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
