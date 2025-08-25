import React from "react";
import { useNavigate } from "react-router-dom";
import { Steps } from "antd";
import { setCurrentSate } from "../../../Redux/Action/common";
import { useDispatch } from "react-redux";
import ROUTES from "../../../Config/Routes";

const KYCStepperOrganizationUI = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const current = 0;

  const onChangeStep = () => {
    switch (current) {
      case 0:
        navigate(ROUTES.ORGANIZATION_VERIFICATION);
        setCurrentSate(1, dispatch);

        break;
      case 1:
        navigate(ROUTES.ORGANIZATION_VERIFICATION);
        setCurrentSate(1, dispatch);

        break;
      default:
        break;
    }
  };
  const stepItems = [
    {
      title: (
        <div
          className={`sb-flex ${
            current === 0 && "sb-stepper-kilde-item-active"
          }  ${current !== 0 && "sb-stepper-kilde-item"} `}
        >
          <div>
            <span>Investor Type</span>
          </div>
        </div>
      ),
    },
    {
      title: (
        <div
          className={`sb-flex ${
            current === 1 && "sb-stepper-kilde-item-active"
          }  ${current !== 1 && "sb-stepper-kilde-item"} `}
        >
          <div>
            <span>Corporate Information</span>
          </div>
        </div>
      ),
    },
  ];
  return (
    <>
      <div className="sb-verification">
        <div className="sb-flex-wrap">
          <div style={{ flex: 1 }}>
            <Steps
              current={current}
              direction="vertical"
              items={stepItems}
              className={"stepper-killed"}
              onChange={onChangeStep}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default KYCStepperOrganizationUI;
