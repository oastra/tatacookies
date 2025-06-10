"use client";
import ButtonOrLink from "../layout/ButtonOrLink";

const ContactForm = () => {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex flex-col justify-center items-strach gap-5 text-text"
    >
      <p className="text-title text-h3 text-center  mb-2">
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
        <label className="text-base font-medium p-[5px]">Your Message </label>
        <textarea
          rows={2}
          className="px-4 py-5 rounded-[16px] bg-white shadow-cookie"
        />
      </div>
      <div className="flex flex-row gap-4 px-4">
        <input type="checkbox" required />
        <p className="text-xs text-text60">
          By clicking the Contact Us button you agree to our Privacy Policy
          terms
        </p>
      </div>

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
