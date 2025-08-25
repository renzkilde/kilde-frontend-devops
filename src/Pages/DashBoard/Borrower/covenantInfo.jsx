/* eslint-disable react-hooks/exhaustive-deps */
import { Table } from "antd";
import React, { useEffect, useState } from "react";

const AssetsInfo = ({ TrancheRes }) => {
  const [keyFinancialsCsv, setKeyFinancialsCsv] = useState([]);

  useEffect(() => {
    const csvData = TrancheRes?.tranche?.details?.covenantCsv;
    if (csvData !== undefined && csvData !== null && csvData !== "") {
      const rows = csvData
        .replace(/\\n/g, "\n")
        .split("\n")
        .map((row) => row?.trim())
        .filter(Boolean);

      if (rows.length > 1) {
        const headers = rows[0]
          .split(";")
          .map((header) => header?.replace(/"/g, "").trim());

        const financialsData = rows?.slice(1).map((row) => {
          const values = row
            .split(";")
            .map((value) => value?.replace(/"/g, "").trim());

          const financial = {};
          headers.forEach((header, index) => {
            let value = values[index];

            if (value === "-" || value === "") {
              financial[header] = null;
            } else if (value?.endsWith("%")) {
              financial[header] = value;
            } else if (/^-?\d{1,3}(,\d{3})*(\.\d+)?$/.test(value)) {
              const numberValue = parseFloat(value.replace(/,/g, ""));
              financial[header] = new Intl.NumberFormat("en-US").format(
                numberValue
              );
            } else if (!isNaN(value?.replace(",", "."))) {
              financial[header] = parseFloat(value);
            } else {
              financial[header] = value;
            }
          });

          return financial;
        });

        setKeyFinancialsCsv(financialsData);
      } else {
        console.error(
          "Invalid Deal Monitoring CSV data: No rows found after headers."
        );
      }
    }
  }, []);

  const generateColumns = (data) => {
    if (data.length === 0) return [];
    return Object.keys(data[0]).map((key) => ({
      title: key,
      dataIndex: key.replace(/[\s,]/g, ""),
    }));
  };

  const generateDataForTable = (data) => {
    return data.map((item, index) => {
      const modifiedItem = {};
      Object.keys(item).forEach((key) => {
        modifiedItem[key.replace(/[\s,]/g, "")] = item[key];
      });
      return {
        key: index,
        ...modifiedItem,
      };
    });
  };

  const financialColumns = generateColumns(keyFinancialsCsv);
  const financialDataForTable = generateDataForTable(keyFinancialsCsv);

  return (
    <>
      <div className="infomation-div" style={{ height: "100%" }}>
        <p className="mt-0 tranch-head mb-15">Deal Monitoring</p>
        <div className="mt-15 table-container">
          <Table
            columns={financialColumns}
            dataSource={financialDataForTable}
            className="trache-table outstanding-pay-table"
          />
        </div>
      </div>
    </>
  );
};

export default AssetsInfo;
