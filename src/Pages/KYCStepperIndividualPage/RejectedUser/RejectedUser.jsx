import React, { useEffect } from "react";
import "./style.css";
import { Col, Row } from "antd";
import AuthLayout from "../../../Layouts/BlankHeaderLayout/AuthLayout";
import { getUser } from "../../../Apis/UserApi";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails } from "../../../Redux/Action/User";
import JivoChat from "../../../Layouts/BlankHeaderLayout/JivoChat";

const RejectedUser = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const getUserDetails = async () => {
    const response = await getUser();
    if (response) {
      setUserDetails(response, dispatch);
    } else {
      console.error("Error fetching rejected user data:");
    }
  };

  useEffect(() => {
    getUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <AuthLayout>
        <div className="sb-rejected-form-container">
          <div className="identify-proof-mainDiv mt-40">
            <Row>
              <Col sm={20} md={16} lg={20}>
                <p className="sb-verification-title mt-5 mb-10">
                  Thank you for your interest in Kilde
                </p>
                <p
                  className="kl-subtitle mt-0"
                  style={{ textAlign: "left", color: "#1A202CCC" }}
                >
                  Unfortunately, at this time, we are unable to complete your
                  registration and onboard you as an investor. Kilde is a
                  regulated financial entity in Singapore, and in line with our
                  current regulatory license, we can only onboard investors who
                  qualify as "Accredited" or "Institutional" as defined by the
                  Monetary Authority of Singapore.
                </p>
              </Col>
            </Row>

            <Row>
              <Col>
                <p
                  className="sb-verification-title mt-50"
                  style={{ fontSize: "18px" }}
                >
                  Accredited investor “AI” means:
                </p>

                <div className="rejected-user-div">
                  <p className="rejected-user-head">An individual:</p>
                  <ul className="sb-text-align-start liveness-ul">
                    <li>
                      <p className="color-light-black">
                        whose net personal assets exceed in value SGD 2,000,000
                        (or its equivalent in a foreign currency) or such other
                        amount as the Authority may prescribe in place of the
                        first amount, and in determining whether an individual's
                        net personal assets exceeds the minimal amount, the
                        estimated fair market value of an individual's primary
                        residence less any outstanding amounts in respect of any
                        credit facility granted to the individual or any other
                        person that is secured by that residence, shall not
                        account for more than SGD 1,000,000 (or its equivalent
                        in a foreign currency) of the minimum amount; or
                      </p>
                    </li>
                    <li>
                      <p className="color-light-black">
                        whose income in the preceding 12 months is not less than
                        SGD 300,000 (or its equivalent in a foreign currency) or
                        such other amount as the Authority may prescribe in
                        place of the first amount;
                      </p>
                    </li>
                  </ul>
                </div>
              </Col>
            </Row>

            <Row className="mt-15">
              <Col>
                <div className="rejected-user-div">
                  <p className="rejected-user-head">
                    A corporation with net assets exceeding SGD 10 million in
                    value (or its equivalent in a foreign currency) or such
                    other amount as the Authority may prescribe, in place of the
                    first amount, as determined by:
                  </p>
                  <ul className="sb-text-align-start liveness-ul">
                    <li>
                      <p className="color-light-black">
                        the most recent audited balance-sheet of the
                        corporation; or
                      </p>
                    </li>
                    <li>
                      <p className="color-light-black">
                        where the corporation is not required to prepare audited
                        accounts regularly, a balance-sheet of the corporation
                        certified by the corporation as giving a true and fair
                        view of the state of affairs of the corporation as of
                        the date of the balance-sheet, which date shall be
                        within the preceding 12 months
                      </p>
                    </li>
                  </ul>
                </div>
              </Col>
            </Row>

            <Row className="mt-50">
              <Col md={12}>
                <p
                  className="kl-subtitle mt-0"
                  style={{ textAlign: "left", color: "#1A202CCC" }}
                >
                  If you still have questions, or would like to obtain further
                  clarifications, feel free to contact us over email at{" "}
                  <span className="kl-link">
                    <a href="mailto:sales@kilde.sg">sales@kilde.sg</a>
                  </span>{" "}
                  or{" "}
                  <span className="kl-link">
                    <a href="tel:+65 695 077 68">book a call.</a>
                  </span>
                </p>
                <p
                  className="kl-subtitle mt-30 mb-0"
                  style={{ textAlign: "left", color: "#1A202CCC" }}
                >
                  your,
                </p>
                <p
                  className="kl-subtitle mt-0"
                  style={{ textAlign: "left", color: "#1A202CCC" }}
                >
                  kilde
                </p>
              </Col>
            </Row>
          </div>
        </div>
        {/* <SupportChatButton /> */}
        <JivoChat user={user} />
      </AuthLayout>
    </>
  );
};

export default RejectedUser;
