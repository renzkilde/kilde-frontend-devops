import { useEffect, useState } from "react";
import { Collapse, Input, Row, Select } from "antd";

import { Button } from "antd";
import Top_black from "../../../Assets/Images/Icons/top_black.svg";
import Down_black from "../../../Assets/Images/Icons/down_black.svg";
import {
  camelCaseSting,
  currencies,
  dealStatus,
  sortRatingsByOrder,
  trancheRatingsObject,
} from "../../../Utils/Reusables";
import ArrowUpAndDownIcon from "../../../Assets/Images/SVGs/ArrowLineUpDown.svg";
import Hyphen from "../../../Assets/Images/Hyphen.svg";
import Percent from "../../../Assets/Images/Percent.svg";
import { setTranchFilter } from "../../../Redux/Action/Dashboard";
import { useDispatch } from "react-redux";
import FilterTags from "./FilterTags";
import { getCountries } from "../../../Utils/Helpers";

const { Panel } = Collapse;

export const FilterSection = ({ title, children }) => {
  return (
    <Collapse
      defaultActiveKey={["1", "2", "3", "4", "5"]}
      bordered={false}
      expandIcon={({ isActive }) => (
        <img src={isActive ? Top_black : Down_black} alt="toggle icon" />
      )}
      expandIconPosition="end"
      className="tranche-custom-collapse"
    >
      <Panel header={<div className="panel-header">{title}</div>} key="1">
        {children}
      </Panel>
    </Collapse>
  );
};

const NewCommonFilter = ({
  trancheCountry,
  newTranchList,
  activeTrancheList,
  pastTrancheList,
  trancheInterest,
  trancheRatings,
  showComponent,
}) => {
  const dispatch = useDispatch();
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [activeCurrencyTab, setActiveCurrencyTab] = useState("ALL");
  const [filterData, setFilterData] = useState({
    fromInterest: "",
    toInterest: "",
    currency: activeCurrencyTab,
    country: "",
    dealStatus: selectedStatus,
    creditRating: "",
  });
  const countryList = getCountries();
  const matchingObjects = countryList?.filter((obj) =>
    trancheCountry?.includes(obj.key)
  );

  useEffect(() => {
    setTranchFilter({ data: filterData }, dispatch);
  }, [dispatch, filterData]);

  const handleStatusChange = (deal) => {
    setSelectedStatus(deal);
    setFilterData((prev) => ({ ...prev, dealStatus: deal }));
  };

  const handleChangeCurrency = (currency) => {
    setActiveCurrencyTab(currency);
    setFilterData((prev) => ({ ...prev, currency }));
  };

  const handleKeyDown = (event) => {
    const charCode = event.keyCode;
    if (
      (charCode < 48 || charCode > 57) &&
      (charCode < 96 || charCode > 105) &&
      charCode !== 8 &&
      charCode !== 46 &&
      charCode !== 9 &&
      charCode !== 27 &&
      charCode !== 13 &&
      charCode !== 110 &&
      charCode !== 190
    ) {
      event.preventDefault();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["fromInterest", "toInterest"].includes(name) && value > 100) {
      return;
    }

    setFilterData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInput = (event) => {
    const value = event.target.value;
    if (!/^\d*\.?\d*$/.test(value)) {
      // sanitize input for fromInterest and toInterest
      const cleanedValue = value.replace(/[^\d.]/g, "");
      setFilterData((prev) => ({
        ...prev,
        fromInterest: cleanedValue,
        toInterest: cleanedValue,
      }));
    }
  };

  const handleChangeRate = (rate) => {
    const value = rate?.value || "";
    setFilterData((prev) => ({ ...prev, creditRating: value }));
  };

  const handleCountry = async (e) => {
    const value = e?.key || "";
    const updatedFilterData = { ...filterData, country: value };

    setFilterData(updatedFilterData);
  };

  const clearAll = () => {
    setSelectedStatus("all");
    setActiveCurrencyTab("ALL");
    const clearedFilters = {
      fromInterest: "",
      toInterest: "",
      currency: "ALL",
      country: "",
      dealStatus: "all",
      creditRating: null,
    };
    setFilterData(clearedFilters);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        overflowY: "auto",
      }}
    >
      {/* Active Filter Tags */}
      <FilterTags
        filterData={filterData}
        handleChange={handleChange}
        handleChangeCurrency={handleChangeCurrency}
        handleStatusChange={handleStatusChange}
        handleChangeRate={handleChangeRate}
        handleCountry={handleCountry}
        showComponent={showComponent}
      />
      {((filterData.fromInterest && filterData.fromInterest !== "") ||
        (filterData.toInterest && filterData.toInterest !== "") ||
        (filterData.currency && filterData.currency !== "ALL") ||
        (filterData.country && filterData.country !== "") ||
        (filterData.dealStatus &&
          filterData.dealStatus !== "all" &&
          showComponent !== "all") ||
        (filterData.creditRating &&
          filterData.creditRating !== "" &&
          filterData.creditRating !== null)) && (
        <p
          className="modal-subtitle mt-0 mb-12 cursor-pointer p-0"
          onClick={clearAll}
        >
          Clear all
        </p>
      )}
      <div>
        {showComponent !== "all" && (
          <FilterSection title="Deal Status">
            <Row className="currency-filter-div">
              {dealStatus
                .filter(
                  (deal) =>
                    (deal !== "new" || newTranchList.length > 0) &&
                    (deal !== "active" || activeTrancheList.length > 0) &&
                    (deal !== "past" || pastTrancheList.length > 0)
                )
                .map((deal) => {
                  const isSelected =
                    selectedStatus === deal ||
                    (deal === "all" &&
                      (!selectedStatus || selectedStatus === null));

                  return (
                    <Button
                      key={deal}
                      onClick={() => handleStatusChange(deal)}
                      className={isSelected ? "active-tab" : ""}
                    >
                      {camelCaseSting(deal)}
                    </Button>
                  );
                })}
            </Row>
          </FilterSection>
        )}

        <FilterSection title="Currency">
          <Row className="currency-filter-div">
            {currencies.map((currency) => (
              <Button
                key={currency}
                onClick={() => handleChangeCurrency(currency)}
                className={
                  activeCurrencyTab === currency ||
                  (currency === "ALL" &&
                    (!activeCurrencyTab || activeCurrencyTab === null))
                    ? "active-tab"
                    : null
                }
              >
                {currency}
              </Button>
            ))}
          </Row>
        </FilterSection>

        <FilterSection title="Rating">
          <Row className="currency-filter-div">
            <Select
              value={filterData?.creditRating || undefined}
              showSearch
              suffixIcon={<img src={ArrowUpAndDownIcon} alt="arrow-icon" />}
              allowClear
              placeholder="Select bond rating"
              onChange={(value, key) => handleChangeRate(key)}
              className="tranche-rating-select"
              options={sortRatingsByOrder(trancheRatingsObject(trancheRatings))}
              style={{ height: 40 }}
            />
          </Row>
        </FilterSection>

        <FilterSection title="Interest Rate">
          <Row className="currency-filter-div">
            <div className="tranche-interest-div">
              <div style={{ position: "relative" }}>
                <Input
                  value={filterData?.fromInterest}
                  placeholder="From"
                  className="tranche-filter-input"
                  name="fromInterest"
                  onChange={handleChange}
                  type="number"
                  onKeyDown={handleKeyDown}
                  onInput={handleInput}
                  list="interest-options"
                  autoComplete="off"
                />
                <datalist id="interest-options">
                  {trancheInterest?.map((val) => (
                    <option value={val} key={val} />
                  ))}
                </datalist>
                <img
                  src={Percent}
                  alt="percentage"
                  style={{ position: "absolute", top: 10, right: 16 }}
                />
              </div>

              <div className="mt-4">
                <img src={Hyphen} alt="Hyphen" />
              </div>
              <div style={{ position: "relative" }}>
                <Input
                  value={filterData?.toInterest}
                  placeholder="To"
                  className="tranche-filter-input"
                  name="toInterest"
                  onChange={handleChange}
                  type="number"
                  onKeyDown={handleKeyDown}
                  onInput={handleInput}
                  list="interest-options"
                  autoComplete="off"
                />
                <datalist id="interest-options">
                  {trancheInterest?.map((val) => (
                    <option value={val} key={val} />
                  ))}
                </datalist>
                <img
                  src={Percent}
                  alt="percentage"
                  style={{ position: "absolute", top: 10, right: 16 }}
                />
              </div>
            </div>
          </Row>
        </FilterSection>

        <FilterSection title="Country">
          <Select
            value={
              filterData?.country !== undefined && filterData?.country !== null
                ? matchingObjects.find(
                    (country) => country.key === filterData?.country
                  )?.value
                : undefined
            }
            showSearch
            suffixIcon={<img src={ArrowUpAndDownIcon} alt="arrow-icon" />}
            allowClear
            placeholder="Select a country"
            onChange={(value, key) => handleCountry(key)}
            className="tranche-rating-select"
            options={matchingObjects}
          />
        </FilterSection>
      </div>
    </div>
  );
};

export default NewCommonFilter;
