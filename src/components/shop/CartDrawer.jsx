"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import QuantitySelector from "./QuantitySelector";

const CartDrawer = () => {
  const [deliveryMethod, setDeliveryMethod] = useState("");
  const [featured, setFeatured] = useState([]);
  const [showDeliveryError, setShowDeliveryError] = useState(false);
  const {
    cart,
    removeFromCart,
    updateQty,
    clearCart,
    cartCount,
    subtotal,
    isCartOpen,
    setCartOpen,
    loaded,
  } = useCart();

  // Fetch featured products when cart is empty and drawer opens
  useEffect(() => {
    if (isCartOpen && cart.length === 0 && featured.length === 0) {
      fetch("/api/featured-products")
        .then((res) => res.json())
        .then((data) => Array.isArray(data) && setFeatured(data))
        .catch(() => {});
    }
  }, [isCartOpen, cart.length]);

  // Lock body scroll when open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  const handleCheckout = async () => {
    if (!deliveryMethod) {
      setShowDeliveryError(true);
      return;
    }

    // Check for items missing Stripe price (stale cart data)
    const invalidItems = cart.filter((item) => !item.stripePriceId);
    if (invalidItems.length > 0) {
      invalidItems.forEach((item) => removeFromCart(item.cartItemId));
      alert(
        "Some items in your cart were outdated and have been removed. Please re-add them and try again."
      );
      return;
    }

    try {
      const res = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart: cart.map((item) => ({
            id: item.stripePriceId,
            qty: item.qty,
            variantId: item.variantId,
          })),
          deliveryMethod,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Checkout failed. Please try again.");
      }
    } catch {
      alert("Something went wrong. Please try again.");
    }
  };

  if (!loaded) return null;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={() => setCartOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white shadow-lg z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-h3 font-heading font-semibold text-title">
                Your Cart ({cartCount})
              </h2>
              <button
                onClick={() => setCartOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-bgBlue transition text-text60"
                aria-label="Close cart"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M15 5L5 15M5 5l10 10" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center gap-6 pt-8 text-center">
                  {/* Empty state */}
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#b0b0b0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                  <div>
                    <p className="text-text60 text-base mb-2">Your cart is empty</p>
                    <Link
                      href="/shop"
                      onClick={() => setCartOpen(false)}
                      className="text-title font-medium underline underline-offset-4 hover:text-primary transition"
                    >
                      Browse cookies
                    </Link>
                  </div>

                  {/* Featured products */}
                  {featured.length > 0 && (
                    <div className="w-full pt-4 border-t border-gray-100">
                      <p className="text-sm font-medium text-text mb-4">
                        Popular right now
                      </p>
                      <div className="flex flex-col gap-3">
                        {featured.map((p) => (
                          <Link
                            key={p.id}
                            href={`/shop/${p.slug}`}
                            onClick={() => setCartOpen(false)}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-bgPink transition"
                          >
                            <div className="relative w-14 h-14 shrink-0 rounded-[10px] overflow-hidden">
                              <Image
                                src={p.image_url}
                                alt={p.title}
                                fill
                                className="object-cover"
                                sizes="56px"
                              />
                            </div>
                            <div className="flex-1 text-left">
                              <p className="text-sm font-medium text-title">
                                {p.title}
                              </p>
                              <p className="text-xs text-text60">
                                ${p.price} AUD
                              </p>
                            </div>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#b0b0b0" strokeWidth="1.5" strokeLinecap="round">
                              <path d="M6 4l4 4-4 4" />
                            </svg>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {cart.map((item) => (
                    <div
                      key={item.cartItemId}
                      className="flex gap-4 pb-6 border-b border-gray-100 last:border-b-0"
                    >
                      {/* Thumbnail */}
                      <Link
                        href={`/shop/${item.slug}`}
                        onClick={() => setCartOpen(false)}
                        className="shrink-0 w-20 h-20 relative rounded-[12px] overflow-hidden"
                      >
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </Link>

                      {/* Details */}
                      <div className="flex-1 flex flex-col gap-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-title">
                              {item.title}
                            </p>
                            {item.variantName && (
                              <p className="text-small text-text60">
                                {item.variantName}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => removeFromCart(item.cartItemId)}
                            className="text-text60 hover:text-red-500 transition text-small"
                            aria-label={`Remove ${item.title}`}
                          >
                            Remove
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-auto">
                          <QuantitySelector
                            qty={item.qty}
                            onChange={(newQty) =>
                              updateQty(item.cartItemId, newQty)
                            }
                          />
                          <p className="font-medium text-text">
                            ${(item.price * item.qty).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-gray-100 p-6 space-y-4">
                {/* Shipping info */}
                <div className="flex items-center justify-center gap-3 text-xs text-text60 bg-bgBlue rounded-lg py-2 px-3">
                  <span>Delivery $20 · Free over $300</span>
                  <span className="text-gray-300">|</span>
                  <span>Free Sydney pick-up</span>
                </div>

                {/* Delivery method */}
                <div className="space-y-2">
                  <p className={`text-sm font-medium ${showDeliveryError ? "text-red-500" : "text-text"}`}>
                    {showDeliveryError
                      ? "Please select Delivery or Pick-Up"
                      : "Delivery / Pick-Up"}
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setDeliveryMethod("Australia Post");
                        setShowDeliveryError(false);
                      }}
                      className={`flex-1 py-2.5 rounded-full text-sm font-medium border transition ${
                        deliveryMethod === "Australia Post"
                          ? "bg-primary/10 border-primary text-title"
                          : showDeliveryError
                            ? "bg-white border-red-300 text-text60 animate-pulse"
                            : "bg-white border-gray-200 text-text60 hover:border-gray-300"
                      }`}
                    >
                      Delivery
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDeliveryMethod("Pick-Up");
                        setShowDeliveryError(false);
                      }}
                      className={`flex-1 py-2.5 rounded-full text-sm font-medium border transition ${
                        deliveryMethod === "Pick-Up"
                          ? "bg-primary/10 border-primary text-title"
                          : showDeliveryError
                            ? "bg-white border-red-300 text-text60 animate-pulse"
                            : "bg-white border-gray-200 text-text60 hover:border-gray-300"
                      }`}
                    >
                      Pick-Up
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-base font-medium text-text">
                    Subtotal
                  </span>
                  <span className="text-h4 font-semibold text-title">
                    ${subtotal.toFixed(2)} AUD
                  </span>
                </div>
                {deliveryMethod === "Australia Post" && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-text60">Shipping</span>
                    <span className={subtotal >= 300 ? "text-green-600 font-medium" : "text-text"}>
                      {subtotal >= 300 ? "Free" : "$20.00"}
                    </span>
                  </div>
                )}
                <p className="text-small text-text60">
                  {deliveryMethod === "Pick-Up"
                    ? "Pick up from our Sydney location"
                    : deliveryMethod === "Australia Post"
                      ? subtotal >= 300
                        ? "Free shipping applied!"
                        : `Free shipping on orders over $300 ($${(300 - subtotal).toFixed(0)} away)`
                      : "Select delivery method above"}
                </p>
                <button
                  onClick={handleCheckout}
                  className="w-full h-14 bg-primary text-text font-medium rounded-full hover:bg-secondary transition text-button"
                >
                  Checkout
                </button>
                <button
                  onClick={clearCart}
                  className="w-full text-center text-small text-text60 hover:text-red-500 transition"
                >
                  Clear cart
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
