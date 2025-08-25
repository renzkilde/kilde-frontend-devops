import { Spin, Table } from "antd";
import React from "react";
import { formatCurrency } from "../../../Utils/Reusables";

const CurrencyExchangeList = ({ currencyExchangeLists, isLoading }) => {
  const CurrencyExchangeColumns = [
    {
      title: "Requested date",
      dataIndex: "requestDate",
    },
    {
      title: "Amount ",
      dataIndex: "amount",
    },
    {
      title: "Currency from",
      dataIndex: "currencyFrom",
    },
    {
      title: "Currency to",
      dataIndex: "currencyTo",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
  ];

  const CurrencyExchangeData = currencyExchangeLists?.map((request, index) => ({
    key: request?.key,
    requestDate: request?.requestDate,
    amount: formatCurrency("", request?.amount),
    currencyFrom: request?.currencyFrom,
    currencyTo: request?.currencyTo,
    status:
      request?.status === "PENDING" ? (
        <div className="withdraw-status-div">
          <span className="progress-circle-span"></span>
          <p className="progress-p">Pending</p>
        </div>
      ) : request?.status === "PROCESSED" ? (
        <div className="withdraw-status-div">
          <span className="settled-circle-span"></span>
          <p className="settled-p">Processed</p>
        </div>
      ) : request?.status === "SETTLED" ? (
        <div className="withdraw-status-div">
          <span className="settled-circle-span"></span>
          <p className="settled-p">Processed</p>
        </div>
      ) : request?.status === "EXPORTED" ? (
        <div className="withdraw-status-div">
          <span className="settled-circle-span"></span>
          <p className="settled-p">Processing</p>
        </div>
      ) : request?.status === "CANCELLED" ? (
        <div className="withdraw-status-div">
          <span className="failed-circle-span"></span>
          <p className="failed-p">Cancelled</p>
        </div>
      ) : null,
  }));

  return (
    <div>
      <Table
        columns={CurrencyExchangeColumns}
        dataSource={CurrencyExchangeData}
        pagination={false}
        className="trache-table outstanding-pay-table"
        loading={
          isLoading
            ? {
                indicator: (
                  <div>
                    <Spin />
                  </div>
                ),
              }
            : false
        }
      />
    </div>
  );
};

export default CurrencyExchangeList;
