import React from "react";
import buttonActive from "../../../Assets/Images/ButtonActive.svg";
import frame from "../../../Assets/Images/Frame.svg";
import frameActive from "../../../Assets/Images/FrameActive.svg";
import button from "../../../Assets/Images/Button.svg";
import { Tooltip } from "antd";

const InvestToggleButton = ({ isActive, onToggle }) => {
  return (
    <>
      {isActive ? (
        <div className="invest-button cursor-pointer" onClick={onToggle}>
          <Tooltip title="Card view">
            <img src={buttonActive} alt="button" />
          </Tooltip>
          <Tooltip title="List view">
            <img src={frame} alt="button" />
          </Tooltip>
        </div>
      ) : (
        <div
          className="invest-button cursor-pointer"
          value="passive"
          onClick={onToggle}
        >
          <Tooltip title="Card view">
            <img src={button} alt="button" />
          </Tooltip>
          <Tooltip title="List view">
            <img src={frameActive} alt="button" />
          </Tooltip>
        </div>
      )}
    </>
  );
};

export default InvestToggleButton;
