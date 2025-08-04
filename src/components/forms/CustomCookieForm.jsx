"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useRef } from "react";
import { useRouter } from "next/router";

const CustomDatePicker = dynamic(() => import("./CustomDatePicker"), {
  ssr: false,
});

import ButtonOrLink from "../ui/ButtonOrLink";
import PlainButtonLink from "../ui/PlainButtonLink";
import Checkbox from "../common/Checkbox";
import RadioButton from "../common/RadioButton";
import ImageUpload from "../common/ImageUpload";
import AddressAutocomplete from "./AddressAutocomplete";

const CustomCookieForm = () => {
  const router = useRouter();
  // State variables for form inputs
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [unit, setUnit] = useState("");
  const [addressDetails, setAddressDetails] = useState({
    fullAddress: "",
    suburb: "",
    postcode: "",
    state: "",
    latLng: null,
  });
  const [accepted, setAccepted] = useState({ terms: false, pricing: false });
  const [detailsOption, setDetailsOption] = useState("");
  const [deliveryOption, setDeliveryOption] = useState("");
  const [budgetOption, setBudgetOption] = useState("");

  const imageRef = useRef();

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();

        if (!selectedDate) {
          alert("Please select a date");
          return;
        }
        if (!deliveryOption) {
          alert("Please select a delivery option");
          return;
        }

        if (!selectedAddress) {
          alert("Please select a valid address");
          return;
        }

        if (!accepted.terms || !accepted.pricing) {
          alert("Please accept the acknowledgements");
          return;
        }

        const fullDeliveryAddress = unit
          ? `${unit}, ${addressDetails.fullAddress}`
          : addressDetails.fullAddress;

        const formData = new FormData();
        formData.append("formType", "order");
        formData.append("name", e.target.name.value);
        formData.append("email", e.target.email.value);
        formData.append("phone", e.target.phone.value);
        formData.append("theme", e.target.theme.value);
        formData.append("eventDate", selectedDate); // ✅ use state
        formData.append("deliveryOption", deliveryOption); // ✅ use state
        formData.append("quantity", e.target.quantity.value);
        formData.append("budgetOption", budgetOption); // ✅ use state
        formData.append("address", fullDeliveryAddress);
        formData.append("notes", e.target.notes.value);
        formData.append("detailsOption", detailsOption); // ✅ use state

        // Add file from ref
        if (imageRef.current?.files?.[0]) {
          formData.append("image", imageRef.current.files[0]);
        }

        // Send with correct headers (do NOT set Content-Type manually!)
        const res = await fetch("/api/send-form", {
          method: "POST",
          body: formData, // NOT JSON.stringify()
        });

        if (res.ok) {
          router.push("/success");
        } else {
          alert("Something went wrong. Please try again later.");
        }
      }}
      className="w-full bg-bgBlue mx-auto flex flex-col gap-[40px]"
    >
      <div className="text-center">
        <h1 className="text-title text-mobTitle md:text-h2 mb-2">
          Custom Cookie Order Form
        </h1>
        <p className="text-base md:text-button font-normal max-w-2xl mx-auto mb-2">
          Every special moment deserves a sweet little touch. We hand-decorate
          gingerbread cookies with royal icing, creating designs that feel just
          right for your celebration.
        </p>
        <p className="text-base md:text-button font-normal max-w-2xl mx-auto mb-2">
          Fill out this short form and tell us about your occasion - we’ll
          create a look that brings your vision to life down to the finest
          detail.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-[6px]">
          <label htmlFor="name" className="text-base font-bold">
            Your Name*
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Anna"
            required
            className="form-input"
          />
        </div>

        <div className="flex flex-col gap-[6px]">
          <label htmlFor="theme" className="text-base font-bold">
            Event Theme*
          </label>
          <input
            id="theme"
            name="theme"
            type="text"
            placeholder="Birthday, Wedding, etc."
            required
            className="form-input"
          />
        </div>

        <div className="flex flex-col gap-[6px]">
          <label htmlFor="email" className="text-base font-bold">
            Email*
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="happy@gmail.com"
            required
            className="form-input"
          />
        </div>

        <div className="flex flex-col gap-[6px] relative">
          <label htmlFor="event-date" className="text-base font-bold">
            Event Date*
          </label>
          <CustomDatePicker
            selectedDate={selectedDate}
            onChange={setSelectedDate}
          />
        </div>

        <div className="flex flex-col gap-[6px]">
          <label htmlFor="phone" className="text-base font-bold">
            Phone Number*
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="0450 521 300"
            required
            className="form-input"
          />
        </div>

        <fieldset className="flex flex-col gap-[6px]">
          <legend className="text-base font-bold">Select one:</legend>
          <div className="flex form-input flex-col gap-2">
            <RadioButton
              id="details1"
              name="details"
              value="from-scratch"
              checked={detailsOption === "from-scratch"}
              onChange={() => setDetailsOption("from-scratch")}
              label="I’ll share a bit about my event and you can create something beautiful from there."
            />
            <RadioButton
              id="details2"
              name="details"
              value="exact-plan"
              checked={detailsOption === "exact-plan"}
              onChange={() => setDetailsOption("exact-plan")}
              label="I know exactly what I want and have images or notes ready to share."
            />
          </div>
        </fieldset>

        <fieldset className="flex flex-col gap-[6px]">
          <legend className="text-base font-bold">Delivery / Pick Up*</legend>
          <div className="flex flex-col gap-2 form-input">
            <RadioButton
              id="delivery1"
              name="delivery"
              value="Australia Post"
              checked={deliveryOption === "Australia Post"}
              onChange={() => setDeliveryOption("Australia Post")}
              label="Australia Post"
            />
            <RadioButton
              id="delivery2"
              name="delivery"
              value="Pick-Up"
              checked={deliveryOption === "Pick-Up"}
              onChange={() => setDeliveryOption("Pick-Up")}
              label="Pick-Up"
            />
          </div>
        </fieldset>

        <div className="flex flex-col gap-[6px]">
          <label htmlFor="quantity" className="text-base font-bold">
            Quantity (Minimum 12)*
          </label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            min={12}
            required
            className="form-input"
          />
        </div>

        <div className="flex flex-col gap-[6px]">
          <label htmlFor="address" className="text-base font-bold">
            Address*
          </label>
          <AddressAutocomplete
            className="form-input"
            onSelectAddress={(address) => {
              setAddressDetails(address);
              setSelectedAddress(address.fullAddress);
            }}
          />
          <label htmlFor="unit" className="text-base font-bold">
            Unit / Apartment / Suite (optional)
          </label>
          <input
            id="unit"
            name="unit"
            type="text"
            placeholder="e.g. Unit 103"
            className="form-input"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-[6px]">
          <label htmlFor="notes" className="text-base font-bold">
            Any additional notes:
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={2}
            placeholder="Optional"
            className="form-input"
          />
        </div>
        <fieldset className="flex flex-col gap-[6px]">
          <legend className="text-base font-bold">
            What is your budget per cookie?
          </legend>
          <div className="flex flex-col gap-2 form-input">
            <RadioButton
              id="budget1"
              name="budget"
              value="$5 – $5.50"
              checked={budgetOption === "$5 – $5.50"}
              onChange={() => setBudgetOption("$5 – $5.50")}
              label="$5 – $5.50"
            />
            <RadioButton
              id="budget2"
              name="budget"
              value="$6 – $7"
              checked={budgetOption === "$6 – $7"}
              onChange={() => setBudgetOption("$6 – $7")}
              label="$6 – $7"
            />
            <RadioButton
              id="budget3"
              name="budget"
              value="$7 – $10"
              checked={budgetOption === "$7 – $10"}
              onChange={() => setBudgetOption("$7 – $10")}
              label="$7 – $10"
            />
          </div>
        </fieldset>
        <div className="">
          <label className="text-base font-bold mb-[6px] block">
            Upload Inspiration Image (optional):
          </label>
          <ImageUpload ref={imageRef} />
        </div>

        <fieldset className="flex flex-col gap-2 md:col-span-2 ">
          <legend className="text-base font-bold mb-[6px]">
            Acknowledgements (please check both):
          </legend>
          <Checkbox
            id="ack1"
            name="ack1"
            checked={accepted.terms}
            onChange={(e) =>
              setAccepted((prev) => ({ ...prev, terms: e.target.checked }))
            }
            label={
              <>
                I agree to the
                <a
                  href="/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>{" "}
                and Terms of Service of Tatacookies. I understand that my
                personal information will be used to process my order and
                communicate with me regarding my custom cookie order.
              </>
            }
          ></Checkbox>
          <Checkbox
            id="ack2"
            name="ack2"
            checked={accepted.pricing}
            onChange={(e) =>
              setAccepted((prev) => ({ ...prev, pricing: e.target.checked }))
            }
            label="I understand that submitting this form does not guarantee my order. My order will only be confirmed once all details are agreed upon and full payment is made. I also acknowledge that final pricing may vary depending on cookie size, quantity, and design complexity."
          />
        </fieldset>
      </div>

      <div className="flex flex-col-reverse gap-[40px] md:flex-row justify-between items-center mt-8">
        <PlainButtonLink
          href="/"
          className="text-primary text-base underline hover:text-title"
        >
          ← Go Back
        </PlainButtonLink>

        <ButtonOrLink
          type="submit"
          className="bg-primary text-text px-8 py-4 rounded-full"
          disabled={!accepted.terms || !accepted.pricing}
        >
          Submit →
        </ButtonOrLink>
      </div>
    </form>
  );
};

export default CustomCookieForm;
