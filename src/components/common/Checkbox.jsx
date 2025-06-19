import React from "react";
import styled, { keyframes } from "styled-components";

const Input = styled.input`
  height: 0;
  width: 0;
  opacity: 0;
  z-index: -1;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: #969696;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
`;

const draw = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.6) rotate(0deg);
  }
  70% {
    opacity: 1;
    transform: scale(1.1) rotate(45deg);
  }
  100% {
    transform: scale(1) rotate(45deg);
  }
`;

// Checkmark animation (your original)
const rotate = keyframes`
  from {
    opacity: 0;
    transform: rotate(0deg) scale(0.8);
  }
  to {
    opacity: 1;
    transform: rotate(45deg) scale(1);
  }
`;

const Indicator = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 4px; /* Use 8px for perfect circle */
  border: 2px solid #1985a1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease, border-color 0.2s ease;

  ${Input}:checked + & {
    background-color: #1985a1;
    border-color: #1985a1;
  }

  &::after {
    content: "";
    display: none;
    left: 0.05em;
    width: 45%;
    height: 80%;
    border: solid #eff7f6;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
    position: relative;
  }

  ${Input}:checked + &::after {
    display: block;
    animation: ${rotate} 0.3s ease-out forwards;
  }
`;

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
    <Label htmlFor={id} disabled={disabled}>
      <Input
        id={id}
        type="checkbox"
        name={name}
        value={value}
        disabled={disabled}
        checked={checked}
        onChange={onChange}
      />
      <Indicator />
      {label}
    </Label>
  );
}
