"use client";
import ButtonOrLink from "../ui/ButtonOrLink";
import Checkbox from "../common/Checkbox";
import { useState } from "react";

const ContactForm = () => {
  const [accepted, setAccepted] = useState(false);
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex flex-col w-full justify-center items-stretch gap-5 text-text"
    >
      <p className="text-title text-h4 md:text-h3 text-center mb-1">
        Have a question, custom order,
        <br /> or just want to say hi?
      </p>

      <input
        type="text"
        placeholder="Your Name*"
        required
        className="px-4 py-5 rounded-[16px] bg-white shadow-cookie"
      />
      <input
        type="tel"
        placeholder="Your Phone Number*"
        required
        className="px-4 py-5 rounded-[16px] bg-white shadow-cookie"
      />
      <input
        type="email"
        placeholder="Your Email*"
        required
        className="px-4 py-5 rounded-[16px] bg-white shadow-cookie"
      />
      <div className="flex flex-col gap-1">
        <label className="text-base font-medium p-[5px]">Your Message</label>
        <textarea
          rows={2}
          className="px-4 py-5 rounded-[16px] bg-white shadow-cookie"
        />
      </div>

      <Checkbox
        id="accept"
        name="accept"
        label="I agree to the Privacy Policy"
        checked={accepted}
        onChange={(e) => setAccepted(e.target.checked)}
      />

      <ButtonOrLink
        type="submit"
        className="bg-primary mx-auto text-text w-full sm:w-fit"
      >
        Contact Us →
      </ButtonOrLink>
    </form>
  );
};

export default ContactForm;
