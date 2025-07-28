import { Heading, Text, Button } from "@react-email/components";
import BaseLayout from "./baseLayout";
import { colors, fonts, button } from "./styles";
import ArrowUpIcon from "@/components/icons/ArrowUpIcon";
import ArrowRightIcon from "@/components/icons/ArrowRightIcon";

const tableLabel = {
  fontFamily: fonts.body,
  fontSize: "14px",
  fontWeight: "bold",
  padding: "12px",
  borderBottom: `1px solid ${colors.border}`,
  width: "40%",
  backgroundColor: "#fff5f8",
};

const tableValue = {
  fontFamily: fonts.body,
  fontSize: "14px",
  padding: "12px",
  borderBottom: `1px solid ${colors.border}`,
  backgroundColor: "#fff",
};
export default function CustomOrderConfirmation({
  name,
  eventDate,
  theme,
  quantity,
  deliveryMethod,
}) {
  return (
    <BaseLayout>
      <Heading
        style={{
          color: colors.heading,
          fontFamily: fonts.heading,
          fontSize: "36px",
          fontWeight: 600,
          lineHeight: "120%",
          marginBottom: "16px",
          textAlign: "center",
        }}
      >
        Hi {name},
      </Heading>

      <Text
        style={{
          color: colors.text,
          fontFamily: fonts.body,
          fontSize: "16px",
          lineHeight: "130%",
          marginBottom: "24px",
          textAlign: "center",
        }}
      >
        Thank you for your custom cookie order with <strong>Tatacookies</strong>
        !
      </Text>

      {/* Order summary table */}
      <Text
        style={{
          color: colors.text,
          fontFamily: fonts.body,
          fontSize: "26px",
          lineHeight: "130%",
          marginBottom: "24px",
          fontWeight: 500,
          textAlign: "center",
        }}
      >
        Order summary:
      </Text>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          backgroundColor: colors.bgPink,
          borderRadius: "8px",
          marginBottom: "24px",
          overflow: "hidden",
        }}
      >
        <tbody>
          <tr>
            <td style={tableLabel}>Event Date:</td>
            <td style={tableValue}>{eventDate}</td>
          </tr>
          <tr>
            <td style={tableLabel}>Theme:</td>
            <td style={tableValue}>{theme}</td>
          </tr>
          <tr>
            <td style={tableLabel}>Quantity:</td>
            <td style={tableValue}>{quantity}</td>
          </tr>
          <tr>
            <td style={tableLabel}>Delivery Method:</td>
            <td style={tableValue}>{deliveryMethod}</td>
          </tr>
        </tbody>
      </table>

      <Text
        style={{
          color: colors.text,
          fontFamily: fonts.body,
          fontSize: "16px",
          lineHeight: "130%",
          marginBottom: "24px",
        }}
      >
        We'll be in touch shortly to confirm the details and finalize your
        request.
        <br />
        <br />
        Once everything is clarified, we’ll send you an invoice — and production
        will begin after the payment is received.
        <br />
        <br />
        Just a quick note: if you reach out fewer than <strong>
          14 days
        </strong>{" "}
        before your event, we can't guarantee your cookies will be ready in
        time. Please keep this in mind when planning.
      </Text>

      <Button
        href="https://tatacookies.com"
        style={{
          backgroundColor: colors.primary,
          color: "#46494C",
          fontFamily: fonts.body,
          fontSize: "18px",
          fontWeight: 500,
          padding: "16px 32px",
          borderRadius: "9999px", // full rounded
          textDecoration: "none",
          display: "inline-block",
          width: "fit-content",
          textAlign: "center",
          margin: "0 auto", // center horizontally
          display: "block", // ensure it's centered in email clients
        }}
      >
        Visit Tatacookies →
      </Button>
    </BaseLayout>
  );
}
