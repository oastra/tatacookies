"use client";

import React, { useState } from "react";
import Datepicker from "tailwind-datepicker-react";
import CalendarIcon from "../icons/CalendarIcon";
import CloseIcon from "../icons/CloseIcon";

const options = {
  autoHide: true,
  clearBtn: false,
  todayBtn: false,
  maxDate: new Date("2030-12-31"),
  minDate: new Date(),
  inputDateFormatProp: {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  },
  inputPlaceholderProp: "dd.mm.yyyy",
  datepickerClassNames: "top-[60px]",
  weekDays: ["S", "M", "T", "W", "T", "F", "S"],
  theme: {
    background: "bg-white",
    input: " pr-10 w-full",
    selected: "bg-title text-white font-semibold",
    disabledText: "text-gray-400 opacity-50 cursor-not-allowed",
  },
};

const CustomDatePicker = ({ selectedDate, onChange }) => {
  const [show, setShow] = useState(false);

  const handleChange = (date) => {
    onChange(date);
  };

  const handleClose = (state) => setShow(state);

  return (
    <Datepicker
      options={options}
      show={show}
      setShow={handleClose}
      onChange={handleChange}
      value={selectedDate}
    >
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="w-full flex justify-between items-center  relative form-input"
      >
        <span>
          {selectedDate
            ? `${selectedDate.getDate().toString().padStart(2, "0")}.${(
                selectedDate.getMonth() + 1
              )
                .toString()
                .padStart(2, "0")}.${selectedDate.getFullYear()}`
            : "dd.mm.yyyy"}
        </span>
        {show ? (
          <CloseIcon className="ml-2 w-4 h-4 text-text" />
        ) : (
          <CalendarIcon className="ml-2 w-4 h-4 text-text" />
        )}
      </button>
    </Datepicker>
  );
};

export default CustomDatePicker;
