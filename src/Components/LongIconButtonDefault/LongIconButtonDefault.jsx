import React from "react";
import { Button } from "antd";
import { GooglePlusOutlined } from "@ant-design/icons";

const LongIconButtonDefault = ({ title }) => {
  return (
    <Button type="primary" icon={<GooglePlusOutlined />}>
      Search
    </Button>
  );
};

export default LongIconButtonDefault;
