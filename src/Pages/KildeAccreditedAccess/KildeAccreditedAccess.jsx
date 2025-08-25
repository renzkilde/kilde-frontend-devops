import React from "react";

import "./style.css";
import { Divider } from "antd";
import AuthLayout from "../../Layouts/BlankHeaderLayout/AuthLayout";
import Footer from "../../Layouts/BlankHeaderLayout/Footer";

const KildeAccreditedAccess = () => {
  return (
    <AuthLayout>
      <div>
        <div className="kl-ty-maindiv">
          <p>Thank you for your interest in Kilde.</p>
          <p>
            Unfortunately, at this time, we are unable to complete your
            registration and onboard you as an investor. Kilde is a regulated
            financial entity in Singapore, and in line with our current
            regulatory license, we can only onboard investors who qualify as
            "Accredited" or "Institutional" as defined by the Monetary Authority
            of Singapore.
          </p>
          <div>
            <p>Accredited investor “AI” means:</p>

            <ol type="i">
              <li>
                An individual
                <ol style={{ listStyleType: "capital-alpha" }}>
                  <li>
                    Whose net personal assets exceed in value SGD 2,000,000 (or
                    its equivalent in a foreign currency) or such other amount
                    as the Authority may prescribe in place of the first amount,
                    and in determining whether an individual's net personal
                    assets exceeds the minimal amount, the estimated fair market
                    value of an individual's primary residence less any
                    outstanding amounts in respect of any credit facility
                    granted to the individual or any other person that is
                    secured by that residence, shall not account for more than
                    SGD 1,000,000 (or its equivalent in a foreign currency) of
                    the minimum amount; or
                  </li>
                  <li>
                    Whose income in the preceding 12 months is not less than SGD
                    300,000 (or its equivalent in a foreign currency) or such
                    other amount as the Authority may prescribe in place of the
                    first amount;
                  </li>
                </ol>
              </li>
              <li>
                A corporation with net assets exceeding SGD 10 million in value
                (or its equivalent in a foreign currency) or such other amount
                as the Authority may prescribe, in place of the first amount, as
                determined by:
                <ol style={{ listStyleType: "captal-alpha" }}>
                  <li>
                    The most recent audited balance-sheet of the corporation; or
                  </li>
                  <li>
                    Where the corporation is not required to prepare audited
                    accounts regularly, a balance-sheet of the corporation
                    certified by the corporation as giving a true and fair view
                    of the state of affairs of the corporation as of the date of
                    the balance-sheet, which date shall be within the preceding
                    12 months.
                  </li>
                </ol>
              </li>
            </ol>

            <Divider />
            <p>
              If you still have questions, or would like to obtain further
              clarifications, feel free to contact us over email at{" "}
              <a href="mailto:sales@kilde.sg" className="kl-link">
                sales@kilde.sg
              </a>{" "}
              or{" "}
              <a href="https://example.com/book-a-call" className="kl-link">
                book a call
              </a>
              .
            </p>
            <p>
              Yours,
              <br />
              <strong>Kilde</strong>
            </p>
          </div>
        </div>
        <Footer />
      </div>
    </AuthLayout>
  );
};

export default KildeAccreditedAccess;
