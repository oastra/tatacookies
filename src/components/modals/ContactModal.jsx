"use client";

import { useEffect } from "react";
import CloseRoundIcon from "../icons/CloseRoundIcon";
import ButtonOrLink from "../ui/ButtonOrLink";

const ContactModal = ({ onClose }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 py-8"
      onClick={onClose} // Close modal on backdrop click
    >
      <div
        className="bg-bgBlue w-full max-w-[580px] rounded-[20px] p-6 sm:p-8 relative overflow-y-auto max-h-[90vh] sm:max-h-[90vh]"
        onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside modal
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl text-text hover:text-title"
          aria-label="Close Modal"
        >
          <CloseRoundIcon />
        </button>

        {/* Title */}
        <h2 className="text-title text-[24px] sm:text-[28px] font-semibold text-center mb-3">
          Still have questions?
        </h2>
        <p className="text-small text-text60 text-center mb-5">
          Fill out the form below and we’ll get back to you shortly!
        </p>

        {/* Form */}
        <form className="grid grid-cols-1 gap-3 text-small text-text">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            className="form-input"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            className="form-input"
          />
          <textarea
            name="message"
            placeholder="Your Message"
            rows={4}
            className="form-input"
          ></textarea>
          <ButtonOrLink
            type="submit"
            className="bg-primary text-white mt-3 mx-auto w-full"
          >
            Send Message
          </ButtonOrLink>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;
