import { Col, Row } from "antd";
import CalendarBlank from "../../../Assets/Images/Icons/Dashboard/CalendarBlank.svg";

import {
  britishFormatDateWithTime,
  formatCurrency,
} from "../../../Utils/Reusables";
import "./style.css";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../../Config/Routes";
import DownloadNOA from "./DownloadNOA";
import TxStatus from "./TxStatus";

const TransactionCard = ({ item, currencySymbol }) => {
  const navigate = useNavigate();
  return (
    <Col xs={24} sm={24} md={12} className="transaction-card mt-8">
      <div className="transaction-card-topDiv">
        <div className="transaction-card-date-div">
          <img src={CalendarBlank} alt="calendar_blank" />
          <p className="m-0 transaction-date-label">
            {britishFormatDateWithTime(item?.postingTs)}
          </p>
        </div>
        <div className="transaction-btn-div">
          <TxStatus txTitle={item?.txTitle} txType={item?.txType} />
        </div>
      </div>
      <Row className="mt-12">
        <Col xs={12} lg={12}>
          <p className="mb-8 mt-0 card-info-tag">TX ID</p>
        </Col>
        <Col xs={12} lg={12}>
          <p className="mb-8 mt-0 dashboard-card-val-tag">{item.id}</p>
        </Col>
        <Col xs={12} lg={12}>
          <p className="m-0 card-info-tag">Tranche number / </p>
          <p className="mb-8 mt-0 card-info-tag">Borrower </p>
        </Col>
        <Col
          xs={12}
          lg={12}
          className={item?.trancheUuid ? "cursor-pointer" : ""}
          onClick={() => {
            if (item?.trancheUuid) {
              navigate(`${ROUTES.TRANCH_INVEST}/${item?.trancheUuid}`);
            }
          }}
        >
          <p className="m-0 dashboard-card-val-tag">{item?.trancheNumber}</p>
          <p className="trans-company-label mb-8">{item?.trancheTitle}</p>
        </Col>
        <Col xs={12} lg={12}>
          <p className="mb-8 mt-0 card-info-tag">Amount</p>
        </Col>
        <Col xs={12} lg={12}>
          <p className="mb-8 mt-0 dashboard-card-val-tag">
            {formatCurrency(currencySymbol, item?.amount)}
          </p>
        </Col>
        <Col xs={12} lg={12}>
          <p className="mb-8 mt-0 card-info-tag">Amount reserved</p>
        </Col>
        <Col xs={12} lg={12}>
          <p className="mb-8 mt-0 dashboard-card-val-tag">
            {formatCurrency(currencySymbol, item?.amountReserved)}
          </p>
        </Col>
        <Col xs={12} lg={12}>
          <p className="mb-8 mt-0 card-info-tag">Balance</p>
        </Col>
        <Col xs={12} lg={12}>
          <p className="mb-8 mt-0 dashboard-card-val-tag">
            {formatCurrency(currencySymbol, item?.balance)}
          </p>
        </Col>
        <Col xs={12} lg={12}>
          <p className="mb-8 mt-0 card-info-tag">Documents</p>
        </Col>
        <Col xs={12} lg={12}>
          <DownloadNOA item={item} />
        </Col>
      </Row>
    </Col>
  );
};

export default TransactionCard;
