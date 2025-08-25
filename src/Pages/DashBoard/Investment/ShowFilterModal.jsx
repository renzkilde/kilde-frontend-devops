import { Button, Drawer } from "antd";
import MenuCloseIcon from "../../../Assets/Images/menu-close.svg";
import CommonFilter from "./CommonFilter";

const ShowNewFilterModal = ({
  filterModal,
  setFilterModal,
  trancheCountry,
  newTranchList,
  activeTrancheList,
  trancheInterest,
  trancheRatings,
}) => {
  return (
    <>
      <Drawer
        title="Show Filters"
        footer={null}
        placement="right"
        closable={false}
        onClose={() => setFilterModal(false)}
        open={filterModal}
        className="drawer-header"
        size="large"
        extra={
          <Button
            className="user-normal-btn p-0"
            onClick={() => setFilterModal(false)}
          >
            <img
              src={MenuCloseIcon}
              alt="user_icon"
              className="drawer-close-button"
            />
          </Button>
        }
      >
        <div className="filter-modal-div">
          <CommonFilter
            trancheCountry={trancheCountry}
            newTranchList={newTranchList}
            activeTrancheList={activeTrancheList}
            trancheInterest={trancheInterest}
            trancheRatings={trancheRatings}
          />
        </div>
      </Drawer>
    </>
  );
};

export default ShowNewFilterModal;
