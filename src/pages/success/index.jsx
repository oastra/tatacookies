import { useEffect } from "react";
import SuccessLayout from "@/components/SuccessLayout";
import { useCart } from "@/context/CartContext";

export default function OrderSuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear localStorage directly to avoid race condition with CartProvider's load effect
    localStorage.removeItem("tatacookies-cart");
    clearCart();
  }, [clearCart]);

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
