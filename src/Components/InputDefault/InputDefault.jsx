import React from "react";
import { Input } from "antd";

import "./style.css";

const InputDefault = ({
  className,
  prefix,
  placeholder,
  size,
  style,
  type,
  value,
  onChange,
  name,
  required,
  pattern,
  errorMsg,
  status,
  focusing,
  onBlur,
  validationState,
  disabled,
  autoComplete,
  suffix,
  max,
  min,
}) => {
  const handleFocusOut = (e) => {
    const { name, value } = e.target;
    if (validationState) {
      if (value === "") {
        validationState((prevErrors) => ({
          ...prevErrors,
          [name]: value.trim() === "",
        }));
      } else {
        validationState((prevErrors) => ({
          ...prevErrors,
          [name]: value.trim() !== "",
        }));
      }
    }
  };
  return (
    <>
      <Input
        onKeyDown={(e) => {
          const { name } = e.target;
          if (type === "number") {
            if (["e", "E", "+", "-"].includes(e.key) && e.key !== ".") {
              e.preventDefault();
            }
          } else if (
            (type === "text" && name === "firstName") ||
            name === "lastName"
          ) {
            if (/[\d]/.test(e.key)) {
              e.preventDefault();
            }
          }
        }}
        className={`${className} kl-input`}
        placeholder={placeholder}
        size={size}
        prefix={prefix}
        style={style}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        name={name}
        required={required}
        focused={focusing?.toString()}
        onBlur={onBlur ? onBlur : handleFocusOut}
        pattern={pattern}
        status={status}
        disabled={disabled}
        suffix={suffix}
        max={max}
        min={min}
      />
      <span className="error-msg">{errorMsg}</span>
    </>
  );
};

export default InputDefault;
