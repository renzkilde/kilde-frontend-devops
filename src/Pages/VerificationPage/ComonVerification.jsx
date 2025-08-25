import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Checkbox, Modal } from "antd";
import Individual from "../../Assets/Images/individual.svg";
import Institutional from "../../Assets/Images/Institutional.svg";
import { QUESTIONNAIRE } from "../../Utils/Constant";
import { setInvestorIdentificationDetails } from "../../Redux/Action/KycIndividual";
import Alert from "../../Assets/Images/alert.svg";
// import WarningCircle from "../../Assets/Images/WarningCircle.svg";
// import ButtonDefault from "../../Components/ButtonDefault/ButtonDefault";
import { checkStepStatus } from "../../Utils/Helpers";
import CustomRadioButton from "../../Components/DefaultRadio/CustomRadioButton";

const ComonVerification = ({
  value,
  setValue,
  selectedOption,
  setSelectedOption,
  questionnaire,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [modal2Open, setModal2Open] = useState(false);
  const [lastCheckboxChecked, setLastCheckboxChecked] = useState(false);

  let initialTasks = [];
  initialTasks = [
    {
      id: QUESTIONNAIRE.kycQuestionAnnualIncome,
      value: "kycQuestionAnnualIncome",
      label: `In the last 12 months my earnings were at least ${
        localStorage.getItem("currency")
          ? localStorage.getItem("currency") + " 870,000"
          : "SGD 300,000"
      }`,
      completed: false,
    },
    {
      id: QUESTIONNAIRE.kycQuestionPersonalAssets,
      value: "kycQuestionPersonalAssets",
      label: `My 'Net Personal Assets' are at least ${
        localStorage.getItem("currency")
          ? localStorage.getItem("currency") + " 5,780,000"
          : "SGD 2 million"
      } (including my personal residence up to a cap of ${
        localStorage.getItem("currency")
          ? localStorage.getItem("currency") + " 2,890,000"
          : "SGD 1 million"
      })`,
      completed: false,
    },
    {
      id: QUESTIONNAIRE.kycQuestionFinancialAssets,
      value: "kycQuestionFinancialAssets",
      label: `My 'Net Financial Assets' are at least ${
        localStorage.getItem("currency")
          ? localStorage.getItem("currency") + " 2,890,000"
          : "SGD 1 million"
      } (in cash, deposits, investment products, or other acceptable financial instruments)`,
      completed: false,
    },
  ];

  useEffect(() => {
    const initialTasks =
      (selectedOption === "individual" || selectedOption === "INDIVIDUAL") &&
      value === "ACCREDITED"
        ? [
            {
              id: QUESTIONNAIRE.kycQuestionAnnualIncome,
              value: "kycQuestionAnnualIncome",
              label: `In the last 12 months my earnings were at least ${
                localStorage.getItem("currency")
                  ? localStorage.getItem("currency") + " 870,000"
                  : "SGD 300,000"
              }`,
              completed: false,
            },
            {
              id: QUESTIONNAIRE.kycQuestionPersonalAssets,
              value: "kycQuestionPersonalAssets",
              label: `My 'Net Personal Assets' are at least ${
                localStorage.getItem("currency")
                  ? localStorage.getItem("currency") + " 5,780,000"
                  : "SGD 2 million"
              } (including my personal residence up to a cap of ${
                localStorage.getItem("currency")
                  ? localStorage.getItem("currency") + " 2,890,000"
                  : "SGD 1 million"
              })`,
              completed: false,
            },
            {
              id: QUESTIONNAIRE.kycQuestionFinancialAssets,
              value: "kycQuestionFinancialAssets",
              label: `My 'Net Financial Assets' are at least ${
                localStorage.getItem("currency")
                  ? localStorage.getItem("currency") + " 2,890,000"
                  : "SGD 1 million"
              } (in cash, deposits, investment products, or other acceptable financial instruments)`,
              completed: false,
            },
          ]
        : value === "EXPERT"
        ? [
            {
              id: QUESTIONNAIRE.companyDirectlyCoversHoldingCMP,
              value: "companyDirectlyCoversHoldingCMP",
              label:
                "My business or the business I work for involves the acquisition and disposal of, or the holding of, capital markets products",
              completed: false,
            },
            {
              id: QUESTIONNAIRE.companyInvolvesDisposalHoldingCMP,
              value: "companyInvolvesDisposalHoldingCMP",
              label:
                "My responsibility within my business or the business I work for directly covers the acquisition and disposal of, or the holding of, capital markets products",
              completed: false,
            },
          ]
        : value === "INSTITUTIONAL"
        ? [
            {
              id: QUESTIONNAIRE.kybQuestionCapitalMarketsServiceLicense,
              value: "kybQuestionCapitalMarketsServiceLicense",
              label:
                "I represent a corporation that holds a Capital Markets Service License",
              completed: false,
            },
            {
              id: QUESTIONNAIRE.kybQuestionLicensedUnderTheFinanceCompaniesAct,
              value: "kybQuestionLicensedUnderTheFinanceCompaniesAct",
              label:
                "I represent a finance company licensed under the Finance Companies Act",
              completed: false,
            },
            {
              id: QUESTIONNAIRE.kybQuestionSecuritiesandFuturesAct,
              value: "kybQuestionSecuritiesandFuturesAct",
              label:
                "I represent an institutional investor, as defined in Securities and Futures Act",
              completed: false,
            },
          ]
        : (selectedOption === "company" || selectedOption === "COMPANY") &&
          value === "ACCREDITED" && [
            {
              id: QUESTIONNAIRE.kybQuestionNetAssets,
              value: "kybQuestionNetAssets",
              label: `I represent a corporation with net assets exceeding ${
                localStorage.getItem("currency")
                  ? localStorage.getItem("currency") + " 28,900,000"
                  : "SGD 10 million"
              }, (or equivalent)`,
              completed: false,
            },
            {
              id: QUESTIONNAIRE.kybQuestionEntireShareCapitalIsOwnedByOneOrMorePersons,
              value: "kybQuestionEntireShareCapitalIsOwnedByOneOrMorePersons",
              label:
                "I represent a corporation where the entire share capital is owned by one or more persons, all of whom are Accredited Investors",
              completed: false,
            },
          ];
    setTasks(initialTasks);
    const getData = questionnaire?.questionnaire?.selectedOptions;
    let getDetails;

    if (
      questionnaire?.questionnaire !== undefined &&
      questionnaire?.questionnaire !== null
    ) {
      getDetails = Object.values(getData);
    }

    if (getDetails) {
      const updatedTasks = initialTasks?.map((task) => {
        const matchingTask = getDetails.find(
          (userTask) => userTask === task.id
        );

        return {
          ...task,
          completed: matchingTask ? true : false,
        };
      });
      setTasks(updatedTasks);
    }
  }, [
    questionnaire?.questionnaire,
    user?.waitingVerificationSteps,
    value,
    selectedOption,
  ]);

  const [tasks, setTasks] = useState(initialTasks);

  const handleCheckboxChange = async (taskId) => {
    if (taskId) {
      setLastCheckboxChecked(false);
    }
    const updatedTasks = tasks?.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    setLastCheckboxChecked(false);

    setInvestorIdentificationDetails({ data: updatedTasks }, dispatch);
  };

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    setLastCheckboxChecked(false);
  };

  const onChange = (e) => {
    setValue(e.target.value);
    setLastCheckboxChecked(false);
  };

  const handleLastCheckboxChange = (isChecked, investorType) => {
    setLastCheckboxChecked(true);

    if (isChecked) {
      setTasks(tasks?.map((task) => ({ ...task, completed: false })));

      const investorTypeMap = {
        ACCREDITED: {
          id: "NOT_ACCREDITED_INVESTOR",
          value: "notAccreditedInvestor",
          label: "I am not an Accredited Investor",
        },
        EXPERT: {
          id: "NOT_EXPERT_INVESTOR",
          value: "notExpertInvestor",
          label: "I am not an Expert Investor",
        },
        INSTITUTIONAL_INVESTOR: {
          id: "NOT_INSTITUTIONAL_INVESTOR",
          value: "notInstitutionalInvestor",
          label: "I do not represent an Institutional Investor",
        },
      };

      const selectedType =
        investorTypeMap[investorType] ||
        investorTypeMap["INSTITUTIONAL_INVESTOR"];

      const data = [
        {
          ...selectedType,
          completed: true,
        },
      ];

      setInvestorIdentificationDetails({ data }, dispatch);
    }
  };

  return (
    <div>
      <div
        className={
          user?.verificationState === "" || user?.verificationState === null
            ? null
            : "p-none"
        }
      >
        <div className="sb-verification-content-page">
          <div gutter={16} className="sb-usertype sb-main-usertype">
            <div
              className="gutter-row w-100"
              span={4}
              xs={12}
              sm={12}
              md={12}
              lg={10}
            >
              <div
                className={`p-relative bydefault-select ${
                  selectedOption === "individual" ||
                  selectedOption === "INDIVIDUAL"
                    ? "sb-individual-kilde-active"
                    : "sb-individual"
                }`}
                onClick={() => handleOptionChange("individual")}
              >
                <img
                  src={Individual}
                  alt="Individual"
                  className="wpx-100 hpx-100"
                  style={{ width: 35 }}
                />
                <p className="mt-8 mb-0">Individual</p>
                {selectedOption === "individual" ||
                selectedOption === "INDIVIDUAL" ? null : (
                  <div className="without-checked-div" />
                )}
                <input
                  type="radio"
                  name="radio-group"
                  checked={
                    selectedOption === "individual" ||
                    selectedOption === "INDIVIDUAL"
                  }
                  onChange={() => handleOptionChange("individual")}
                />
              </div>
            </div>
            <div
              className="gutter-row w-100"
              span={4}
              xs={12}
              sm={12}
              md={12}
              lg={10}
            >
              <div
                className={`p-relative bydefault-select ${
                  selectedOption === "company" || selectedOption === "COMPANY"
                    ? "sb-individual-kilde-active"
                    : "sb-corporate"
                }`}
                onClick={() => handleOptionChange("company")}
              >
                <img
                  src={Institutional}
                  alt="Institutional"
                  className="wpx-100 hpx-100"
                  style={{ width: 45 }}
                />
                <p className="mt-8 mb-0">Corporate</p>
                {selectedOption === "company" ||
                selectedOption === "COMPANY" ? null : (
                  <div className="without-checked-div" />
                )}
                <input
                  type="radio"
                  name="radio-group"
                  checked={
                    selectedOption === "company" || selectedOption === "COMPANY"
                  }
                  onChange={() => handleOptionChange("company")}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={
          user?.verificationState === "" || user?.verificationState === null
            ? "verification-div"
            : "verification-div p-none"
        }
      >
        <div>
          <p className="m-0 verification-header">Select type:</p>
        </div>

        {selectedOption === "individual" || selectedOption === "INDIVIDUAL" ? (
          <div className="mt-16 w-100 gap-16 verification-radio sb-sub-usertype">
            <CustomRadioButton
              className="sub-inv-type"
              label="Accredited Investor"
              name="option"
              value="ACCREDITED"
              checked={value === "ACCREDITED"}
              onChange={onChange}
            />
            <CustomRadioButton
              className="sub-inv-type"
              label="Expert Investor"
              name="option"
              value="EXPERT"
              checked={value === "EXPERT"}
              onChange={onChange}
            />
          </div>
        ) : (
          <div className="mt-16 w-100 gap-16 verification-radio sb-sub-usertype">
            <CustomRadioButton
              className="sub-inv-type"
              label="Accredited Investor"
              name="option"
              value="ACCREDITED"
              checked={value === "ACCREDITED"}
              onChange={onChange}
            />
            <CustomRadioButton
              className="sub-inv-type"
              label="Institutional investor"
              name="option"
              value="INSTITUTIONAL"
              checked={value === "INSTITUTIONAL"}
              onChange={onChange}
            />
          </div>
        )}

        <div
          className={
            checkStepStatus(user?.waitingVerificationSteps, "QUESTIONNAIRE") ===
              false && user?.waitingVerificationSteps?.length > 0
              ? "p-none sb-checked-div mt-40"
              : "sb-checked-div mt-40"
          }
        >
          <p className="verification-header mt-0 mb-16">
            I declare that I meet one or more of the criteria below (please tick
            those that apply):
          </p>

          {tasks?.map((task) => (
            <Checkbox
              style={{ marginBottom: 12 }}
              id={task.id}
              checked={task.completed}
              onChange={() => handleCheckboxChange(task.id)}
              key={`beneficialOwner${task.id}`}
              className="checkbox-kilde verification-checkbox"
            >
              {task.label}
            </Checkbox>
          ))}
          {/* <Checkbox
            checked={lastCheckboxChecked}
            onChange={(e) => handleLastCheckboxChange(e.target.checked, value)}
            key="last"
            className="checkbox-kilde verification-checkbox"
            id="chk-not-investor"
          >
            {value === "ACCREDITED"
              ? "I am not an Accredited Investor"
              : value === "EXPERT"
              ? "I am not an Expert Investor"
              : value === "INSTITUTIONAL_INVESTOR"
              ? "I do not represent an Institutional Investor"
              : "I do not represent an Institutional Investor"}
          </Checkbox> */}
          <Checkbox
            checked={lastCheckboxChecked}
            onChange={(e) => handleLastCheckboxChange(e.target.checked, value)}
            key="last"
            className="checkbox-kilde verification-checkbox"
            id="chk-not-investor"
          >
            {value === "ACCREDITED"
              ? "I am not an Accredited Investor"
              : value === "EXPERT"
              ? "I am not an Expert Investor"
              : "I do not represent an Institutional Investor"}
          </Checkbox>
        </div>
      </div>
      <Modal
        width={400}
        style={{ padding: 0 }}
        centered
        open={modal2Open}
        okButtonProps={{ style: { display: "none" } }}
        onCancel={() => setModal2Open(false)}
        cancelButtonProps={{ style: { display: "none" } }}
        className="kilde-modal-button warning-modal"
      >
        <div className="not-investormodal" style={{ paddingTop: 10 }}>
          <img src={Alert} alt="alert_img" />
          <div className="child-notinvestor" style={{ padding: 0 }}>
            <p className="sb-verification-title mt-5 mb-10">
              Thank you for your interest.
            </p>
            <p className="kl-subtitle mt-0">
              Kilde is currently for accredited, expert, and institutional
              investors.
            </p>
            <p className="kl-subtitle mt-0">
              Please change your investor status or contact{" "}
              <a
                href="mailto:sales@kilde.sg"
                style={{ color: "var(--kilde-blue)" }}
              >
                sales@kilde.sg
              </a>{" "}
              for more information.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ComonVerification;
