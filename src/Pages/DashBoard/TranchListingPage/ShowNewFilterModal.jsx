import { Button, Drawer } from "antd";
import MenuCloseIcon from "../../../Assets/Images/menu-close.svg";
import NewCommonFilter from "./NewCommonFilter";
const ShowNewFilterModal = ({
  filterModal,
  setFilterModal,
  trancheCountry,
  newTranchList,
  activeTrancheList,
  pastTrancheList,
  trancheInterest,
  trancheRatings,
  showComponent,
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
          <NewCommonFilter
            trancheCountry={trancheCountry}
            newTranchList={newTranchList}
            activeTrancheList={activeTrancheList}
            pastTrancheList={pastTrancheList}
            trancheInterest={trancheInterest}
            trancheRatings={trancheRatings}
            showComponent={showComponent}
          />
        </div>
      </Drawer>
    </>
  );
};

export default ShowNewFilterModal;
