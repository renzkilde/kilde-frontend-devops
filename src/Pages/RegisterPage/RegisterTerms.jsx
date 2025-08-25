import { Modal } from "antd";
import React, { useState } from "react";
import PrivacyPdf from "../../Assets/Pdf/Privacy-policy.pdf";
import TermsOfUse from "../../Assets/Pdf/Terms of Use.pdf";

const RegisterTerms = () => {
  const [termsPdf, setTermsPdf] = useState(false);
  // const [privacyPdf, setPrivacyPdf] = useState(false);

  return (
    <>
      <div className="register-page-checkbox">
        By continuing you agree to Kilde’s{" "}
        {/* <span
          className="cursor-pointer termsofuse"
          style={{ color: "var(--kilde-blue)" }}
          onClick={() => setPrivacyPdf(true)}
        >
          Terms of Use
        </span>{" "} */}
        <a
          className="cursor-pointer termsofuse"
          style={{ color: "var(--kilde-blue)" }}
          href={TermsOfUse}
          target="_blank"
          rel="noreferrer"
        >
          Terms of Use
        </a>{" "}
        and{" "}
        {/* <span
          className="cursor-pointer termsofuse"
          style={{ color: "var(--kilde-blue)" }}
          onClick={() => setTermsPdf(true)}
        >
          {" "}
          Privacy Policy
        </span> */}
        <a
          className="cursor-pointer termsofuse"
          style={{ color: "var(--kilde-blue)" }}
          href={PrivacyPdf}
          target="_blank"
          rel="noreferrer"
        >
          Privacy Policy
        </a>{" "}
      </div>
      {/* <Modal
        className="sb-pdf-modal"
        centered
        open={termsPdf}
        onCancel={() => setTermsPdf(false)}
        width={1000}
        footer={null}
      >
        <iframe
          className="mt-20"
          src={`${PrivacyPdf}#toolbar=0`}
          width="100%"
          height="500px"
          title="PDF Viewer"
        />
      </Modal> */}

      {/* <Modal
        className="sb-pdf-modal"
        centered
        open={privacyPdf}
        onCancel={() => setPrivacyPdf(false)}
        width={1000}
        footer={null}
      >
        <iframe
          className="mt-20 pdf-iframe"
          src={`${TermsOfUse}#toolbar=0`}
          width="100%"
          height="500px"
          title="PDF Viewer"
        />
      </Modal> */}
    </>
  );
};

export default RegisterTerms;
