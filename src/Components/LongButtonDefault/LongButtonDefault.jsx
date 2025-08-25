import React from "react";
import { Button } from "antd";

import "./style.css";

const LongButtonDefault = ({ title, style }) => {
  return (
    <Button className="sb-long-button" style={style} block>
      {title}
    </Button>
  );
};

export default LongButtonDefault;
