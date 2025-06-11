"use client";
import ButtonOrLink from "../layout/ButtonOrLink";

const ContactForm = () => {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex flex-col w-full justify-center items-stretch gap-5 text-text"
    >
      <p className="text-title text-h4 md:text-h3 text-center mb-2">
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

      <label className="flex items-center gap-3 px-1 text-small text-text60 cursor-pointer">
        {/* Peer checkbox (hidden) */}
        <input type="checkbox" required className="peer hidden" />

        {/* Custom checkbox box */}
        <div className="w-[16px] h-[16px] rounded-md border-2 border-title flex items-center justify-center peer-checked:bg-title peer-checked:border-title transition-all duration-200">
          {/* Checkmark appears on check */}
          <svg
            className="w-[10px] h-[10px] text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
            viewBox="0 0 20 20"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4.5 10.5l3 3 7-7" />
          </svg>
        </div>

        {/* Label text with link */}
        <span>
          I agree to the terms of the{" "}
          <a
            href="/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-small hover:text-title"
          >
            Privacy Policy
          </a>
        </span>
      </label>

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
