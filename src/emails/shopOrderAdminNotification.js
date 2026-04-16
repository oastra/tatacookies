import { Heading, Text, Hr } from "@react-email/components";
import BaseLayout from "./baseLayout";
import { colors, fonts } from "./styles";

export default function ShopOrderAdminNotification({
  orderNumber,
  customerName,
  customerEmail,
  customerPhone,
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
          fontSize: "26px",
          fontWeight: 600,
          lineHeight: "120%",
          marginBottom: "16px",
        }}
      >
        New Order #{orderNumber}
      </Heading>

      {/* Customer Info */}
      <Text
        style={{
          fontFamily: fonts.body,
          fontSize: "14px",
          color: colors.text,
          lineHeight: "170%",
          marginBottom: "16px",
        }}
      >
        <strong>Customer:</strong> {customerName}
        <br />
        <strong>Email:</strong> {customerEmail}
        <br />
        <strong>Phone:</strong> {customerPhone || "Not provided"}
        <br />
        <strong>Delivery:</strong> {deliveryMethod || "Not specified"}
        {address && (
          <>
            <br />
            <strong>Address:</strong> {address}
          </>
        )}
      </Text>

      <Hr style={{ borderColor: colors.border, margin: "16px 0" }} />

      {/* Order Items */}
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
          {(items || []).map((item, i) => (
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

      <Text
        style={{
          fontFamily: fonts.body,
          fontSize: "18px",
          fontWeight: 700,
          color: colors.heading,
          textAlign: "right",
        }}
      >
        Total: ${total} AUD
      </Text>
    </BaseLayout>
  );
}
