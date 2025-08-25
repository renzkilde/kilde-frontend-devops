import { Table } from "antd";
import React from "react";
import { britishFormatDate } from "../../../Utils/Helpers";
import { formatCurrency } from "../../../Utils/Reusables";

const OutStandingPayment = ({ TrancheRes }) => {
  const outstandingPaymentColumns = [
    {
      title: "Payment date",
      dataIndex: "PaymentDate",
    },
    {
      title: "Interest",
      dataIndex: "Interest",
    },
    {
      title: "Principal",
      dataIndex: "Principal",
    },
    {
      title: "Total",
      dataIndex: "Total",
    },
  ];

  const outstandingPaymentData =
    TrancheRes?.tranche?.paymentScheduleSummary?.payments?.length > 0 &&
    TrancheRes?.tranche?.paymentScheduleSummary?.payments.map((payment) => {
      return {
        key: payment.paymentDate,
        PaymentDate: britishFormatDate(payment?.paymentDate),
        Total: formatCurrency(
          TrancheRes?.tranche?.currencySymbol,
          payment.total
        ),
        Interest: formatCurrency(
          TrancheRes?.tranche?.currencySymbol,
          payment.interest
        ),
        Principal: formatCurrency(
          TrancheRes?.tranche?.currencySymbol,
          payment.principal
        ),
      };
    });

  return (
    <div>
      <p className="mt-0 tranch-head mb-15">Repayment Schedule</p>
      <div className="mt-15 table-container">
        <Table
          columns={outstandingPaymentColumns}
          dataSource={outstandingPaymentData}
          className="trache-table outstanding-pay-table"
          pagination={false}
        />
        {/* <Table
          columns={outstandingPaymentColumns}
          dataSource={outstandingPaymentData}
          className="trache-table outstanding-pay-table"
          pagination={{
            pageSize: 7,
            total: outstandingPaymentData.length,
          }}
        /> */}
      </div>
    </div>
  );
};

export default OutStandingPayment;
