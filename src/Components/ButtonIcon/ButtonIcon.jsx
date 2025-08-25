import React from "react";
import { Button } from "antd";

import "./style.css";

const ButtonIcon = ({ title, onClick, loading, style, icon, block, id }) => {
  return (
    <Button
      className="kl-button-icon"
      onClick={onClick}
      loading={loading}
      block={block}
      id={id}
    >
      {icon}

      {title && <span className="kl-iconBtn-subtitle">{title}</span>}
    </Button>
  );
};

export default ButtonIcon;
