"use client";

import { useState, useEffect } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import ButtonOrLink from "../ui/ButtonOrLink";
import CloseRoundIcon from "../icons/CloseRoundIcon";

const ContactModal = ({ onClose }) => {
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
        onClose(); // Optional auto-close
      }
    }
  }, [scrollDirection]);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4 py-8">
      <div className="bg-white w-full max-w-[580px] rounded-[20px] p-8 relative overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-2xl text-text hover:text-title font-bold"
        >
          <CloseRoundIcon />
        </button>

        {/* Title */}
        <h2 className="text-title text-[28px] md:text-[32px] font-semibold text-center mb-4">
          Still have questions?
        </h2>
        <p className="text-sm text-text60 text-center mb-6">
          Fill out the form below and we’ll get back to you shortly!
        </p>

        {/* Form */}
        <form className="grid grid-cols-1 gap-4 text-sm text-text">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            className="w-full border border-gray-300 rounded-[10px] px-4 py-3 placeholder:text-text60 focus:outline-none focus:ring-2 focus:ring-primary transition"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            className="w-full border border-gray-300 rounded-[10px] px-4 py-3 placeholder:text-text60 focus:outline-none focus:ring-2 focus:ring-primary transition"
          />
          <textarea
            name="message"
            placeholder="Your Message"
            rows={4}
            className="w-full border border-gray-300 rounded-[10px] px-4 py-3 placeholder:text-text60 focus:outline-none focus:ring-2 focus:ring-primary resize-none transition"
          ></textarea>
          <ButtonOrLink type="submit" className="bg-primary text-white mt-2">
            Send Message
          </ButtonOrLink>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;
