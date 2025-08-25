import NewCommonFilter from "./NewCommonFilter";

const NewFilterComponent = ({
  trancheCountry,
  newTranchList,
  activeTrancheList,
  pastTrancheList,
  trancheInterest,
  trancheRatings,
  showComponent,
}) => {
  return (
    <div className="new-filter-desktop-comp">
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
  );
};

export default NewFilterComponent;
