import { Heading, Text } from "@react-email/components";
import BaseLayout from "./baseLayout";
import { colors, fonts } from "./styles";

export default function ContactConfirmation({ name }) {
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
        }}
      >
        Thank you for reaching out to <strong>Tatacookies</strong>! We&apos;ve
        received your message and will get back to you as soon as possible.
      </Text>
    </BaseLayout>
  );
}
