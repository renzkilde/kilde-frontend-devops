import React from "react";
import { Button } from "antd";

import "./style.css";

const ButtonOutline = ({ title, style }) => {
  return (
    <Button className="sb-button-outline" style={style}>
      {title}
    </Button>
  );
};

export default ButtonOutline;
