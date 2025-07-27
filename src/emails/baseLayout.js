import { Html, Body, Container, Text } from "@react-email/components";
import { colors, fonts } from "./styles";

export default function BaseLayout({ children }) {
  return (
    <Html>
      <Body
        style={{
          backgroundColor: colors.bgPink,
          fontFamily: fonts.body,
          color: colors.text,
          padding: "20px",
        }}
      >
        <Container
          style={{
            maxWidth: "600px",
            margin: "auto",
            backgroundColor: `${colors.bgBlue}`,
            border: `1px solid ${colors.border}`,
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0px 1px 3px rgba(0,0,0,0.15)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <img
              src="https://tatacookiesdev.vercel.app/images/LogoTataCookies.png"
              alt="Tatacookies Logo"
              width="150"
            />
          </div>
          {children}
          <Text
            style={{
              fontSize: "12px",
              color: colors.footerText,
              textAlign: "center",
              marginTop: "40px",
            }}
          >
            Follow us on Instagram:
            <a
              href="https://instagram.com/tatacookies.au"
              style={{ color: colors.heading, textDecoration: "none" }}
            >
              @tatacookies
            </a>
            <br />
            &copy; {new Date().getFullYear()} Tatacookies. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
