"use client";

import { useState, useEffect } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";

const CustomCookieModal = ({ open, onClose }) => {
  const { scrollY } = useScroll();
  const [scrollDirection, setScrollDirection] = useState("down");

  useMotionValueEvent(scrollY, "change", (current) => {
    const prev = scrollY.getPrevious();
    const diff = current - prev;
    setScrollDirection(diff > 0 ? "down" : "up");
  });

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      if (scrollDirection === "down") {
        onClose(); // Auto close on scroll down (optional behavior)
      }
    }
  }, [scrollDirection]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4 py-8">
      <div className="bg-white w-full max-w-[1160px] rounded-[20px] p-8 relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-2xl text-text hover:text-title font-bold"
        >
          ×
        </button>

        <h2 className="text-title text-[32px] md:text-[40px] font-semibold text-center mb-8">
          Create Your Custom Cookies
        </h2>

        {/* Form remains unchanged */}
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-text">
          {/* Left and Right Columns */}
          {/* ... (as in your original code) */}
        </form>
      </div>
    </div>
  );
};

export default CustomCookieModal;
