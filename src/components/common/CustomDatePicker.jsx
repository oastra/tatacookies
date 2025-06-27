"use client";

import React, { useState } from "react";
import Datepicker from "tailwind-datepicker-react";
import CalendarIcon from "../icons/CalendarIcon";

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
  datepickerClassNames: "top-[400px] right-[390px] ",
  weekDays: ["S", "M", "T", "W", "T", "F", "S"],
  theme: {
    background: "bg-white",
    input: "form-input pr-10 w-full",
    selected: "bg-title text-white font-semibold",
    hoverDate: "hover:!bg-primary hover:!text-white",
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
        className="w-full flex justify-between items-center px-4 py-2 border border-text30 rounded-md  text-title bg-white font-body text-button cursor-pointer"
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
        <CalendarIcon className="ml-2 w-5 h-5 text-title" />
      </button>
    </Datepicker>
  );
};

export default CustomDatePicker;
