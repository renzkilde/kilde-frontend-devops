import React from "react";
import { Modal, Select, Spin, Upload } from "antd";
import { CloudUploadOutlined, LoadingOutlined } from "@ant-design/icons";
import {
  getInvestorQuestionnaire,
  getRerefenceProofOfAccrediationApi,
} from "../../../Apis/InvestorApi";
import { setEntityDocumentDetails } from "../../../Redux/Action/KycOrganization";
import ArrowUpAndDownIcon from "../../../Assets/Images/SVGs/ArrowLineUpDown.svg";
import { useState } from "react";
import { useEffect } from "react";
import { INVESTOR_TYPE } from "../../../Utils/Constant";
import { checkStepStatus, getBase64 } from "../../../Utils/Helpers";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../../Apis/UserApi";
import { setUserDetails } from "../../../Redux/Action/User";
import {
  addUnderscoreBeforeText,
  formatSection,
  showMessageWithCloseIconError,
} from "../../../Utils/Reusables";
import GlobalVariabels from "../../../Utils/GlobalVariabels";
import uploadicon from "../../../Assets/Images/uploadicon.svg";
import downarrow from "../../../Assets/Images/CaretDown.svg";
import rightarrow from "../../../Assets/Images/CaretRight.svg";

import "./style.css";

const EntityDocuments = () => {
  const { Option } = Select;
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [getPoiLoader, setPoiLoader] = useState(false);
  const [questionnaire, setQuestionnaire] = useState();
  const [selectedDocumentTypes, setSelectedDocumentTypes] = useState([]);
  const [documentObject, setDocumentObject] = useState({});
  const [allReferences, setAllrefernces] = useState([]);
  const [documentNames, setDocumentNames] = useState([]);
  const [fileListofBackend, setFileListBackend] = useState([]);
  const [expandedSection, setExpandedSection] = useState(true);
  const [expandedSection1, setExpandedSection1] = useState(false);
  const [expandedSection2, setExpandedSection2] = useState(false);
  const [expandedSection3, setExpandedSection3] = useState(true);

  const [expandedSection4, setExpandedSection4] = useState(false);

  const [fileExtention, setFileExtention] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const allowedFileTypes = [
    "image/png",
    "image/jpeg",
    "image/bmp",
    "application/pdf",
    "application/zip",
    "application/x-zip-compressed",
  ];

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  let data = [];
  if (questionnaire?.investorSubType === INVESTOR_TYPE.ACCREDITED_INVESTOR) {
    data = [
      { key: "PaySlips", value: "Pay slips/Tax declaration" },
      { key: "BankStatements", value: "Bank statements" },
      { key: "InvestmentStatements", value: "Investment statements" },
      {
        key: "InvestmentLifePolicyStatement",
        value: "Investment life policy statement",
      },
      { key: "FinancialStatement", value: "Financial statement" },
      {
        key: "ExcerptRegistry",
        value: "Excerpt from land/property registry",
      },
      {
        key: "LetterOfEmployment",
        value: "Letter of employment",
      },
      {
        key: "CapitalMarketProductLicense",
        value: "Capital market products license",
      },
    ];
  } else {
    data = [
      { key: "letterEmployement", value: "letter of employement" },
      {
        key: "capitalMarketProductLicense",
        value: "capital market products license",
      },
    ];
  }

  useEffect(() => {
    getUserDetails();
    fetchReferencesIfNeeded();
  }, []);

  const getUserDetails = async () => {
    const response = await getUser();
    if (response) {
      setUserDetails(response, dispatch);
    }
  };

  useEffect(() => {
    getQuestionarries();
  }, []);
  const getQuestionarries = async () => {
    const response = await getInvestorQuestionnaire();
    if (response) {
      setQuestionnaire(response);
    }
  };

  useEffect(() => {
    setEntityDocumentDetails(documentObject, dispatch);
  }, [dispatch, documentObject]);

  useEffect(() => {
    if (!questionnaire) return;
    const defaultDocTypes =
      questionnaire?.investorSubType === INVESTOR_TYPE.ACCREDITED_INVESTOR
        ? ["PaySlips"]
        : ["letterEmployement"];
    setSelectedDocumentTypes(defaultDocTypes);
    const newObj = {};
    defaultDocTypes.forEach((docType) => {
      newObj[docType] = [];
    });
    setDocumentObject(newObj);
  }, [questionnaire]);

  useEffect(() => {
    if (allReferences.length > 0) {
      const newDocumentNames = [];
      allReferences.forEach((item) => {
        const docName = addUnderscoreBeforeText(item.fileName);
        newDocumentNames.push(docName);
      });
      setDocumentNames(newDocumentNames);
    }
  }, [allReferences]);

  useEffect(() => {
    const fetchImageLinks = async () => {
      const promises = allReferences?.map(async (img) => {
        if (img) {
          const response = `${GlobalVariabels.VIEW_IMG}/${img?.fileReference}`;
          return { url: response, fileName: img?.fileName };
        }
        return null;
      });

      const resolvedImageLinks = await Promise.all(promises);
      const filteredImageLinks = resolvedImageLinks.filter(
        (data) => data !== null
      );

      setFileListBackend((prevFileList) => {
        const newFileList = [...prevFileList];

        filteredImageLinks?.forEach((data, index) => {
          const { url, fileName } = data;
          const mainType = fileName?.split("_")[0];

          newFileList?.push({
            uid: `image-${index}`,
            name: `Image ${index + 1}`,
            status: "done",
            url: url,
            thumbUrl: url,
            fileName: fileName,
            mainType: mainType,
          });
        });

        return newFileList;
      });
    };

    if (allReferences?.length > 0) {
      fetchImageLinks();
    }
  }, [allReferences]);

  const handleChange = (value) => {
    setSelectedDocumentTypes(value);
    const newObj = { ...documentObject };
    Object.keys(newObj).forEach((key) => {
      if (!value.includes(key)) {
        delete newObj[key];
      }
    });
    value.forEach((docType) => {
      if (!newObj[docType]) {
        newObj[docType] = [];
      }
    });
    setDocumentObject(newObj);
  };

  const handlePreview = async (file) => {
    const slashIndex = file.type.lastIndexOf("/");

    if (slashIndex !== -1) {
      const textBeforeSlash = file.type.substring(0, slashIndex);
      setFileExtention(textBeforeSlash);
    }
    if (!file.url && !file.preview) {
      if (file.type === "application/pdf") {
        file.preview = await getBase64(file.originFileObj);
      } else {
        file.preview = await getBase64(file.originFileObj);
      }
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleChangeFile = async (documentType, { fileList }) => {
    let validFiles = fileList.filter(
      (file) =>
        file.originFileObj && allowedFileTypes.includes(file.originFileObj.type)
    );

    let newDocArray = [...validFiles];

    await Promise.all(
      newDocArray.map(async (file, index) => {
        if (!file.url && file.originFileObj) {
          newDocArray[index] = {
            ...file,
            loading: true,
          };

          const base64 = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file.originFileObj);
          });

          newDocArray[index] = {
            file: file.originFileObj,
            loading: false,
            base64Url: base64,
          };
        }
      })
    );

    setDocumentObject((prev) => ({
      ...prev,
      [documentType]: newDocArray,
    }));
  };

  const handleCustomRequest = ({ file, onSuccess, onError }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 1000);
  };

  const uploadButton = (
    <div>
      <img src={uploadicon} alt="uploadicon" />
      <div
        style={{
          fontSize: "14px",
          padding: "3px",
        }}
      >
        Upload
      </div>
    </div>
  );

  function renameFile(file, documentType) {
    const fileNameParts = file.name.split(".");
    const fileExtension = fileNameParts.pop();
    const newFileName = `${documentType}_${fileNameParts.join(
      "."
    )}.${fileExtension}`;
    return new File([file], newFileName, { type: file.type });
  }

  const beforeUpload = (file, documentType) => {
    const maxFileSize = 1536000;
    const isAllowedType = allowedFileTypes.includes(file.type);
    const fileSize = file.size > maxFileSize;
    if (isAllowedType && !fileSize) {
      return renameFile(file, documentType);
    }

    if (!isAllowedType) {
      showMessageWithCloseIconError(
        "You can only upload PNG, JPG, JPEG, BMP, PDF, or ZIP file!"
      );
    }

    if (fileSize) {
      showMessageWithCloseIconError("File size must be under 1.5MB");
    }
    return (isAllowedType && !fileSize) || Upload.LIST_IGNORE;
  };

  const fetchReferencesIfNeeded = () => {
    if (
      checkStepStatus(
        user?.waitingVerificationSteps,
        "PROOF_OF_ACCREDITATION"
      ) === false
    ) {
      setPoiLoader(true);
      getRerefenceProofOfAccrediationApi()
        .then((refrencesResponse) => {
          setAllrefernces(refrencesResponse);
          setPoiLoader(false);
        })
        .catch(() => {
          setPoiLoader(false);
        });
    }
  };

  const handlePreviewBackend = async (file) => {
    const match = file.url.match(/\.([^.]+)$/);
    let fileType = "";
    if (match) fileType = match[1]?.toLowerCase();
    if (
      fileType === "jpg" ||
      fileType === "jpeg" ||
      fileType === "bmp" ||
      fileType === "png" ||
      fileType === "svg"
    ) {
      setPreviewOpen(true);
      setPreviewImage(file.url || file.thumbUrl);
      setFileExtention("image");
    } else {
      setFileExtention("pdf");
      window.open(file.url, "_blank");
    }
  };

  const toggleSection = () => {
    setExpandedSection(!expandedSection);
  };

  const toggleSection1 = () => {
    setExpandedSection1(!expandedSection1);
  };

  const toggleSection2 = () => {
    setExpandedSection2(!expandedSection2);
  };

  const toggleSection3 = () => {
    setExpandedSection3(!expandedSection3);
  };

  const toggleSection4 = () => {
    setExpandedSection4(!expandedSection4);
  };

  return (
    <div className="document-form">
      <Spin
        indicator={
          <LoadingOutlined
            style={{ fontSize: 50, color: "var(--kilde-blue)" }}
          />
        }
        spinning={getPoiLoader}
      >
        <div className="mb-24">
          <p className="kl-pi-title" style={{ marginBottom: 12 }}>
            Confirm Investor Status
          </p>
          <div className="sb-isc-info">
            <p className="sb-onboarding-subtitle mt-0 mb-10">
              Please upload documents which demonstrate your investor type.
            </p>
            {/* <p className="sb-onboarding-subtitle m-0">
              To ensure accuracy, please provide income statements containing
              data from the preceding 12 months. For specific documents such as
              the annual Tax Declaration report, kindly provide the latest
              iteration available. Personal and financial asset statements
              should not be older than 3 months.
            </p> */}
          </div>
        </div>

        <div className="kl-pi-subdiv">
          <div>
            <p className="poa-sub mb-16 mt-0">
              {questionnaire?.investorSubType ===
              INVESTOR_TYPE.ACCREDITED_INVESTOR
                ? "Individual/Accredited investors."
                : "Individual/Expert investors."}
            </p>

            <p className="poa-subtitle mt-0 mb-16">
              {questionnaire?.investorSubType ===
              INVESTOR_TYPE.ACCREDITED_INVESTOR
                ? "Please upload documents to demonstrate one of these options:"
                : "Please upload documents to demonstrate both the below:"}
            </p>
            {questionnaire?.investorSubType ===
            INVESTOR_TYPE.ACCREDITED_INVESTOR ? (
              <>
                <div
                  className="dropdown-p mb-16 cursor-pointer"
                  onClick={toggleSection}
                >
                  <img
                    src={expandedSection ? downarrow : rightarrow}
                    alt="toggle arrow"
                  />
                  <p className="poa-list m-0">
                    Income of at least{""}
                    {localStorage.getItem("currency")
                      ? localStorage.getItem("currency") + " 870,000"
                      : "SGD 300,000"}{" "}
                    in the past 12 months:
                  </p>
                </div>
                {expandedSection && (
                  <ul className="sb-text-align-start documents-ul  ml-15">
                    <li>
                      <p className="color-blank">Payslips</p>
                    </li>
                    <li>
                      <p className="color-blank">Tax declaration</p>
                    </li>
                    <li>
                      <p className="color-blank">Bank statements</p>
                    </li>
                  </ul>
                )}
                <div
                  className="dropdown-p mb-16 cursor-pointer"
                  onClick={toggleSection1}
                >
                  <img
                    src={expandedSection1 ? downarrow : rightarrow}
                    alt="toggle arrow"
                  />
                  <p className="poa-list m-0">
                    Net Personal Assets' of at least{" "}
                    {localStorage.getItem("currency")
                      ? localStorage.getItem("currency") + " 5,780,000"
                      : "SGD 2 million"}{" "}
                    (including personal residence up to a cap of{" "}
                    {localStorage.getItem("currency")
                      ? localStorage.getItem("currency") + " 2,890,000"
                      : "SGD 1 million"}
                    ):
                  </p>
                </div>
                {expandedSection1 && (
                  <ul className="sb-text-align-start documents-ul ml-15">
                    <li>
                      <p className="color-blank">
                        {" "}
                        Excerpt from land/property registry
                      </p>
                    </li>
                    <li>
                      <p className="color-blank">
                        {" "}
                        Ownership/valuation documents for other assets
                        (supercars, yachts, other luxury goods are acceptable)
                      </p>
                    </li>
                  </ul>
                )}

                <div
                  className="dropdown-p mb-16 cursor-pointer"
                  onClick={toggleSection2}
                >
                  <img
                    src={expandedSection2 ? downarrow : rightarrow}
                    alt="toggle arrow"
                  />
                  <p className="poa-list m-0">
                    Net Financial Assets' of at least{" "}
                    {localStorage.getItem("currency")
                      ? localStorage.getItem("currency") + " 2,890,000"
                      : "SGD 1 million"}
                    :
                  </p>
                </div>
                {expandedSection2 && (
                  <ul className="sb-text-align-start documents-ul  ml-15">
                    <li>
                      <p className="color-blank">
                        Investment statements (capital markets products,
                        bullion, stock, cryptocurrency holdings)
                      </p>
                    </li>
                    <li>
                      <p className="color-blank">
                        {" "}
                        Investment life policy statement
                      </p>
                    </li>
                    <li>
                      <p className="color-blank">
                        Financial statements and business registry excerpt
                        confirming the value of your shares in private companies
                      </p>
                    </li>
                  </ul>
                )}
              </>
            ) : (
              <>
                <div
                  className="dropdown-p mb-16 cursor-pointer"
                  onClick={toggleSection3}
                >
                  <img
                    src={expandedSection3 ? downarrow : rightarrow}
                    alt="toggle arrow"
                  />
                  <p className="poa-list m-0 ">
                    Your professional financial role:
                  </p>
                </div>
                {expandedSection3 && (
                  <ul className="sb-text-align-start documents-ul  ml-15">
                    <li>
                      <p className="color-blank">
                        Letter of employment or other document(s) showing you
                        are involved in financial decisions and/or acquire and
                        dispose of capital markets products
                      </p>
                    </li>
                  </ul>
                )}

                <div
                  className="dropdown-p mb-16 cursor-pointer"
                  onClick={toggleSection4}
                >
                  <img
                    src={expandedSection4 ? downarrow : rightarrow}
                    alt="toggle arrow"
                  />
                  <p className="poa-list m-0">
                    Your employer’s financial business activities:
                  </p>
                </div>
                {expandedSection4 && (
                  <ul className="sb-text-align-start documents-ul  ml-15">
                    <li>
                      <p className="color-blank">
                        Source document confirming the company deals with
                        capital market products (e.g. license)
                      </p>
                    </li>
                  </ul>
                )}
              </>
            )}
          </div>

          <div className="sb-flex-wrap  mb-50 w-100">
            <div className=" sb-flex-wrap mt-40 w-100">
              {documentNames.length > 0 && (
                <Select
                  style={{ width: "100%" }}
                  suffixIcon={<img src={ArrowUpAndDownIcon} alt="arrow-icon" />}
                  mode="multiple"
                  placeholder="Select document types"
                  defaultValue={[...new Set(documentNames)]}
                  optionLabelProp="label"
                  disabled
                >
                  {data &&
                    data.map((option, id) => (
                      <Option key={id} value={option.key}>
                        {option.value}
                      </Option>
                    ))}
                </Select>
              )}

              {documentNames.length === 0 && (
                <Select
                  style={{ width: "100%" }}
                  suffixIcon={<img src={ArrowUpAndDownIcon} alt="arrow-icon" />}
                  mode="multiple"
                  placeholder="Select document types"
                  value={selectedDocumentTypes}
                  onChange={handleChange}
                  optionLabelProp="label"
                >
                  {data &&
                    data.map((option, id) => (
                      <Option key={id} value={option.key}>
                        {option.value}
                      </Option>
                    ))}
                </Select>
              )}
            </div>

            <div className="file-upload-main-div">
              {fileListofBackend.length > 0
                ? Object.keys(
                    fileListofBackend.reduce((acc, item) => {
                      acc[item.mainType] = acc[item.mainType] || [];
                      acc[item.mainType].push(item);
                      return acc;
                    }, {})
                  ).map((mainType, index) => {
                    const groupedFiles = fileListofBackend.filter(
                      (file) => file.mainType === mainType
                    );
                    return (
                      <div key={index} className="file-group">
                        <h3>{formatSection(mainType)}</h3>
                        <Upload
                          width={600}
                          customRequest={handleCustomRequest}
                          listType="picture-card"
                          fileList={groupedFiles}
                          onPreview={handlePreviewBackend}
                          previewFile={handlePreviewBackend}
                          className="backend-img"
                          showRemoveIcon={groupedFiles.length < 0}
                        >
                          {groupedFiles?.length > 0 ? null : uploadButton}
                        </Upload>
                      </div>
                    );
                  })
                : Object.keys(documentObject)?.map((section, index) => {
                    return (
                      <div
                        key={section}
                        style={{ marginBottom: "20px", display: "block" }}
                      >
                        <h3>{formatSection(section)}</h3>
                        <Upload
                          name={`${section}-${index}`}
                          beforeUpload={(file) => beforeUpload(file, section)}
                          listType="picture-card"
                          fileList={documentObject[section]?.base64Url}
                          onPreview={handlePreview}
                          onChange={(info) => handleChangeFile(section, info)}
                          customRequest={handleCustomRequest}
                        >
                          {documentObject[section]?.length >= 5
                            ? null
                            : uploadButton}
                        </Upload>
                      </div>
                    );
                  })}
            </div>

            <Modal
              open={previewOpen}
              title={previewTitle}
              footer={null}
              onCancel={() => setPreviewOpen(false)}
            >
              {fileExtention === "image" ? (
                <img
                  alt="example"
                  style={{
                    width: "100%",
                  }}
                  src={previewImage}
                />
              ) : (
                <iframe
                  src={previewImage}
                  style={{ width: "100%", height: "500px" }}
                  title="PDF Document"
                />
              )}
            </Modal>
          </div>
        </div>
      </Spin>
    </div>
  );
};

export default EntityDocuments;
