"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";

const CustomDatePicker = dynamic(() => import("../common/CustomDatePicker"), {
  ssr: false,
});

import ButtonOrLink from "../ui/ButtonOrLink";
import PlainButtonLink from "../ui/PlainButtonLink";
import Checkbox from "../common/Checkbox";
import ImageUpload from "../common/ImageUpload";
import AddressAutocomplete from "./AddressAutocomplete";

const CustomCookieForm = () => {
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

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        if (!selectedDate) {
          alert("Please select a date");
          return;
        }

        if (!selectedAddress) {
          alert("Please select a valid address");
          return;
        }

        const fullDeliveryAddress = unit
          ? `${unit}, ${addressDetails.fullAddress}`
          : addressDetails.fullAddress;

        console.log("Selected Date:", selectedDate);
        console.log("Full delivery address:", fullDeliveryAddress);

        if (accepted.terms && accepted.pricing) {
          console.log("Form submitted");
          // TODO: send form data to backend
        }
      }}
      className="w-full bg-bgBlue mx-auto flex flex-col gap-[40px]"
    >
      <div className="text-center">
        <h1 className="text-title text-h3 mb-2">Custom Cookie Order Form</h1>
        <p className="text-button font-normal max-w-2xl mx-auto mb-2">
          Every special moment deserves a sweet little touch. We hand-decorate
          gingerbread cookies with royal icing, creating designs that feel just
          right for your celebration.
        </p>
        <p className="text-button font-normal max-w-2xl mx-auto mb-2">
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

        <div className="flex flex-col gap-[6px]">
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
            placeholder="+345 230 23 10"
            required
            className="form-input"
          />
        </div>

        <fieldset className="flex flex-col gap-[6px]">
          <legend className="text-base font-bold">Select one:</legend>
          <div className="flex flex-col gap-2 ml-1">
            <label className="flex gap-2">
              <input type="radio" name="details" required /> I’ll share a bit
              about my event and you can create something beautiful from there.
            </label>
            <label className="flex gap-2">
              <input type="radio" name="details" /> I know exactly what I want
              and have images or notes ready to share.
            </label>
          </div>
        </fieldset>

        <fieldset className="flex flex-col gap-[6px]">
          <legend className="text-base font-bold">Delivery / Pick Up*</legend>
          <div className="flex flex-col gap-2 ml-1">
            <label className="flex gap-2">
              <input type="radio" name="delivery" /> Australia Post
            </label>
            <label className="flex gap-2">
              <input type="radio" name="delivery" /> Pick-Up
            </label>
          </div>
        </fieldset>

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

        <fieldset className="flex flex-col gap-[6px] md:col-span-2">
          <legend className="text-base font-bold">
            What is your budget per cookie?
          </legend>
          <div className="flex flex-col gap-2 ml-1">
            <label className="flex gap-2">
              <input type="radio" name="budget" required /> $5 – $5.50
            </label>
            <label className="flex gap-2">
              <input type="radio" name="budget" /> $6 – $7
            </label>
            <label className="flex gap-2">
              <input type="radio" name="budget" /> $7 – $10
            </label>
          </div>
        </fieldset>

        <div className="flex flex-col gap-[6px] md:col-span-2">
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

        <div className="md:col-span-2">
          <label className="text-base font-bold mb-[6px] block">
            Upload Inspiration Image (optional):
          </label>
          <ImageUpload />
        </div>

        <fieldset className="flex flex-col gap-2 md:col-span-2">
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
            label="I understand that submitting this form does not guarantee my order. My order will only be confirmed once all details are agreed upon and full payment is made."
          />
          <Checkbox
            id="ack2"
            name="ack2"
            checked={accepted.pricing}
            onChange={(e) =>
              setAccepted((prev) => ({ ...prev, pricing: e.target.checked }))
            }
            label="I also acknowledge that final pricing may vary depending on cookie size, quantity, and design complexity."
          />
        </fieldset>
      </div>

      <div className="flex justify-between items-center mt-8">
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
