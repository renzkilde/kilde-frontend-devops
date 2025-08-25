import React from "react";
import { Button } from "antd";

import "./style.css";

const ButtonDefault = ({
  title,
  onClick,
  loading,
  style,
  block,
  disabled,
  id,
  type,
}) => {
  return (
    <Button
      htmlType="submit"
      className="kl-button-default"
      onClick={onClick}
      loading={loading}
      style={style}
      block={block}
      disabled={disabled}
      id={id}
      type={type}
    >
      {title}
    </Button>
  );
};

export default ButtonDefault;
