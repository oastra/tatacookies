"use client";
import React, { useState, useRef } from "react";
import DatePicker from "react-datepicker";
import { format, addDays } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";

import CalendarIcon from "../icons/CalendarIcon";
import NextMonthIcon from "../icons/NextMonthIcon";

const CustomDatePicker = ({ selectedDate, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const datePickerRef = useRef();

  const handleInputClick = () => setIsOpen((prev) => !prev);

  const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
    <button
      type="button"
      onClick={() => {
        onClick(); // still needed for react-datepicker internal focus handling
        handleInputClick();
      }}
      ref={ref}
      className="w-full flex justify-between items-center px-4 py-2 border border-gray-300 rounded-md text-title bg-white"
    >
      <span>{value || "dd.mm.yyyy"}</span>
      <CalendarIcon className="ml-2" />
    </button>
  ));
  CustomInput.displayName = "CustomInput";

  return (
    <DatePicker
      ref={datePickerRef}
      selected={selectedDate}
      onChange={(date) => {
        onChange(date);
        setIsOpen(false); // close calendar after selecting
      }}
      onClickOutside={() => setIsOpen(false)} // close when clicking outside
      open={isOpen}
      customInput={<CustomInput />}
      placeholderText="dd.mm.yyyy"
      dateFormat="dd.MM.yyyy"
      minDate={addDays(new Date(), 1)}
      calendarClassName="custom-calendar"
      dayClassName={() => "custom-day"}
      id="event-date"
      renderCustomHeader={({ date, increaseMonth, decreaseMonth }) => (
        <div className="flex justify-between items-center px-3 py-3">
          <button
            type="button"
            onClick={decreaseMonth}
            aria-label="Previous Month"
            className="mr-auto"
          >
            <NextMonthIcon className="-scale-x-100" />
          </button>
          <span className="text-title mx-auto text-button">
            {format(date, "MMMM yyyy")}
          </span>
          <button
            type="button"
            onClick={increaseMonth}
            aria-label="Next Month"
            className="ml-auto"
          >
            <NextMonthIcon />
          </button>
        </div>
      )}
    />
  );
};

export default CustomDatePicker;
