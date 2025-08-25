import bannerImage from "../../../Assets/Images/SVGs/annoucement.png";

const InvestBanner = () => {
  return (
    <div className="w-100">
      <div className="twofa-banner-div">
        <div className="twofa-subdiv">
          <div
            style={{ color: "var(--kilde-blue)" }}
            className="twofa-secondsubdiv"
          >
            <img
              src={bannerImage}
              alt="2fa-banner"
              style={{ marginRight: "12px" }}
            />
            {window.innerWidth <= 576 && (
              <p
                style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  lineHeight: "24px",
                }}
                className="mb-0 mt-0"
              >
                Our Recent Popular SGD Deals Sold Out Fast.
              </p>
            )}
          </div>
          <div className="twofa-thirdsubdiv">
            {window.innerWidth > 576 && (
              <p
                style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  lineHeight: "24px",
                }}
                className="mb-0 mt-0"
              >
                Our Recent Popular SGD Deals Sold Out Fast.
              </p>
            )}
            <p
              className="mt-8 mb-0"
              style={{
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: "20px",
              }}
            >
              New opportunities will be available every Monday — stay tuned!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestBanner;
