import React from "react";
import { Steps } from "antd";

const KYCStepperIndividualUI = ({ user }) => {
  const current = 0;
  const stepItems = [
    {
      title: (
        <div
          className={`sb-flex ${
            current === 0 && "sb-stepper-kilde-item-active"
          }  ${current !== 0 && "sb-stepper-kilde-item"}`}
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
            <span>Personal Details</span>
          </div>
        </div>
      ),
    },
    {
      title: (
        <div
          className={`sb-flex ${
            current === 2 && "sb-stepper-kilde-item-active"
          }  ${current !== 2 && "sb-stepper-kilde-item"} `}
        >
          <div>
            <span>Identity Verification</span>
          </div>
        </div>
      ),
    },
    {
      title: (
        <div
          className={`sb-flex ${
            current === 3 && "sb-stepper-kilde-item-active"
          }  ${current !== 3 && "sb-stepper-kilde-item"}`}
        >
          <div>
            <span>Proof of Address</span>
          </div>
        </div>
      ),
    },
    {
      title: (
        <div
          className={`sb-flex ${
            current === 4 && "sb-stepper-kilde-item-active"
          }  ${current !== 4 && "sb-stepper-kilde-item"} `}
        >
          <div>
            <span>Investor Status Confirmation</span>
          </div>
        </div>
      ),
    },
  ];

  const RagntakStepItems = [
    {
      title: (
        <div
          className={`sb-flex ${
            current === 0 && "sb-stepper-kilde-item-active"
          }  ${current !== 0 && "sb-stepper-kilde-item"}`}
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
            current === 4 && "sb-stepper-kilde-item-active"
          }  ${current !== 4 && "sb-stepper-kilde-item"} `}
        >
          <div>
            <span>Investor Status Confirmation</span>
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
              items={user?.singpassUser === true ? RagntakStepItems : stepItems}
              className="stepper-killed"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default KYCStepperIndividualUI;
