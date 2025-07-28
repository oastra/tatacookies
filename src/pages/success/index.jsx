import SuccessLayout from "@/components/SuccessLayout";

export default function OrderSuccessPage() {
  return (
    <SuccessLayout
      title="Thank you for your order!"
      message="We've received your cookie order. Our team will contact you soon to confirm all details and delivery."
      buttonText="Back"
      buttonHref="/"
      iconColor="fill-secondary"
    />
  );
}
