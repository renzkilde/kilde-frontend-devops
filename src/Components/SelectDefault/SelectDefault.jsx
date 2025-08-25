import React, { useEffect, useState } from "react";
import { Select } from "antd";
import "./style.css";

const { Option } = Select;

const SelectDefault = ({
  className,
  disabled,
  placeholder,
  defaultValue,
  size,
  style,
  type,
  value,
  onChange,
  onSearch,
  data,
  errorMsg,
  MyValue,
  validationState,
  mode,
  allowClear,
  suffixIcon,
  maxTagCount,
}) => {
  const [focused, setFocused] = useState(undefined);

  useEffect(() => {
    if (validationState === true) {
      setFocused("error");
    }
    if (MyValue) {
      setFocused(undefined);
    }
  }, [MyValue, validationState]);

  const handleFocused = () => {
    if (MyValue) {
      setFocused(undefined);
    }
  };

  const handleBlur = () => {
    if (MyValue) {
      setFocused(undefined);
    } else {
      setFocused("error");
    }
  };

  return (
    <div>
      <Select
        maxTagCount={maxTagCount}
        disabled={disabled}
        mode={mode}
        autoFocus={validationState === true}
        status={focused}
        size={size}
        style={style}
        type={type}
        className={`${className} sb-select`}
        showSearch
        placeholder={placeholder}
        defaultValue={defaultValue}
        value={value}
        optionFilterProp="children"
        onChange={onChange}
        onFocus={handleFocused}
        onBlur={handleBlur}
        onSearch={onSearch}
        filterOption={(input, option) =>
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        allowClear={allowClear}
        suffixIcon={suffixIcon}
      >
        {data &&
          data.map((option, id) => (
            <Option key={id} value={option.key}>
              {option.value}
            </Option>
          ))}
      </Select>
      {focused === "error" && (
        <span className="select-error-msg">{errorMsg}</span>
      )}
    </div>
  );
};

export default SelectDefault;
