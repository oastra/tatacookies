"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import CloseRoundIcon from "../icons/CloseRoundIcon";
import ButtonOrLink from "../ui/ButtonOrLink";

const ContactModal = ({ onClose }) => {
  const router = useRouter();

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const data = {
      name: form.name.value,
      email: form.email.value,
      message: form.message.value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/success");
      } else {
        alert("Something went wrong. Please try again later.");
      }
    } catch (err) {
      console.error("Contact form error:", err);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 py-8"
      onClick={onClose}
    >
      <div
        className="bg-bgBlue w-full max-w-[580px] rounded-[20px] p-6 sm:p-8 relative overflow-y-auto max-h-[90vh] sm:max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl text-text hover:text-title"
          aria-label="Close Modal"
        >
          <CloseRoundIcon />
        </button>

        <h2 className="text-title text-[24px] sm:text-[28px] font-semibold text-center mb-3">
          Still have questions?
        </h2>
        <p className="text-small text-text60 text-center mb-5">
          Fill out the form below and we’ll get back to you shortly!
        </p>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-3 text-small text-text"
        >
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            className="form-input"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            className="form-input"
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            rows={4}
            className="form-input"
            required
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
