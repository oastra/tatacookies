"use client";

import ButtonOrLink from "../ui/ButtonOrLink";
import Checkbox from "../common/Checkbox";
import { useState } from "react";
import { useRouter } from "next/navigation";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [accepted, setAccepted] = useState(false);
  const [status, setStatus] = useState(""); // success, error, loading
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!accepted) {
      alert("Please accept the Privacy Policy.");
      return;
    }

    setStatus("loading");

    const data = new FormData();
    data.append("formType", "contact");
    data.append("name", formData.name);
    data.append("phone", formData.phone);
    data.append("email", formData.email);
    data.append("message", formData.message);

    try {
      const res = await fetch("api/send-form", {
        method: "POST",
        body: data,
      });

      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", phone: "", email: "", message: "" });
        setAccepted(false);

        // 👇 Redirect to success page
        router.push("/contact/success");
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Contact form error:", error);
      setStatus("error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col w-full justify-center items-stretch gap-5 text-text"
    >
      <p className="text-title text-h4 md:text-h3 text-center mb-1">
        Have a question, custom order,
        <br /> or just want to say hi?
      </p>

      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Your Name*"
        required
        className="px-4 py-5 rounded-[16px] bg-white shadow-cookie"
      />
      <input
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Your Phone Number*"
        required
        className="px-4 py-5 rounded-[16px] bg-white shadow-cookie"
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Your Email*"
        required
        className="px-4 py-5 rounded-[16px] bg-white shadow-cookie"
      />
      <div className="flex flex-col gap-1">
        <label className="text-base font-medium p-[5px]">Your Message</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={2}
          required
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
        {status === "loading" ? "Sending..." : "Contact Us →"}
      </ButtonOrLink>
    </form>
  );
};

export default ContactForm;
