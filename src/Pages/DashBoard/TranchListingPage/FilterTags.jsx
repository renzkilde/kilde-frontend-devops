import React, { useMemo } from "react";
import { Tag } from "antd";

const FilterTags = ({
  filterData,
  handleChange,
  handleChangeCurrency,
  handleStatusChange,
  handleChangeRate,
  handleCountry,
  showComponent,
}) => {
  const filterTags = useMemo(() => {
    const tags = [];

    if (filterData.fromInterest || filterData.toInterest) {
      tags.push({
        label: `Interest rate: ${filterData.fromInterest}-${filterData.toInterest}`,
        onClose: () => {
          handleChange({ target: { name: "fromInterest", value: "" } });
          handleChange({ target: { name: "toInterest", value: "" } });
        },
      });
    }

    if (filterData.currency && filterData.currency !== "ALL") {
      tags.push({
        label: `Currency: ${filterData.currency}`,
        onClose: () => handleChangeCurrency("ALL"),
      });
    }

    if (filterData.dealStatus && filterData.dealStatus !== "all") {
      tags.push({
        label: `Deal status: ${filterData.dealStatus}`,
        onClose: () => handleStatusChange("all"),
      });
    }

    if (filterData.creditRating) {
      tags.push({
        label: `Credit rating: ${filterData.creditRating}`,
        onClose: () => handleChangeRate(""),
      });
    }

    if (filterData?.country) {
      tags.push({
        label: `Country: ${filterData?.country}`,
        onClose: () => handleCountry(""),
      });
    }

    return tags.filter(
      (tag) =>
        !(
          showComponent === "all" &&
          tag.label.toLowerCase().startsWith("deal status:")
        )
    );
  }, [
    filterData.fromInterest,
    filterData.toInterest,
    filterData.currency,
    filterData.dealStatus,
    filterData.creditRating,
    filterData.country,
    handleChange,
    handleChangeCurrency,
    handleStatusChange,
    handleChangeRate,
    handleCountry,
    showComponent,
  ]);

  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {filterTags.map((tag, index) => (
        <Tag key={index} closable onClose={tag.onClose} className="filterlist">
          {tag.label}
        </Tag>
      ))}
    </div>
  );
};

export default FilterTags;
