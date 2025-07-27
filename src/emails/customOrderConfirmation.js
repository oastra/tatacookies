import { Heading, Text, Button } from "@react-email/components";
import BaseLayout from "./baseLayout";
import { colors, fonts, button } from "./styles";

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
        }}
      >
        Thank you for your custom cookie order with <strong>Tatacookies</strong>
        !
      </Text>
      <div
        style={{
          backgroundColor: colors.bgPink,
          padding: "16px",
          borderRadius: "8px",
          marginBottom: "24px",
        }}
      >
        <Text>
          <strong>Event Date:</strong> {eventDate}
        </Text>
        <Text>
          <strong>Theme:</strong> {theme}
        </Text>
        <Text>
          <strong>Quantity:</strong> {quantity}
        </Text>
        <Text>
          <strong>Delivery Method:</strong> {deliveryMethod}
        </Text>
      </div>
      <Button href="https://tatacookies.com" style={button}>
        Visit Tatacookies
      </Button>
    </BaseLayout>
  );
}
