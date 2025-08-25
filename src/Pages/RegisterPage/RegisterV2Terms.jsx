import { Modal } from "antd";
import React, { useState } from "react";
import PrivacyPdf from "../../Assets/Pdf/Privacy-policy.pdf";
import TermsOfUse from "../../Assets/Pdf/Terms of Use.pdf";

const RegisterV2Terms = () => {
  const [termsPdf, setTermsPdf] = useState(false);
  const [privacyPdf, setPrivacyPdf] = useState(false);

  return (
    <>
      <div className="register-v2-page-checkbox">
        By continuing you agree to{" "}
        {/* <span
          className="cursor-pointer termsofuse"
          style={{ textDecoration: "underline" }}
          onClick={() => setPrivacyPdf(true)}
        >
          Kilde’s Terms of Use
        </span>{" "} */}
        <a
          className="cursor-pointer termsofuse"
          style={{ textDecoration: "underline" }}
          href={TermsOfUse}
          target="_blank"
          rel="noreferrer"
        >
          Kilde’s Terms of Use
        </a>{" "}
        and{" "}
        {/* <span
          className="cursor-pointer termsofuse"
          style={{ textDecoration: "underline" }}
          onClick={() => setTermsPdf(true)}
        >
          {" "}
          Privacy Policy
        </span> */}
        <a
          className="cursor-pointer termsofuse"
          style={{ textDecoration: "underline" }}
          href={PrivacyPdf}
          target="_blank"
          rel="noreferrer"
        >
          Privacy Policy
        </a>{" "}
      </div>
      <Modal
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
      </Modal>

      <Modal
        className="sb-pdf-modal"
        centered
        open={privacyPdf}
        onCancel={() => setPrivacyPdf(false)}
        width={1000}
        footer={null}
      >
        <iframe
          className="mt-20"
          src={TermsOfUse}
          width="100%"
          height="500px"
          title="PDF Viewer"
        />
      </Modal>
    </>
  );
};

export default RegisterV2Terms;
