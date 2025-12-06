import React from "react";

export default function Checkbox({
  value,
  checked,
  onChange,
  name,
  id,
  label,
  disabled,
}) {
  return (
    <>
      <label
        htmlFor={id}
        className={`
          flex items-center gap-3 text-sm text-[#46494c] 
          ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
        `}
      >
        <input
          id={id}
          type="checkbox"
          name={name}
          value={value}
          disabled={disabled}
          checked={checked}
          onChange={onChange}
          className="checkbox-hidden"
        />

        <div
          className={`
            w-4 h-4 rounded-[4px] border-2 border-[#1985a1] flex items-center justify-center flex-shrink-0
            transition-all duration-200 ease-in-out relative checkbox-indicator
            ${checked ? "bg-[#1985a1] border-[#1985a1]" : "bg-transparent"}
          `}
        >
          {checked && (
            <div className="checkbox-checkmark absolute w-[45%] h-[80%] border-r-2 border-b-2 border-[#eff7f6] transform rotate-45 left-[0.05em]" />
          )}
        </div>

        {label}
      </label>
    </>
  );
}
