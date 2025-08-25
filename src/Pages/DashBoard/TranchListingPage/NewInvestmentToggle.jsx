import React, { useEffect, useState } from "react";
import Building from "../../../Assets/Images/SVGs/Buildings.svg";
import Money from "../../../Assets/Images/SVGs/Money.svg";
import BuildingActive from "../../../Assets/Images/SVGs/Buildings_active.svg";
import MoneyActive from "../../../Assets/Images/SVGs/Money_active.svg";

import "./style.css";
import { Tabs } from "antd";

const InvestmentToggle = ({ setShowComponent, showComponent }) => {
  const [activeKey, setActiveKey] = useState(showComponent || "all");

  useEffect(() => {
    if (showComponent !== activeKey) {
      setActiveKey(showComponent);
    }
  }, [showComponent]);

  const onChange = (key) => {
    setActiveKey(key);
    setShowComponent(key);
  };

  const items = [
    {
      key: "all",
      label: "All",
    },
    {
      key: "deals",
      label: (
        <span style={{ display: "flex", alignItems: "center" }}>
          <img
            src={activeKey === "deals" ? BuildingActive : Building}
            alt="Deals"
            style={{ marginRight: 6 }}
          />
          Deals
        </span>
      ),
    },
    {
      key: "funds",
      label: (
        <span style={{ display: "flex", alignItems: "center" }}>
          <img
            src={activeKey === "funds" ? MoneyActive : Money}
            alt="Funds"
            style={{ marginRight: 6 }}
          />
          Funds
        </span>
      ),
    },
  ];

  return (
    <div className="v2-invest-page-div">
      <p className="invest-header mt-0 mb-8">Invest in:</p>
      <Tabs
        defaultActiveKey="all"
        activeKey={activeKey}
        items={items}
        onChange={onChange}
        className="tranche-listing-tab"
      />
    </div>
  );
};

export default InvestmentToggle;
