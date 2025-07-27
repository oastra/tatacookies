import { Heading, Text, Button } from "@react-email/components";
import BaseLayout from "./baseLayout";
import { colors, fonts, button } from "./styles";

export default function ShopOrderConfirmation({ name, orderNumber }) {
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
        Thanks for shopping with <strong>Tatacookies</strong>! 🍪 Your order{" "}
        <strong>#{orderNumber}</strong> has been received and is being
        processed.
      </Text>
      <Button href="https://tatacookies.com/shop" style={button}>
        View Your Order
      </Button>
    </BaseLayout>
  );
}
