import { DownOutlined, SearchOutlined } from "@ant-design/icons";
import { AutoComplete, Button, Col, Dropdown, Input, Tooltip } from "antd";

import Tranche_ascending from "../../../Assets/Images/SVGs/tranche_ascending.svg";
import Tranche_descending from "../../../Assets/Images/SVGs/tranche_descending.svg";
import SlidersHorizontal from "../../../Assets/Images/SVGs/SlidersHorizontal.svg";
import Down_arrow from "../../../Assets/Images/Icons/Dashboard/down_arrow.svg";

import { useEffect, useRef } from "react";
import InvestToggleButton from "./InvestToggleButton";

const TrancheSearchSort = ({
  selectedSort,
  setSelectedSort,
  showButtonActive,
  searchValue,
  setSearchValue,
  trancheSearchVal,
  setShowButtonActive,
}) => {
  const inputRef = useRef(null);
  const mergedSearchValue = [
    ...trancheSearchVal.active,
    ...trancheSearchVal.new,
    ...trancheSearchVal.past,
  ];
  const handleButtonToggle = () => {
    setShowButtonActive((prevShowButtonActive) => !prevShowButtonActive);
  };

  const filteredOptions = searchValue
    ? mergedSearchValue?.length > 0 &&
      mergedSearchValue
        .filter((name) =>
          name?.toLowerCase().includes(searchValue?.toLowerCase())
        )
        .map((name) => ({ value: name }))
    : [];

  const handleMenuClick = (e) => {
    if (selectedSort === e.key) {
      setSelectedSort(null);
    } else {
      setSelectedSort(e.key);
    }
  };

  const menuItems = [
    {
      key: "issue_header",
      label: "Credit Rating",
      disabled: true,
      style: { fontWeight: 600, color: "#8c8c8c" },
    },
    {
      key: "credit_desc",
      label: (
        <>
          <img src={Tranche_ascending} alt="Tranche_ascending" />
          &nbsp;Highest first
        </>
      ),
    },
    {
      key: "credit_asc",
      label: (
        <>
          <img src={Tranche_descending} alt="Tranche_descending" />
          &nbsp;Lowest first
        </>
      ),
    },
    {
      key: "middle",
      label: "",
      disabled: true,
      style: {
        width: "100%",
        height: "1px",
        border: "1px solid var(--black-5, rgba(28, 28, 28, 0.05))",
        padding: 0,
      },
    },
    {
      key: "header",
      label: "Maturity Date",
      disabled: true,
      style: { fontWeight: 600, color: "#8c8c8c" },
    },
    {
      key: "asc",
      label: (
        <>
          <img src={Tranche_ascending} alt="Tranche_ascending" />
          &nbsp;Earliest maturity
        </>
      ),
    },
    {
      key: "desc",
      label: (
        <>
          <img src={Tranche_descending} alt="Tranche_descending" />
          &nbsp;Latest maturity
        </>
      ),
    },
  ];

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      const length = inputRef.current.input.value.length;
      inputRef.current.input.setSelectionRange(length, length);
    }
  }, [searchValue]);

  return (
    <Col className="search-toggle-div">
      <div style={{ display: "flex", gap: "10px" }}>
        <AutoComplete
          options={filteredOptions}
          style={{ width: "100%" }}
          value={searchValue}
          onChange={(value) => setSearchValue(value)}
        >
          <Input
            className="tranche-search-input"
            placeholder="Search by name or ID"
            prefix={<SearchOutlined style={{ color: "#8c8c8c" }} />}
          />
        </AutoComplete>
        <Tooltip title="Sorting">
          <Dropdown
            menu={{
              items: menuItems,
              selectedKeys: [selectedSort],
              onClick: handleMenuClick,
            }}
            trigger={["click"]}
          >
            <Button
              style={{
                backgroundColor: selectedSort !== null ? "#ecece8" : "#f9f7f2",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                height: "40px",
                padding: "0 12px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <img
                src={SlidersHorizontal}
                alt="tranche-sort"
                style={{ width: 16, height: 16 }}
              />
              <span className="invest-sort-btn">Sort</span>
              <img src={Down_arrow} alt="down-arrow" />
            </Button>
          </Dropdown>
        </Tooltip>
      </div>
      <InvestToggleButton
        isActive={showButtonActive}
        onToggle={handleButtonToggle}
      />
    </Col>
  );
};

export default TrancheSearchSort;
