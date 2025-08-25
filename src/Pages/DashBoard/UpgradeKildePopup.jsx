import React from "react";
import { Button, Modal } from "antd";
import upgrading_kilde_img from "../../Assets/Images/Icons/upgrading_kilde_img.svg";
import ButtonDefault from "../../Components/ButtonDefault/ButtonDefault";
import x_upgrading from "../../Assets/Images/x_upgrading.svg";
import { MigrationUser } from "../../Apis/UserApi";

const UpgradeKildePopup = ({ upgradeKildeModal, setUpgradeKildeModal }) => {
  const handleMigrationUser = () => {
    MigrationUser();
    setUpgradeKildeModal(false);
  };
  return (
    <Modal
      className="upgrade-kilde-modal"
      open={upgradeKildeModal}
      footer={null}
      onCancel={() => setUpgradeKildeModal(false)}
      maskClosable={false}
      closable={false}
    >
      <div className="ant-modal-body">
        <div className="p-relative">
          <Button
            onClick={handleMigrationUser}
            className="upgrated-modal-close-btn"
          >
            <img src={x_upgrading} alt="x_upgrading" />
          </Button>
          <img
            src={upgrading_kilde_img}
            alt="mobile"
            className="upgrade-kilde-img"
          />
          <div className="ant-modal-subDiv">
            <p className="summary-table-p m-0">We have a new look for you!</p>
            <p className="kl-subtitle m-0">
              We hope you enjoy the fresh makeover with a new look. If you have
              any concerns, please contact us at{" "}
              <a
                href="mailto:sales@kilde.sg"
                style={{ color: "var(--kilde-blue)" }}
              >
                sales@kilde.sg
              </a>{" "}
            </p>
            <p className="kl-subtitle m-0">
              Regards,
              <br /> Kilde Team
            </p>
            <div className="w-100">
              <ButtonDefault
                title="Explore the new look"
                style={{ width: "100%" }}
                onClick={handleMigrationUser}
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UpgradeKildePopup;
