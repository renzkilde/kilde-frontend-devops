import React, { useState } from "react";
import { Select, Tag } from "antd";
import ArrowUpAndDownIcon from "../../Assets/Images/SVGs/ArrowLineUpDown.svg";

const SelectAndChips = ({ placeholder }) => {
  const [options] = useState([
    { value: "lucy", label: "Lucy" },
    { value: "test", label: "Test" },
  ]);
  const [selected, setSelected] = useState([]);

  const handleClose = (valueToRemove) => {
    setSelected((prevSelected) =>
      prevSelected.filter((option) => option.value !== valueToRemove)
    );
  };

  const handleChange = (value, option) => {
    if (!selected.some((item) => item.value === option.value)) {
      setSelected((prevSelected) => [...prevSelected, option]);
    }
  };

  return (
    <div>
      <Select
        placeholder={placeholder}
        options={options}
        onChange={(value, option) => handleChange(value, option)}
        suffixIcon={<img src={ArrowUpAndDownIcon} alt="arrow-icon" />}
        style={{ width: 500 }}
        value={undefined}
      />

      {selected.map((tag) => (
        <Tag
          key={tag.value}
          closable
          style={{ userSelect: "none" }}
          onClose={() => handleClose(tag.value)}
        >
          <span>{tag.label}</span>
        </Tag>
      ))}
    </div>
  );
};

export default SelectAndChips;
