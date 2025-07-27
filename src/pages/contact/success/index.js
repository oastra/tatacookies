"use client";

import { useEffect } from "react";
import SuccessLayout from "@/components/SuccessLayout";

export default function ContactSuccessPage() {
  useEffect(() => {
    const timer = setTimeout(() => {
      // 👇 Redirect back to homepage and scroll to #contact
      window.location.href = "/#contact";
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <SuccessLayout
      title="Thank you for your message!"
      message="We’ve received your message and will get back to you as soon as possible."
      buttonText="Back "
      buttonHref="/"
      iconColor="fill-secondary"
    />
  );
}
