import { Heading, Text, Hr, Img, Button } from "@react-email/components";
import BaseLayout from "./baseLayout";
import { colors, fonts, button } from "./styles";

export default function ShopOrderShipped({
  name,
  orderNumber,
  trackingNumber,
  trackingUrl,
  items,
  total,
  deliveryMethod,
}) {
  return (
    <BaseLayout>
      <Heading
        style={{
          color: colors.heading,
          fontFamily: fonts.heading,
          fontSize: "30px",
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
          lineHeight: "150%",
          marginBottom: "24px",
        }}
      >
        Great news! Your order <strong>#{orderNumber}</strong> has been shipped
        via {deliveryMethod}.
      </Text>

      {trackingNumber && (
        <>
          <Text
            style={{
              fontFamily: fonts.body,
              fontSize: "14px",
              color: colors.text,
              marginBottom: "4px",
            }}
          >
            <strong>Tracking number:</strong>{" "}
            <span style={{ fontFamily: "monospace" }}>{trackingNumber}</span>
          </Text>
          <Button href={trackingUrl} style={{ ...button, marginBottom: "24px" }}>
            Track your order
          </Button>
        </>
      )}

      <Hr style={{ borderColor: colors.border, margin: "16px 0" }} />

      {items && items.length > 0 && (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "16px",
          }}
        >
          <tbody>
            {items.map((item, i) => (
              <tr key={i}>
                {item.image_url && (
                  <td
                    style={{
                      padding: "8px 12px 8px 0",
                      borderBottom:
                        i < items.length - 1
                          ? `1px solid ${colors.border}`
                          : "none",
                      verticalAlign: "middle",
                      width: "60px",
                    }}
                  >
                    <Img
                      src={item.image_url}
                      alt={item.product_title}
                      width="56"
                      height="56"
                      style={{
                        borderRadius: "8px",
                        objectFit: "cover",
                      }}
                    />
                  </td>
                )}
                <td
                  style={{
                    fontFamily: fonts.body,
                    fontSize: "14px",
                    padding: "8px 0",
                    color: colors.text,
                    borderBottom:
                      i < items.length - 1
                        ? `1px solid ${colors.border}`
                        : "none",
                    verticalAlign: "middle",
                  }}
                >
                  {item.product_title} — {item.variant_name}
                </td>
                <td
                  style={{
                    fontFamily: fonts.body,
                    fontSize: "14px",
                    padding: "8px 0",
                    textAlign: "center",
                    color: colors.text,
                    borderBottom:
                      i < items.length - 1
                        ? `1px solid ${colors.border}`
                        : "none",
                    verticalAlign: "middle",
                  }}
                >
                  {item.quantity}
                </td>
                <td
                  style={{
                    fontFamily: fonts.body,
                    fontSize: "14px",
                    padding: "8px 0",
                    textAlign: "right",
                    color: colors.text,
                    borderBottom:
                      i < items.length - 1
                        ? `1px solid ${colors.border}`
                        : "none",
                    verticalAlign: "middle",
                  }}
                >
                  ${(Number(item.price_aud) * item.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Text
        style={{
          fontFamily: fonts.body,
          fontSize: "16px",
          fontWeight: 600,
          color: colors.text,
          textAlign: "right",
          marginBottom: "24px",
        }}
      >
        Total: ${total} AUD
      </Text>

      <Text
        style={{
          fontFamily: fonts.body,
          fontSize: "14px",
          color: colors.text,
          lineHeight: "150%",
          marginTop: "16px",
        }}
      >
        If you have any questions, reply to this email or DM us on Instagram.
      </Text>
    </BaseLayout>
  );
}
