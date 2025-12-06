import React from "react";

export default function RadioButton({
  value,
  checked,
  onChange,
  name,
  id,
  label,
  disabled,
}) {
  return (
    <label
      htmlFor={id}
      className={`
        flex items-center gap-3 text-sm text-[#46494c] 
        ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        disabled={disabled}
        checked={checked}
        onChange={onChange}
        className="radio-hidden"
      />

      <div
        className={`
          w-3 h-3 rounded-full border-2 flex items-center justify-center flex-shrink-0
          transition-all duration-200 ease-in-out relative
          ${checked ? "border-[#8fe3d9]" : "border-[#1985a1]"}
        `}
      >
        {checked && (
          <div className="w-1.5 h-1.5 rounded-full bg-[#1985a1] radio-pulse" />
        )}
      </div>

      {label}
    </label>
  );
}
