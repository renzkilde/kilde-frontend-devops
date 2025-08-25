import { Button, Spin, Table } from "antd";
import ROUTES from "../../../Config/Routes";
import { useNavigate } from "react-router-dom";
import { formatCurrency, useWindowWidth } from "../../../Utils/Reusables";
import { britishFormatDate } from "../../../Utils/Helpers";
import Close from "../../../Assets/Images/Icons/Dashboard/close_icon.svg";
import Identify_tickmark from "../../../Assets/Images/identify_tickmark.svg";
import { useEffect, useState } from "react";

const ReservedInvestment = ({
  reservedInvestLoader,
  reservedInvestmentList,
  reserved_maturityDate_sort,
  setReserved_MaturityDate_sort,
  setCancelReservedInvestId,
  setCancelReservedModal,
  setApprovedReservedModal,
}) => {
  const navigate = useNavigate();
  const windowWidth = useWindowWidth();

  const handleViewTranche = (trancheUuid) => {
    navigate(`${ROUTES.TRANCH_INVEST}/${trancheUuid}`);
  };

  const reservedInvestmentColumns = [
    {
      title: "Tranche number / Title",
      dataIndex: "trancheNumber",
    },
    {
      title: "Kilde Rating",
      dataIndex: "kildeRating",
    },
    {
      title: "Principal Reseved",
      dataIndex: "principalReserved",
    },
    {
      title: "Interest Rate",
      dataIndex: "interestRate",
    },
    {
      title: "Maturity Date",
      dataIndex: "maturityDate",
      sorter: (a, b) => a.age - b.age,
      sortOrder: reserved_maturityDate_sort,
      sortDirections: ["ascend", "descend", "ascend"],

      onHeaderCell: () => ({
        onClick: () => {
          if (reserved_maturityDate_sort === "ascend") {
            setReserved_MaturityDate_sort("descend");
          } else if (reserved_maturityDate_sort === "descend") {
            setReserved_MaturityDate_sort("");
          } else {
            setReserved_MaturityDate_sort("ascend");
          }
        },
      }),
    },
    {
      title: "Next Payment",
      dataIndex: "nextPayment",
    },
    {
      title: " ",
      dataIndex: "Btns",
    },
  ];

  const ReservedInvestmentData =
    reservedInvestmentList?.length > 0 &&
    reservedInvestmentList?.map((item, index) => {
      return {
        key: index,
        uuid: item?.uuid,
        trancheNumber: (
          <div className="cursor-pointer">
            <p className="m-0">{item?.trancheNumber}</p>
            <h3 className="m-0">{item?.trancheTitle}</h3>
          </div>
        ),
        kildeRating: item?.creditRating,
        principalReserved: formatCurrency(
          item?.currencySymbol,
          item?.principalReserved
        ),
        interestRate: formatCurrency("", item?.interestRate) + "%",

        maturityDate: britishFormatDate(item?.maturityDate),
        nextPayment: (
          <div>
            <p className="dashborad-inv-text">
              {item?.nextPaymentDateOfSubscribed === null
                ? "-"
                : britishFormatDate(item?.nextPaymentDateOfSubscribed)}
            </p>
            <p className="dashborad-inv-text">
              {item?.nextPaymentDateOfSubscribed === null
                ? ""
                : formatCurrency(
                    item?.currencySymbol,
                    item?.nextPaymentAmountOfSubscribed
                  )}
            </p>
            {item?.dpd > 0 ? (
              <p className="invest-table-warning-msg">
                {item?.investmentStatus === "OUTSTANDING"
                  ? `Days past due: ${item?.dpd}`
                  : null}
              </p>
            ) : null}
          </div>
        ),
        Btns: (
          <div className="btns-div">
            <Button
              className="dashboard-approved-reserved-invest-button-icon"
              onClick={() => handleOpenApprovedModal(item?.uuid)}
            >
              <span className="dashboard-reserved-invest-title">Approved</span>
              <img src={Identify_tickmark} alt="Identify_tickmark" />
            </Button>
            <Button
              className="dashboard-invest-cancel-button-icon"
              onClick={() => handleOpenModal(item?.uuid)}
            >
              {windowWidth <= 576 ? null : (
                <span className="dashboard-invest-cancel-title">Cancel</span>
              )}
              <img src={Close} alt="close_icon" />
            </Button>
          </div>
        ),
      };
    });
  const handleOpenModal = (investId) => {
    setCancelReservedInvestId(investId);
    setCancelReservedModal(true);
  };

  const handleOpenApprovedModal = (investId) => {
    setCancelReservedInvestId(investId);
    setApprovedReservedModal(true);
  };

  return (
    <>
      <Table
        scroll={{ x: "auto" }}
        columns={reservedInvestmentColumns}
        dataSource={ReservedInvestmentData}
        className="trache-table outstanding-pay-table"
        pagination={false}
        loading={
          reservedInvestLoader
            ? {
                indicator: (
                  <div>
                    <Spin />
                  </div>
                ),
              }
            : false
        }
        onRow={(record, rowIndex) => {
          return {
            onClick: (e) => {
              const columnIndex = e.target.closest("td")?.cellIndex;
              const totalColumns = reservedInvestmentColumns.length;
              const isLastTwoColumns = columnIndex >= totalColumns - 2;

              if (!isLastTwoColumns) {
                handleViewTranche(record.uuid);
              }
            },
          };
        }}
      />
    </>
  );
};

export default ReservedInvestment;
