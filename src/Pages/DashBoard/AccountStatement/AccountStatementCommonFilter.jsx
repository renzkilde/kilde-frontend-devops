/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Radio,
  Row,
  Space,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setAccStatementFilter } from "../../../Redux/Action/Dashboards";
import moment from "moment";
import Hyphen from "../../../Assets/Images/Hyphen.svg";
import "./style.css";
import { selectedCurrencyState } from "../../../Redux/Action/common";
import { getMaxOutstandingCurrency } from "../../../Utils/Reusables";

const AccountStatementCommonFilter = () => {
  const dispatch = useDispatch();
  const currencyCode = useSelector((state) => state?.common?.currency);
  const user = useSelector((state) => state?.user);
  const storedFilterData = {
    postingDateFrom: "",
    postingDateTo: "",
    currencyCode: "USD",
    txTypeSubtypeCombos: [],
  };
  const initialTxTypes = storedFilterData.txTypeSubtypeCombos?.map(
    (combo) => combo.txType
  );
  const initialSubTypes = storedFilterData.txTypeSubtypeCombos?.reduce(
    (acc, combo) => {
      if (combo.txType && combo.txSubType) {
        acc[combo.txType] = combo.txSubType;
      }
      return acc;
    },
    {}
  );

  const [filterData, setFilterData] = useState(storedFilterData);
  const [activeTab, setActiveTab] = useState(null);
  const [selectedTxTypes, setSelectedTxTypes] = useState(initialTxTypes);
  const [selectedSubTypes, setSelectedSubTypes] = useState(initialSubTypes);

  const subTypeOptions = {
    REPAYMENT: ["INTEREST", "PRINCIPAL", "WHT"],
    SUBSCRIPTION: [
      "PRINCIPAL",
      "ACCRUED_INTEREST",
      "PRINCIPAL_DISCOUNT",
      "FEE",
    ],
    SETTLEMENT: ["PRINCIPAL", "ACCRUED_INTEREST", "FEE"],
    INVESTMENT_SALE: ["PRINCIPAL", "ACCRUED_INTEREST", "PRINCIPAL_DISCOUNT"],
  };

  useEffect(() => {
    setAccStatementFilter(filterData, dispatch);
  }, [filterData, dispatch]);

  useEffect(() => {
    const combos = selectedTxTypes?.map((txType) => ({
      txType,
      txSubType:
        subTypeOptions[txType] && selectedSubTypes[txType]?.length > 0
          ? selectedSubTypes[txType]
          : null,
    }));

    setFilterData((prev) => ({
      ...prev,
      txTypeSubtypeCombos: combos,
    }));
  }, [selectedTxTypes, selectedSubTypes]);

  const handleChangeCurrency = (e) => {
    const newCurrencyCode = e.target.value;
    setFilterData((prev) => ({ ...prev, currencyCode: newCurrencyCode }));
    selectedCurrencyState(newCurrencyCode, dispatch);
  };

  useEffect(() => {
    if (currencyCode) {
      setFilterData((prev) => ({
        ...prev,
        currencyCode: currencyCode,
      }));
    }
  }, [currencyCode]);

  useEffect(() => {
    if (
      (localStorage.getItem("currencyCode") === null ||
        getMaxOutstandingCurrency(user.accounts) !==
          localStorage.getItem("currencyCode")) &&
      user?.accounts?.length > 0
    ) {
      const maxCurrency = getMaxOutstandingCurrency(user.accounts);
      localStorage.setItem("currencyCode", maxCurrency);
      setFilterData((prev) => ({
        ...prev,
        currencyCode: currencyCode,
      }));
      selectedCurrencyState(maxCurrency, dispatch);
    } else if (currencyCode) {
      selectedCurrencyState(currencyCode, dispatch);
    }
  }, [user, currencyCode]);

  const handleDateChange = (key, date, dateString) => {
    const isoDate = date
      ? moment(dateString, "DD/MM/YYYY").utc(true).toISOString()
      : null;
    setFilterData((prev) => ({ ...prev, [key]: isoDate }));
    resetActiveTab();
  };

  const resetActiveTab = () => {
    setActiveTab(null);
  };

  const handleTiming = (val) => {
    if (activeTab === val) {
      resetActiveTab();
      setFilterData((prev) => ({
        ...prev,
        postingDateFrom: "",
        postingDateTo: "",
      }));
    } else {
      const { from, to } = getDateRange(val);
      setActiveTab(val);
      setFilterData((prev) => ({
        ...prev,
        postingDateFrom: from,
        postingDateTo: to,
      }));
    }
  };

  const getDateRange = (val) => {
    let fromDate, toDate;
    switch (val) {
      case "today":
        fromDate = toDate = moment().startOf("day").utc(true);
        break;
      case "week":
        fromDate = moment().startOf("isoWeek").utc(true);
        toDate = moment().endOf("isoWeek").utc(true);
        break;
      case "month":
        fromDate = moment().startOf("month").utc(true);
        toDate = moment().endOf("month").utc(true);
        break;
      default:
        fromDate = toDate = moment();
    }
    return { from: fromDate.toISOString(), to: toDate.toISOString() };
  };

  const disabledDate = (current) => current && current > dayjs().endOf("day");

  const handleTxTypeChange = (selectedTypes) => {
    const removedTxTypes = selectedTxTypes?.filter(
      (type) => !selectedTypes.includes(type)
    );

    const updatedSubTypes = { ...selectedSubTypes };
    removedTxTypes?.forEach((type) => delete updatedSubTypes[type]);

    setSelectedTxTypes(selectedTypes);
    setSelectedSubTypes(updatedSubTypes);
  };

  const handleSubTypeChange = (txType, subTypes) => {
    setSelectedSubTypes((prev) => ({
      ...prev,
      [txType]: subTypes,
    }));
  };

  return (
    <div>
      <Row className="filter-modal">
        <Col span={24} className="filter-modal-head">
          Show Filters
        </Col>
        <Divider className="filter-modal-divider" />
      </Row>
      <div className="filter-media-input-div">
        <p className="filter-subtitle mt-0">Date</p>
        <Row className="currency-filter-div mb-24">
          {["today", "week", "month"].map((val) => (
            <Button
              key={val}
              onClick={() => handleTiming(val)}
              className={activeTab === val ? "active-tab" : ""}
            >
              {val.charAt(0).toUpperCase() + val.slice(1)}
            </Button>
          ))}
        </Row>
        <Row gutter={10}>
          <Col xs={11}>
            <DatePicker
              onChange={(date, dateString) =>
                handleDateChange("postingDateFrom", date, dateString)
              }
              placeholder="From"
              value={
                filterData.postingDateFrom
                  ? dayjs(filterData.postingDateFrom)
                  : null
              }
              format="DD/MM/YYYY"
              disabledDate={disabledDate}
            />
          </Col>
          <Col xs={2} style={{ marginTop: 5 }}>
            <img src={Hyphen} alt="Hyphen" />
          </Col>
          <Col xs={11}>
            <DatePicker
              onChange={(date, dateString) =>
                handleDateChange("postingDateTo", date, dateString)
              }
              placeholder="To"
              value={
                filterData.postingDateTo
                  ? dayjs(filterData.postingDateTo)
                  : null
              }
              format="DD/MM/YYYY"
              disabledDate={disabledDate}
            />
          </Col>
        </Row>

        <p className="filter-subtitle mt-24">Currency</p>
        <Radio.Group
          className="acc-filter-radio"
          onChange={handleChangeCurrency}
          value={filterData.currencyCode}
        >
          <Space direction="vertical">
            {["USD", "SGD", "EUR"].map((currency) => (
              <Radio key={currency} value={currency}>
                {currency}
              </Radio>
            ))}
          </Space>
        </Radio.Group>
        <p className="filter-subtitle mt-24">Transaction Type</p>
        <Checkbox.Group
          value={selectedTxTypes}
          onChange={handleTxTypeChange}
          className="acc-filter-checkbox"
        >
          <Row>
            <Col span={24}>
              <Checkbox className="checkbox-kilde" value="DEPOSIT">
                Deposit
              </Checkbox>
            </Col>
            <Col span={24}>
              <Checkbox className="checkbox-kilde" value="WITHDRAWAL_REQUEST">
                Withdrawal request
              </Checkbox>
            </Col>
            <Col span={24}>
              <Checkbox className="checkbox-kilde" value="WITHDRAWAL">
                Withdrawal
              </Checkbox>
            </Col>
            <Col span={24}>
              <Checkbox className="checkbox-kilde" value="SUBSCRIPTION">
                Subscription
              </Checkbox>
              {selectedTxTypes?.includes("SUBSCRIPTION") && (
                <div style={{ marginLeft: "24px" }}>
                  <Checkbox.Group
                    className="sub-checkbox-group"
                    value={selectedSubTypes.SUBSCRIPTION || []}
                    onChange={(subTypes) =>
                      handleSubTypeChange("SUBSCRIPTION", subTypes)
                    }
                  >
                    {subTypeOptions.SUBSCRIPTION?.map((subType) => (
                      <Checkbox
                        className="sub-checkbox"
                        value={subType}
                        key={subType}
                      >
                        {subType}
                      </Checkbox>
                    ))}
                  </Checkbox.Group>
                </div>
              )}
            </Col>
            <Col span={24}>
              <Checkbox className="checkbox-kilde" value="SETTLEMENT">
                Settlement
              </Checkbox>
              {selectedTxTypes?.includes("SETTLEMENT") && (
                <div style={{ marginLeft: "24px" }}>
                  <Checkbox.Group
                    className="sub-checkbox-group"
                    value={selectedSubTypes.SETTLEMENT || []}
                    onChange={(subTypes) =>
                      handleSubTypeChange("SETTLEMENT", subTypes)
                    }
                  >
                    {subTypeOptions.SETTLEMENT?.map((subType) => (
                      <Checkbox
                        className="sub-checkbox"
                        value={subType}
                        key={subType}
                      >
                        {subType}
                      </Checkbox>
                    ))}
                  </Checkbox.Group>
                </div>
              )}
            </Col>
            <Col span={24}>
              <Checkbox className="checkbox-kilde" value="REPAYMENT">
                Repayment
              </Checkbox>
              {selectedTxTypes?.includes("REPAYMENT") && (
                <div style={{ marginLeft: "24px" }}>
                  <Checkbox.Group
                    className="sub-checkbox-group"
                    value={selectedSubTypes.REPAYMENT || []}
                    onChange={(subTypes) =>
                      handleSubTypeChange("REPAYMENT", subTypes)
                    }
                  >
                    {subTypeOptions.REPAYMENT?.map((subType) => (
                      <Checkbox
                        className="sub-checkbox"
                        value={subType}
                        key={subType}
                      >
                        {subType}
                      </Checkbox>
                    ))}
                  </Checkbox.Group>
                </div>
              )}
            </Col>
            <Col span={24}>
              <Checkbox className="checkbox-kilde" value="BANK_CHARGES">
                Bank charges
              </Checkbox>
            </Col>
            <Col span={24}>
              <Checkbox className="checkbox-kilde" value="INVESTMENT_SALE">
                Investment sale
              </Checkbox>
              {selectedTxTypes?.includes("INVESTMENT_SALE") && (
                <div style={{ marginLeft: "24px" }}>
                  <Checkbox.Group
                    className="sub-checkbox-group"
                    value={selectedSubTypes.INVESTMENT_SALE || []}
                    onChange={(subTypes) =>
                      handleSubTypeChange("INVESTMENT_SALE", subTypes)
                    }
                  >
                    {subTypeOptions.INVESTMENT_SALE?.map((subType) => (
                      <Checkbox
                        className="sub-checkbox"
                        value={subType}
                        key={subType}
                      >
                        {subType}
                      </Checkbox>
                    ))}
                  </Checkbox.Group>
                </div>
              )}
            </Col>
          </Row>
        </Checkbox.Group>
      </div>
    </div>
  );
};

export default AccountStatementCommonFilter;
