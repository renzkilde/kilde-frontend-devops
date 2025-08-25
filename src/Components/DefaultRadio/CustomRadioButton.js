import React from "react";
import './style.css'

const CustomRadioButton = ({ label, name, value, checked, onChange, className }) => {
    return (
        <label className={`${className} custom-radio ${checked ? "checked" : ""}`}>
            {label}
            <input
                type="radio"
                name={name}
                value={value}
                checked={checked}
                onChange={onChange}
                className="hidden"
            />
            <span className={`radio-circle ${checked ? "active" : ""}`}>
                {checked && <span className="radio-dot"></span>}
            </span>
        </label>
    );
};

export default CustomRadioButton;
