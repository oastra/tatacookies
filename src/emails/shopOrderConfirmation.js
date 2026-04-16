import { Heading, Text, Hr } from "@react-email/components";
import BaseLayout from "./baseLayout";
import { colors, fonts } from "./styles";

export default function ShopOrderConfirmation({
  name,
  orderNumber,
  items,
  total,
  deliveryMethod,
  address,
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
        Thanks for shopping with <strong>Tatacookies</strong>! Your order{" "}
        <strong>#{orderNumber}</strong> has been received.
      </Text>

      {/* Order Items */}
      {items && items.length > 0 && (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "16px",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  textAlign: "left",
                  fontFamily: fonts.body,
                  fontSize: "13px",
                  color: colors.text,
                  padding: "8px 0",
                  borderBottom: `1px solid ${colors.border}`,
                }}
              >
                Item
              </th>
              <th
                style={{
                  textAlign: "center",
                  fontFamily: fonts.body,
                  fontSize: "13px",
                  color: colors.text,
                  padding: "8px 0",
                  borderBottom: `1px solid ${colors.border}`,
                }}
              >
                Qty
              </th>
              <th
                style={{
                  textAlign: "right",
                  fontFamily: fonts.body,
                  fontSize: "13px",
                  color: colors.text,
                  padding: "8px 0",
                  borderBottom: `1px solid ${colors.border}`,
                }}
              >
                Price
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i}>
                <td
                  style={{
                    fontFamily: fonts.body,
                    fontSize: "14px",
                    padding: "8px 0",
                    color: colors.text,
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

      <Hr style={{ borderColor: colors.border, margin: "16px 0" }} />

      <Text
        style={{
          fontFamily: fonts.body,
          fontSize: "14px",
          color: colors.text,
          lineHeight: "150%",
        }}
      >
        <strong>Delivery:</strong> {deliveryMethod || "Not specified"}
        {address && (
          <>
            <br />
            <strong>Address:</strong> {address}
          </>
        )}
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
        Our team will contact you soon to confirm all details. If you have any
        questions, reply to this email or DM us on Instagram.
      </Text>
    </BaseLayout>
  );
}
