import React, { useState } from "react";
import { Col, Form, Modal, Row, Upload } from "antd";
import InputDefault from "../../Components/InputDefault/InputDefault";
import ButtonDefault from "../../Components/ButtonDefault/ButtonDefault";
import { getBase64, getCountries } from "../../Utils/Helpers";
import {
  showMessageWithCloseIcon,
  showMessageWithCloseIconError,
} from "../../Utils/Reusables";
import upload from "../../Assets/Images/UploadSimple.svg";
import SelectDefault from "../../Components/SelectDefault/SelectDefault";
import editaddressdone from "../../Assets/Images/Success.svg";
import axios from "axios";
import {
  authenticateCode,
  getUser,
  sendVerificationCode,
  updateAddress,
} from "../../Apis/UserApi";
import { setUserDetails } from "../../Redux/Action/User";
import { useDispatch } from "react-redux";
import TwoFAComponent from "../TwoFAPage/TwoFAContent";
import { LoadingOutlined } from "@ant-design/icons";

const EditAddress = ({ onClose }) => {
  const countryList = getCountries();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileExtention, setFileExtention] = useState("");
  const [address, setAddress] = useState(true);
  const [sentModal, setSentModal] = useState(false);
  const dispatch = useDispatch();
  const [openTwofa, setOpenTwofa] = useState(false);

  const [error, setError] = useState("");
  const [loader, setLoader] = useState(false);

  const [fileList] = useState([]);
  const [imagesData, setImagesData] = useState([]);
  const [addressData, setAddessData] = useState({
    houseNumber: "",
    residenceAddressCountry: "",
    residenceAddressPostalCode: "",
    residenceAddressCity: "",
    residenceAddressStreet: "",
    addressFileReference: [],
  });

  const [validationErrors, setValidationErrors] = useState({
    houseNumber: false,
    residenceAddressCountry: false,
    residenceAddressPostalCode: false,
    residenceAddressCity: false,
    residenceAddressStreet: false,
  });

  const [code, setCode] = useState("");
  const [secFactorAuth, setSecFactorAuth] = useState("");
  const [mobile, setMobile] = useState("");

  const handleInit = () => sendVerificationCode();

  const sendVerification = async () => {
    try {
      const res = await sendVerificationCode();
      if (res?.length === 0) {
        showMessageWithCloseIconError("Something went wrong, Try again!");
      } else {
        setSecFactorAuth(res?.type);
        setCode(res?.verificationCode);
        setMobile(res?.mobilePhone);
        setAddress(false);
        setLoader(false);
        setOpenTwofa(true);

        showMessageWithCloseIcon(
          res?.type === "TOTP"
            ? "Please check your authentication app for the current one-time password"
            : "We've sent an OTP to your mobile number. Please check your messages."
        );
      }
    } catch (err) {
      console.error("2FA API error:", err);
      setLoader(false);
    }
  };

  const handleAuthentication = async (otp) => {
    setLoader(true);
    if (otp !== "") {
      const requestBody = {
        code: otp,
      };
      const response = await authenticateCode(requestBody);
      if (!response) {
        handleUpdateAddress();
      } else {
        onClose();
        return setOpenTwofa(false);
      }
    }
  };

  const handleUpdate = () => {
    setLoader(true);
    setError("");
    if (addressData?.residenceAddressCountry === "") {
      setLoader(false);
      return setError("Country is required");
    } else if (imagesData.length <= 0) {
      setLoader(false);
      return showMessageWithCloseIconError("Please upload documents.");
    } else {
      sendVerification();
    }
  };

  const handleCustomRequest = ({ onSuccess }) => {
    setTimeout(() => {
      onSuccess();
    }, 1000);
  };

  const getUserDetails = async () => {
    try {
      const response = await getUser();
      if (response) {
        setUserDetails(response, dispatch);
        return response;
      } else {
        console.error("Error fetching user data:");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  const handleFileUpload = async (info) => {
    if (info.file.status === "done") {
      setImagesData((prevImagesData) => [
        ...prevImagesData,
        info.file.originFileObj,
      ]);
    } else if (info.file.status === "removed") {
      setImagesData((prevImagesData) =>
        prevImagesData.filter((image) => image !== info.file.originFileObj)
      );
    } else if (info.file.status === "error") {
      console.error("Something went wrong while uploading file");
    }
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

  const allowedFileTypes = [
    "image/png",
    "image/jpeg",
    "image/bmp",
    "application/pdf",
  ];

  const beforeUpload = (file) => {
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    const isAllowedType = allowedFileTypes.includes(file.type);
    const fileSize = file.size > maxFileSize;

    if (!isAllowedType) {
      showMessageWithCloseIconError(
        "You can only upload PNG, JPG, JPEG, BMP,or PDF file!"
      );
    }
    if (fileSize) {
      showMessageWithCloseIconError(
        "File size must be less than or equal to 10MB"
      );
    }
    return (isAllowedType && !fileSize) || Upload.LIST_IGNORE;
  };

  const uploadButton = (
    <div>
      <img src={upload} alt="upload" />
      <div
        style={{
          fontSize: "10px",
          padding: "3px",
          color: "var(--kilde-blue)",
        }}
      >
        Click to browse or drop here JPG, JPEG, PNG, BMP or PDF
      </div>
    </div>
  );

  const handleUpdateAddress = async () => {
    if (imagesData && imagesData.length > 0) {
      const formData = new FormData();
      for (let i = 0; i < imagesData.length; i++) {
        formData.append(`files`, imagesData[i]);
      }
      if (formData) {
        try {
          const response = await axios.post(`/api/v2/guest/upload`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          if (response) {
            if (response?.data?.fileReference?.length > 0) {
              const updatedAddressData = {
                ...addressData,
                addressFileReference: response?.data?.fileReference,
              };
              const updateResponse = await updateAddress(updatedAddressData);
              if (Object.keys(updateResponse)?.length === 0) {
                await getUserDetails();
                setLoader(false);
                setOpenTwofa(false);
                setSentModal(true);
              } else if (updateResponse?.status >= 400) {
                showMessageWithCloseIconError("Failed to update address");
              } else {
                showMessageWithCloseIconError(
                  "Something went wrong, Please Try again!"
                );
              }
            }
          }
        } catch (error) {
          setLoader(false);
          showMessageWithCloseIconError("File upload error:", error);
        }
      }
    } else {
      setLoader(false);
      return showMessageWithCloseIconError("Please upload documents.");
    }
  };

  const handleCancel = () => setPreviewOpen(false);

  return (
    <Col className="gutter-row" xl={11} lg={16} md={24} sm={24} xs={24}>
      <Modal
        className="edit-address-modal"
        centered
        open={address}
        footer={null}
        maskClosable={false}
        width={616}
        onCancel={onClose}
      >
        <p className="mt-0 wallet-sub-head mb-24">Request Change Address</p>
        <Form
          onFinish={handleUpdate}
          name="wrap"
          labelCol={{ flex: "110px" }}
          labelAlign="left"
          labelWrap
          wrapperCol={{ flex: 1 }}
          colon={false}
        >
          <Row gutter={16}>
            <Col className="gutter-row " md={12} sm={12} xs={24}>
              <label className="mb-4">Country</label>
              <Form.Item
                validateStatus={
                  error && addressData?.residenceAddressCountry === ""
                    ? "error"
                    : ""
                }
                help={
                  error && addressData?.residenceAddressCountry === "" ? (
                    <p
                      style={{
                        color: "#e74c3c",
                        marginTop: "3px",
                        fontSize: "12px",
                        textAlign: "start",
                      }}
                      className="mb-0"
                    >
                      {error}
                    </p>
                  ) : null
                }
              >
                <SelectDefault
                  data={countryList}
                  MyValue={addressData?.residenceAddressCountry}
                  placeholder="Select a country"
                  style={{ width: "100%", height: "auto" }}
                  onChange={(value, key) => {
                    setAddessData((prevState) => ({
                      ...prevState,
                      residenceAddressCountry: key?.value,
                    }));

                    if (key?.value) {
                      setError("");
                    }
                  }}
                  value={addressData?.residenceAddressCountry}
                  type="text"
                  name="residenceAddressCountry"
                  validationState={setValidationErrors}
                  focusing={validationErrors?.residenceAddressCountry}
                  required={true}
                  errorMsg={error === "" && "Country is required"}
                />
              </Form.Item>
            </Col>
            <Col className="gutter-row " md={12} sm={12} xs={24}>
              <label className="mb-4">City</label>
              <InputDefault
                value={addressData?.residenceAddressCity}
                type="text"
                name="residenceAddressCity"
                placeholder="City"
                validationState={setValidationErrors}
                focusing={validationErrors?.residenceAddressCity}
                onChange={({ target }) =>
                  setAddessData({
                    ...addressData,
                    residenceAddressCity: target.value,
                  })
                }
                required={true}
                errorMsg={"City is required"}
              />
            </Col>
            <Col className="gutter-row" md={12} sm={12} xs={24}>
              <label className="mb-4">Street</label>
              <InputDefault
                value={addressData?.residenceAddressStreet}
                type="text"
                name="residenceAddressStreet"
                placeholder="Street"
                validationState={setValidationErrors}
                focusing={validationErrors?.residenceAddressStreet}
                onChange={({ target }) =>
                  setAddessData({
                    ...addressData,
                    residenceAddressStreet: target.value,
                  })
                }
                required={true}
                errorMsg={"Street is required"}
              />
            </Col>
            <Col className="gutter-row " md={12} sm={12} xs={24}>
              <label className="mb-4">House or Unit number</label>
              <InputDefault
                value={addressData?.houseNumber}
                type="text"
                name="houseNumber"
                placeholder="House or Unit number"
                validationState={setValidationErrors}
                focusing={validationErrors?.houseNumber}
                onChange={({ target }) =>
                  setAddessData({
                    ...addressData,
                    houseNumber: target.value,
                  })
                }
                required={true}
                errorMsg={"House or Unit number is required"}
              />
            </Col>
            <Col className="gutter-row mt-16" md={12} sm={12} xs={24}>
              <label className="mb-4">Postal Code / Zip Code</label>
              <InputDefault
                value={addressData?.residenceAddressPostalCode}
                type="text"
                name="residenceAddressPostalCode"
                placeholder="Postal Code / Zip Code"
                validationState={setValidationErrors}
                focusing={validationErrors?.residenceAddressPostalCode}
                onChange={({ target }) =>
                  setAddessData({
                    ...addressData,
                    residenceAddressPostalCode: target.value,
                  })
                }
                required={true}
                errorMsg={"Postal Code / Zip Code is required"}
              />
            </Col>
            <Col className="gutter-row mt-20" md={24} sm={24} xs={24}>
              <label className="mb-4">Proof of Address</label>
              <p className=" sb-text-align-start mt-0 mb-8">
                Please upload any of the following supporting documents:
              </p>
              <div>
                <ul className="sb-text-align-start documents-ul">
                  <li>
                    <p className="color-blank">
                      Bank statement (within the last 3 months)
                    </p>
                  </li>
                  <li>
                    <p className="color-blank">
                      Utility bill (within the last 3 months)
                    </p>
                  </li>
                  <li>
                    <p className="color-blank">
                      Telco bill (within the last 3 months)
                    </p>
                  </li>
                </ul>
              </div>
              <div>
                <Upload
                  width={600}
                  customRequest={handleCustomRequest}
                  listType="picture-card"
                  defaultFileList={[...fileList]}
                  onChange={handleFileUpload}
                  onPreview={handlePreview}
                  maxCount={10}
                  className="backend-images"
                  beforeUpload={beforeUpload}
                >
                  {imagesData?.length >= 5 ? null : uploadButton}
                </Upload>
              </div>
              <Modal
                open={previewOpen}
                title={previewTitle}
                footer={null}
                onCancel={handleCancel}
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
            </Col>
          </Row>
          <Col className="mt-20">
            <ButtonDefault title="Submit" loading={loader} />
          </Col>
        </Form>
      </Modal>
      <Modal
        open={sentModal}
        footer={null}
        onCancel={() => setSentModal(false)}
        maskClosable={false}
        closable={true}
        width={612}
        className="twofa-modal-closeicon"
      >
        <div style={{ padding: "20px" }}>
          <div className="kd-2fa-firstdiv">
            <div className="editAddress">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <img
                  src={editaddressdone}
                  alt="editaddressdone"
                  style={{
                    width: "80px",
                    height: "80px",
                  }}
                />
                <p className="sb-TwoFa-title mt-16 mb-8">
                  Your change request has been submitted successfully
                </p>
                <p className="mb-24 mt-0">
                  Our team will review it and update you soon
                </p>

                <ButtonDefault
                  title={"Back to the Platform"}
                  style={{ width: "100%" }}
                  onClick={() => setSentModal(false)}
                />
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        open={openTwofa}
        footer={null}
        onCancel={() => setOpenTwofa(false)}
        maskClosable={false}
        closable={false}
        width={600}
      >
        {secFactorAuth === "TOTP" || code || mobile ? (
          <TwoFAComponent
            onInit={handleInit}
            onAuthenticate={handleAuthentication}
            secFactorAuth={secFactorAuth}
            loader={loader}
            codes={code}
            mobileNo={mobile}
            usedIn={"AddressChange"}
          />
        ) : (
          <LoadingOutlined
            style={{
              fontSize: 100,
            }}
            spin
          />
        )}
      </Modal>
    </Col>
  );
};

export default EditAddress;
