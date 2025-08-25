/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Modal, Spin } from "antd";
import { useSelector } from "react-redux";
import ComonVerification from "../../VerificationPage/ComonVerification";
import pdfURL from "../../../Assets/Pdf/Institutional_Investor.pdf";
import Corporate_Institutional_Investor from "../../../Assets/Pdf/Corporate_institutional_investor.pdf";
import Corporate_Accredited_Investor from "../../../Assets/Pdf/Corporate_Accredited_Investor.pdf";
import AED_Corporate_Accredited_Investor from "../../../Assets/Pdf/AED_corporate_investor.pdf";
import Accredited_Investor from "../../../Assets/Pdf/Accredited_Investor.pdf";
import AED_accredited_Investor from "../../../Assets/Pdf/AED_accrediated_investor.pdf";
import Expert_Investor from "../../../Assets/Pdf/Expert_Investor.pdf";
import "./style.css";
import { getInvestorQuestionnaire } from "../../../Apis/InvestorApi";
import { checkStepStatus } from "../../../Utils/Helpers";
import { LoadingOutlined } from "@ant-design/icons";

const InvestorVerification = () => {
  const user = useSelector((state) => state.user);
  const [questionnaire, setQuestionnaire] = useState();

  const [value, setValue] = useState(
    questionnaire?.investorSubType || "ACCREDITED"
  );
  const [pdfModalVisible, setPdfModalVisible] = useState(false);
  const personalInfo = useSelector(
    (state) => state?.kycIndividual?.investorIdentification?.data
  );
  const [selectedOption, setSelectedOption] = useState("individual");
  const [getQuestLoader, setGetQuestLoader] = useState(false);

  let finalData = [];
  personalInfo?.map((Pinfo) => {
    if (Pinfo?.completed === true) {
      finalData.push(Pinfo);
    }
    return null;
  });

  useEffect(() => {
    setValue(questionnaire?.investorSubType || "ACCREDITED");
  }, [questionnaire?.investorSubType]);

  const getQuestionarries = async () => {
    setGetQuestLoader(true);
    const response = await getInvestorQuestionnaire();
    if (response) {
      setSelectedOption(response?.investorType);
      setQuestionnaire(response);
      setGetQuestLoader(false);
    } else {
      setGetQuestLoader(false);
      console.error("Error fetching questionarries data");
    }
  };

  useEffect(() => {
    if (
      checkStepStatus(user?.waitingVerificationSteps, "QUESTIONNAIRE") === false
    ) {
      getQuestionarries();
    }
  }, []);

  const openPdfModal = () => {
    setPdfModalVisible(true);
  };

  const closePdfModal = () => {
    setPdfModalVisible(false);
  };

  const getHref = (selectedOption, value) => {
    if (
      (selectedOption === "COMPANY" || selectedOption === "company") &&
      value === "ACCREDITED"
    ) {
      return localStorage.getItem("currency")
        ? AED_Corporate_Accredited_Investor
        : Corporate_Accredited_Investor;
    } else if (
      (selectedOption === "COMPANY" || selectedOption === "company") &&
      value === "INSTITUTIONAL"
    ) {
      return Corporate_Institutional_Investor;
    } else if (
      (selectedOption === "INDIVIDUAL" || selectedOption === "individual") &&
      value === "ACCREDITED"
    ) {
      return localStorage.getItem("currency")
        ? AED_accredited_Investor
        : Accredited_Investor;
    } else if (
      (selectedOption === "INDIVIDUAL" || selectedOption === "individual") &&
      value === "EXPERT"
    ) {
      return Expert_Investor;
    }
    return null;
  };

  return (
    <div className="sb-verify-subtitle">
      <Spin
        indicator={
          <LoadingOutlined
            style={{ fontSize: 50, color: "var(--kilde-blue)" }}
          />
        }
        spinning={getQuestLoader}
      >
        <p className="sb-verification-title">Select Investor Type</p>
        <p className="m-0 head-userId">
          Hi{" "}
          <b className="p-capitalize">
            {" "}
            {user?.firstName + " " + user?.lastName}
          </b>
          . Please select the option(s) that apply to you.
        </p>
        <p style={{ fontSize: 15 }} className="head-userId mt-5">
          <a
            className="verification-here-link m-0"
            target="_blank"
            href={
              selectedOption === "INDIVIDUAL" || selectedOption === "individual"
                ? pdfURL
                : Corporate_Accredited_Investor
            }
            rel="noreferrer"
            onClick={(e) => {
              e.preventDefault();
              openPdfModal();
            }}
          >
            Learn more
          </a>{" "}
          about how to verify your {value.toLowerCase()} investor status.
        </p>
        <ComonVerification
          questionnaire={questionnaire}
          value={value}
          setValue={setValue}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
        />

        <Modal
          className="sb-pdf-modal"
          centered
          open={pdfModalVisible}
          onCancel={closePdfModal}
          width={1000}
          footer={null}
        >
          <iframe
            className="mt-20"
            src={`${getHref(selectedOption, value)}#toolbar=0`}
            width="100%"
            height="500px"
            title="PDF Viewer"
          />
        </Modal>
      </Spin>
    </div>
  );
};

export default InvestorVerification;
