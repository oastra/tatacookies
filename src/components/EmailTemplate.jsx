import * as React from "react";

const EmailTemplate = ({
  firstName,
  email,
  message,
  phone,
  theme,
  date,
  delivery,
  quantity,
  budget,
  address,
  details,
}) => {
  const formattedDate =
    date &&
    new Date(date).toLocaleDateString("en-AU", {
      weekday: "short",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  return (
    <div>
      <h2>New Message </h2>
      <p>
        <strong>Name:</strong> {firstName}
      </p>
      <p>
        <strong>Email:</strong> {email}
      </p>
      {phone && (
        <p>
          <strong>Phone:</strong> {phone}
        </p>
      )}
      {theme && (
        <p>
          <strong>Theme:</strong> {theme}
        </p>
      )}
      {formattedDate && (
        <p>
          <strong>Event Date:</strong> {formattedDate}
        </p>
      )}
      {delivery && (
        <p>
          <strong>Delivery Option:</strong> {delivery}
        </p>
      )}
      {quantity && (
        <p>
          <strong>Quantity:</strong> {quantity}
        </p>
      )}
      {budget && (
        <p>
          <strong>Budget:</strong> {budget}
        </p>
      )}
      {address && (
        <p>
          <strong>Address:</strong> {address}
        </p>
      )}
      {details && (
        <p>
          <strong>Design Approach:</strong> {details}
        </p>
      )}
      {message && (
        <p>
          <strong>Notes:</strong> {message}
        </p>
      )}
    </div>
  );
};

export default EmailTemplate;
