import React from "react";
import ManualInvestment from "./ManualInvestment";
import AutoInvestment from "./AutoInvestment";
import buttonActive from "../../../../src/Assets/Images/ButtonActive.svg";
import frame from "../../../../src/Assets/Images/Frame.svg";
import frameActive from "../../../../src/Assets/Images/FrameActive.svg";
import button from "../../../../src/Assets/Images/Button.svg";

import "./style.css";

const InvestmentToggle = ({
  showComponent,
  handleToggle,
  showButtonActive,
  setShowButtonActive,
}) => {
  const handleButtonToggle = () => {
    setShowButtonActive((prevShowButtonActive) => !prevShowButtonActive);
  };

  showComponent === "Manual Invest" ? (
    <ManualInvestment showButtonActive={showButtonActive} />
  ) : (
    <AutoInvestment showButtonActive={showButtonActive} showLayout={false} />
  );

  return (
    <div className="invest-page-div">
      <div className="invest-maindiv cursor-pointer">
        <p
          className={
            showComponent === "Manual Invest"
              ? "invest-subtitle-active m-0"
              : "invest-subtitle m-0"
          }
          onClick={handleToggle}
        >
          Manual Invest
        </p>
        <p
          className={
            showComponent === "Auto-investment"
              ? "invest-subtitle-active m-0"
              : "invest-subtitle m-0"
          }
          onClick={handleToggle}
        >
          Auto-investment
        </p>
      </div>
      {showComponent === "Manual Invest" ? (
        showButtonActive ? (
          <div
            className="invest-button cursor-pointer"
            onClick={handleButtonToggle}
          >
            <img src={buttonActive} alt="button" />
            <img src={frame} alt="button" />
          </div>
        ) : (
          <div
            className="invest-button cursor-pointer"
            value="passive"
            onClick={handleButtonToggle}
          >
            <img src={button} alt="button" />
            <img src={frameActive} alt="button" />
          </div>
        )
      ) : null}
    </div>
  );
};

export default InvestmentToggle;
