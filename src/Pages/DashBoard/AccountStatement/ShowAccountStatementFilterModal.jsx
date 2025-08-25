import React from "react";
import { Modal } from "antd";
import AccountStatementCommonFilter from "./AccountStatementCommonFilter";

const ShowAccountStatementFilterModal = ({ filterModal, setFilterModal }) => {
  return (
    <div>
      <Modal
        className="filter-res-modal"
        centered
        width={768}
        footer={null}
        onCancel={() => setFilterModal(false)}
        open={filterModal}
      >
        <div className="filter-modal-div">
          <AccountStatementCommonFilter />
        </div>
      </Modal>
    </div>
  );
};

export default ShowAccountStatementFilterModal;
