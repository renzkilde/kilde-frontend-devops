/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";

import { Upload, notification, Row, Col, Button, Alert } from "antd";
import {
  EditOutlined,
  LoadingOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import "./style.css";

import { useDispatch, useSelector } from "react-redux";
import {
  setIdentifyProofDetails,
  setIdentityVerificationResponse,
} from "../../../Redux/Action/KycIndividual";
import { showMessageWithCloseIconError } from "../../../Utils/Reusables";
import Identify_tickmark from "../../../Assets/Images/identify_tickmark.svg";
import { checkStepStatus } from "../../../Utils/Helpers";
import CustomRadioButton from "../../../Components/DefaultRadio/CustomRadioButton";

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};

const IdentifyProof = ({ type }) => {
  const dispatch = useDispatch();
  const [api, contextHolder] = notification.useNotification();
  const user = useSelector((state) => state.user);
  const idvInfo = useSelector(
    (state) => state?.kycIndividual?.livenessCheck?.documentInfo
  );

  const [docError, setDocError] = useState();

  const [state, setState] = useState(idvInfo?.documentType || "Identity");
  const [documentObject, setDocumentObject] = useState({
    frontImage: "",
    backImage: "",
  });
  const identifyVerification = useSelector(
    (state) => state.kycIndividual.identifyVerification
  );

  const [documentUrls, setDocumentUrls] = useState({
    frontImage: idvInfo?.frontDocumentUrl || "",
    backImage: idvInfo?.backDocumentUrl || "",
  });

  useEffect(() => {
    if (identifyVerification === "") {
      setState(state);
      if (state === "Passport") {
        setDocumentObject({
          frontImage: "",
        });
        setDocumentUrls({
          frontImage: "",
        });
      } else {
        setDocumentObject({
          frontImage: "",
          backImage: "",
        });
        setDocumentUrls({
          frontImage: "",
          backImage: "",
        });
      }
    }
  }, [identifyVerification]);

  useEffect(() => {
    if (state === "Passport") {
      setDocumentObject({
        frontImage: "",
      });
    } else {
      setDocumentObject({
        frontImage: "",
        backImage: "",
      });
    }
  }, [state]);

  const handleChange = (info, documentType) => {
    const newDocumentObject = { ...documentObject };

    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, (url) => {
        setDocumentUrls((prevUrls) => ({
          ...prevUrls,
          [documentType]: url,
        }));
      });
      newDocumentObject[documentType] = {
        ...newDocumentObject[documentType],
        loading: false,
        file: info.file.originFileObj,
      };
    } else if (info.file.status === "uploading") {
      newDocumentObject[documentType] = {
        ...newDocumentObject[documentType],
        loading: true,
        file: null,
      };
    }
    setDocumentObject(newDocumentObject);
  };

  useEffect(() => {
    setIdentityVerificationResponse("", dispatch);
    const dataToDispatch = {
      docs: documentObject,
      documentType: state,
    };
    setIdentifyProofDetails(dataToDispatch, dispatch);
  }, [dispatch, documentObject, state]);

  const handleEditDocumentField = (documentType) => {
    setDocError(undefined);
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".bmp,.jpg,.png";
    input.onchange = (event) =>
      handleEditFile(documentType, event.target.files[0]);
    input.click();
  };

  const handleCustomRequest = ({ file, onSuccess, onError }) => {
    setTimeout(() => {
      onSuccess();
    }, 1000);
  };

  const handleEditFile = (documentType, file) => {
    if (file) {
      getBase64(file, (url) => {
        setDocumentObject((prevDocumentObject) => ({
          ...prevDocumentObject,
          [documentType]: {
            ...prevDocumentObject[documentType],
            loading: true,
            file: file,
          },
        }));
        setDocumentUrls((prevUrls) => ({
          ...prevUrls,
          [documentType]: url,
        }));
      });
    }
  };

  const beforeUpload = (file) => {
    setDocError(undefined);

    const isJpgOrPngOrBmp =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/bmp" ||
      file.type === "image/jpg";

    if (!isJpgOrPngOrBmp) {
      setDocError(
        "Accepted file formats are JPG, PNG, and BMP. Kindly re-upload your documents in the correct format."
      );

      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = window.URL.createObjectURL(file);

      image.onload = () => {
        const width = image.width;
        const height = image.height;

        if (width < 500 || height < 500 || width > 8192 || height > 8192) {
          setDocError(
            "Image resolution must be between 500x500 and 8192x8192 pixels."
          );
          return reject();
        }
        resolve();
      };

      image.onerror = () => {
        setDocError(
          "Error loading the image. Please check the file and try again."
        );
        reject();
      };
    });
  };

  const uploadButton = (documentType) => (
    <div className="sb-document-upload">
      <span className="sb-fileUpload-icon">
        {documentObject[documentType].loading ? (
          <LoadingOutlined />
        ) : (
          <UploadOutlined />
        )}
      </span>
      <div>
        <span className="sb-file-span">
          Click to browse or drop here JPG, PNG, BMP
        </span>
      </div>
    </div>
  );

  const onChange = (e) => {
    setState(e.target.value);
  };

  return (
    <div>
      {contextHolder}
      {type === "EMAIL_SENT" ? (
        <p
          className="sb-form-header"
          style={{ fontSize: 18, fontWeight: "bold", color: "tomato" }}
        >
          Please re-upload your identity document.
        </p>
      ) : (
        <p className="sb-verification-title">Verify Your Identity</p>
      )}
      <p className="sb-onboarding-subtitle m-0">
        Please upload proof of your identity. Acceptable proof is a passport,
        national id, or driving licence.
      </p>
      <div className="identify-proof-mainDiv mt-24">
        <div>
          <p className="m-0 verification-header">Document Type:</p>
        </div>
        <div className="mt-16 w-100 gap-16 verification-radio sb-sub-usertype">
          <CustomRadioButton
            className="sub-inv-type"
            label="Identity Card"
            name="option"
            value="Identity"
            checked={state === "Identity"}
            onChange={onChange}
          />
          <CustomRadioButton
            className="sub-inv-type"
            label="Passport"
            name="option"
            value="Passport"
            checked={state === "Passport"}
            onChange={onChange}
          />
        </div>

        <div className="sb-identify-fileupload identify-notes-margin">
          <Row gutter={16}>
            {Object.keys(documentObject).map((documentType, key) => (
              <Col xs={24} sm={24} md={12} lg={12} xl={12} key={key}>
                <label className="verification-header">
                  {documentType === "frontImage" ? "Front image" : "Back image"}
                  {(documentUrls[documentType] ||
                    (idvInfo !== undefined &&
                      checkStepStatus(
                        user?.waitingVerificationSteps,
                        "IDENTITY_VERIFICATION"
                      ) === true)) && (
                    <Button
                      className="edit-identifybtn"
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => handleEditDocumentField(documentType)}
                    />
                  )}
                </label>
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                  onChange={(info) => handleChange(info, documentType)}
                  customRequest={handleCustomRequest}
                >
                  {documentUrls[documentType] ? (
                    <img
                      src={documentUrls[documentType]}
                      alt={documentType}
                      style={{
                        width: "100%",
                        height: "184px",
                        objectFit: "contain",
                        borderRadius: "8px",
                        border: "1px solid #d9d9d9",
                      }}
                    />
                  ) : (
                    uploadButton(documentType)
                  )}
                </Upload>
              </Col>
            ))}
          </Row>
          {docError && (
            <div className="error-div  mt-20">
              <Alert message={docError} type="error" showIcon />
            </div>
          )}
          <div className="mt-20">
            <p className="notes-tag">
              When photographing your proof of identity, please ensure:
            </p>
            <div className="sb-flex-align-center">
              <div className="notes-tag">
                <img src={Identify_tickmark} alt="identify_tickmark" />
                Adequate resolution: use a camera with at least Full HD
                (1920×1080) and autofocus
              </div>
            </div>
            <div className="sb-flex-align-center">
              <div className="notes-tag">
                <img src={Identify_tickmark} alt="identify_tickmark" />
                Good lighting: avoid an overly dark or bright image
              </div>
            </div>
            <div className="sb-flex-align-center">
              <div className="notes-tag">
                <img src={Identify_tickmark} alt="identify_tickmark" />
                Minimum glare and reflections: turn off your flash
              </div>
            </div>
            <div className="sb-flex-align-center">
              <div className="notes-tag">
                <img src={Identify_tickmark} alt="identify_tickmark" />
                The camera is pointed directly at the document: no oblique
                angles
              </div>
            </div>
            <div className="sb-flex-align-center">
              <div className="notes-tag">
                <img src={Identify_tickmark} alt="identify_tickmark" />
                Visible edges: use a contrasting background
              </div>
            </div>
            <div className="sb-flex-align-center">
              <div className="notes-tag">
                <img src={Identify_tickmark} alt="identify_tickmark" />
                Margins are not too big/small: your document should fill 70-80%
                of the image
              </div>
            </div>
            <div className="sb-flex-align-center">
              <div className="notes-tag">
                <img src={Identify_tickmark} alt="identify_tickmark" />
                Your document is the only object in the image: no hands, no
                fingers etc.
              </div>
            </div>
            <div className="sb-flex-align-center">
              <div className="notes-tag">
                <img src={Identify_tickmark} alt="identify_tickmark" />
                The image is sharp and the text is readable
              </div>
            </div>
            {/* <div className="sb-flex-align-center">
            <div className="notes-tag">
              <img src={Identify_tickmark} alt="identify_tickmark" />
              Resolution: Use a camera with a resolution of at least Full HD
              (1920×1080) and autofocus.
            </div>
          </div>
          <div className="sb-flex-align-center">
            <div className="notes-tag">
              <img src={Identify_tickmark} alt="identify_tickmark" />
              Extraneous Objects: Keep hands or objects away from document data.
            </div>
          </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdentifyProof;
