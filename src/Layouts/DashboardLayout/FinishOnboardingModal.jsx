import { Modal } from "antd";
import React from "react";
import ButtonDefault from "../../Components/ButtonDefault/ButtonDefault";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { handleFinish } from "../../Utils/Reusables";

const FinishOnboardingModal = ({ setShowModal, showModal, title }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  return (
    <Modal
      className="finishonboardingmodal"
      centered
      width={768}
      footer={null}
      open={showModal}
      closable={false}
    >
      <div className="sb-flex-column-item-center">
        <p className="modaltitle">Your account is not active</p>
        <p className="business-dec-borrower mt-0">
          {`You will able to see the ${title} after your account is activated.`}
        </p>
        <ButtonDefault
          title="Finish Onboarding"
          onClick={() => handleFinish(user, navigate)}
        />
      </div>
    </Modal>
  );
};

export default FinishOnboardingModal;
