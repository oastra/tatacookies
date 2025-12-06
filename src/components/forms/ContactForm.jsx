"use client";
import { useCallback, useMemo } from "react";
import ButtonOrLink from "../ui/ButtonOrLink";
import Checkbox from "../common/Checkbox";
import FormField from "./FormField";
import { useContactForm } from "../../hooks/useContactForm";

const ContactForm = () => {
  const {
    formData,
    accepted,
    status,
    errors,
    handleChange,
    handleBlur,
    handleCheckboxChange,
    handleSubmit,
  } = useContactForm();

  const getInputClassName = useCallback(
    (fieldName) => {
      const baseClasses = "px-4 py-5 rounded-[16px] bg-white shadow-cookie";
      return errors[fieldName]
        ? `${baseClasses} border-2 border-red-500 focus:border-red-500 focus:outline-none`
        : `${baseClasses} focus:border-primary focus:outline-none`;
    },
    [errors]
  );

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col w-full justify-center items-stretch gap-5 text-text"
    >
      <p className="text-title text-h4 md:text-h3 text-center mb-1">
        Have a question, custom order,
        <br /> or just want to say hi?
      </p>

      <FormField
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Your Name*"
        error={errors.name}
        className={getInputClassName("name")}
      />

      <FormField
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Your Phone Number*"
        error={errors.phone}
        className={getInputClassName("phone")}
      />

      <FormField
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Your Email*"
        error={errors.email}
        className={getInputClassName("email")}
      />

      <FormField
        type="textarea"
        name="message"
        value={formData.message}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Write your message here"
        label="Your Message"
        rows={3}
        error={errors.message}
        className={getInputClassName("message")}
      />

      <div className="flex flex-col gap-1">
        <Checkbox
          id="accept"
          name="accept"
          label="I agree to the Privacy Policy"
          checked={accepted}
          onChange={handleCheckboxChange}
        />
        {errors.privacy && (
          <span className="text-red-500 text-sm px-1">{errors.privacy}</span>
        )}
      </div>

      <ButtonOrLink
        type="submit"
        className="bg-primary mx-auto text-text w-full sm:w-fit"
      >
        {status === "loading" ? "Sending..." : "Contact Us →"}
      </ButtonOrLink>
    </form>
  );
};

export default ContactForm;
