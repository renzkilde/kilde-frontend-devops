import { Tag } from "antd";
import CalendarBlank from "../../Assets/Images/SVGs/CalendarBlank.svg";
import tranche_currency from "../../Assets/Images/SVGs/tranche_currency.svg";

const PromoBanner = ({
  logo,
  currency,
  brand,
  title,
  description,
  dateRange,
  onLearnMore,
  promoLength,
}) => {
  return (
    <div className="promo-banner w-100">
      <div className="promo-label">PROMO</div>
      <div
        className={
          promoLength === 3
            ? "promo-single-content"
            : promoLength === 2
            ? "promo-double-content"
            : "promo-content"
        }
      >
        <div>
          <div className="promo-header">
            <img src={logo} alt="Brand Logo" className="promo-logo" />
            <Tag color="blue" className="currency-flag">
              <img src={tranche_currency} alt="tranche_currency" />
              {currency}
            </Tag>
          </div>
          <p className="tranch-head m-0">{title}</p>
          <p
            className="promo-description"
            dangerouslySetInnerHTML={{
              __html: description,
            }}
          />
          <div className="promo-date">
            <img src={CalendarBlank} alt="CalendarBlank" />
            {dateRange}
          </div>
        </div>
        <div>
          <button className="promo-btn" onClick={onLearnMore}>
            Learn more
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;
