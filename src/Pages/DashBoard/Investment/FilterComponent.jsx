import CommonFilter from "./CommonFilter";

const NewFilterComponent = ({
  trancheCountry,
  newTranchList,
  activeTrancheList,
  trancheInterest,
  trancheRatings,
}) => {
  return (
    <div className="new-filter-desktop-comp">
      <CommonFilter
        trancheCountry={trancheCountry}
        newTranchList={newTranchList}
        activeTrancheList={activeTrancheList}
        trancheInterest={trancheInterest}
        trancheRatings={trancheRatings}
      />
    </div>
  );
};

export default NewFilterComponent;
