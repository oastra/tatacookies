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
  color: #46494c;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
`;

const pulse = keyframes`
  0% {
    transform: scale(0.6);
    opacity: 0;
  }
  70% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(1);
  }
`;

const Indicator = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 9999px; /* Circle */
  border: 2px solid #1985a1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background-color 0.2s ease, border-color 0.2s ease;

  ${Input}:checked + & {
    border-color: #8fe3d9;
  }

  &::after {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 9999px;
    background-color: #1985a1;
    display: none;
  }

  ${Input}:checked + &::after {
    display: block;
    animation: ${pulse} 0.3s ease-out forwards;
  }
`;

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
    <Label htmlFor={id} disabled={disabled}>
      <Input
        id={id}
        type="radio"
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
