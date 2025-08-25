import React, { useState, useEffect } from "react";
import { Modal, Spin, Upload } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import { useDispatch, useSelector } from "react-redux";
import { setDocSubmissionDetails } from "../../../Redux/Action/KycIndividual";
import { checkStepStatus, getBase64 } from "../../../Utils/Helpers";

import "./style.css";
import { getRerefenceProofOfAddressApi } from "../../../Apis/InvestorApi";
import { getUser } from "../../../Apis/UserApi";
import { setUserDetails } from "../../../Redux/Action/User";
import GlobalVariabels from "../../../Utils/GlobalVariabels";
import { showMessageWithCloseIconError } from "../../../Utils/Reusables";
import uploadicon from "../../../Assets/Images/uploadicon.svg";

const Documents = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [imagesData, setImagesData] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList] = useState([]);
  const [fileListofBackend, setFileListBackend] = useState([]);
  const [fileExtention, setFileExtention] = useState("");
  const [allReferences, setAllrefernces] = useState();
  const [getPoaLoader, setPoaLoader] = useState(false);

  const getUserDetails = async () => {
    const response = await getUser();
    if (response) {
      setUserDetails(response, dispatch);
    } else {
      console.error("Error fetching user details data:");
    }
  };

  useEffect(() => {
    getUserDetails();
    if (
      checkStepStatus(user?.waitingVerificationSteps, "DOCUMENTS") === false
    ) {
      setPoaLoader(true);
      getRerefenceProofOfAddressApi()
        .then((refrencesResponse) => {
          setAllrefernces(refrencesResponse?.documentReference);
          setPoaLoader(false);
        })
        .catch(() => {
          setPoaLoader(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchImageLinks = async () => {
      const promises = allReferences?.map(async (img) => {
        if (img) {
          const response = `${GlobalVariabels.VIEW_IMG}/${img}`;
          return response;
        }
        return null;
      });

      const resolvedImageLinks = await Promise.all(promises);
      const filteredImageLinks = resolvedImageLinks.filter(
        (url) => url !== null
      );

      setFileListBackend((prevFileList) => {
        const newFileList = [...prevFileList];

        filteredImageLinks.forEach((url, index) => {
          newFileList.push({
            uid: `image-${index}`,
            name: `Image ${index + 1}`,
            status: "done",
            url: url,
            thumbUrl: url,
          });
        });

        return newFileList;
      });
    };

    if (allReferences?.length > 0) {
      fetchImageLinks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allReferences]);

  const handleCustomRequest = ({ onSuccess }) => {
    setTimeout(() => {
      onSuccess();
    }, 1000);
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

  useEffect(() => {
    if (imagesData.length > 0) {
      setDocSubmissionDetails(imagesData, dispatch);
    }
  }, [imagesData, dispatch]);

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

  const handlePreviewBackend = async (file) => {
    const match = file.url.match(/\.([^.]+)$/);
    let fileType = "";
    if (match) fileType = match[1]?.toLowerCase();

    if (
      fileType === "jpg" ||
      fileType === "jpeg" ||
      fileType === "bmp" ||
      fileType === "png"
    ) {
      setPreviewOpen(true);
      setPreviewImage(file.url || file.thumbUrl);
      setFileExtention("image");
    } else {
      setFileExtention("pdf");
      window.open(file.url, "_blank");
    }
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

  const handleCancel = () => setPreviewOpen(false);

  return (
    <div>
      <Spin
        indicator={
          <LoadingOutlined
            style={{ fontSize: 50, color: "var(--kilde-blue)" }}
          />
        }
        spinning={getPoaLoader}
      >
        <p className="sb-verification-title">Provide Proof of Address</p>

        {/* <p className="sb-onboarding-subtitle m-0">
          Please upload one of the following as proof of your address:
        </p> */}

        <div className="identify-proof-mainDiv mt-24">
          <p className="poa-subtitle mt-0 mb-16">
            Please upload one of the following as proof of your address:
          </p>
          <div>
            <ul className="sb-text-align-start documents-ul">
              <li>
                <p className="color-blank">A bank statement</p>
              </li>
              <li>
                <p className="color-blank">A utility bill</p>
              </li>
              <li>
                <p className="color-blank">A telecoms bill</p>
              </li>
            </ul>
          </div>
          {/* <p className="mt-0 mb-16 color-blank">
            The document must be dated within the last three months.
          </p> */}
          <div className="upload-border-kilde">
            {fileListofBackend.length > 0 ? (
              <Upload
                width={600}
                customRequest={handleCustomRequest}
                listType="picture-card"
                fileList={fileListofBackend}
                onPreview={handlePreviewBackend}
                previewFile={handlePreviewBackend}
                className="backend-img"
                showRemoveIcon={fileListofBackend.length < 0}
              >
                {fileListofBackend?.length >= 0 ? null : uploadButton}
              </Upload>
            ) : (
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
                {imagesData?.length >= 10 ? null : uploadButton}
              </Upload>
            )}
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
          </div>
          <div>
            <div className="list-div mb-12">
              <i
                style={{
                  fontSize: 20,
                  color: "var(--kilde-blue)",
                  marginRight: 5,
                }}
                className="bi bi-check"
              ></i>
              <p className="m-0">
                Upload your documents issued within the last 3 months
              </p>
            </div>
            <div className="list-div mb-12">
              <i
                style={{
                  fontSize: 20,
                  color: "var(--kilde-blue)",
                  marginRight: 5,
                }}
                className="bi bi-check"
              ></i>
              <p className="m-0">
                You can upload up to 10 documents, with a maximum file size of
                10MB each.
              </p>
            </div>
            <div className="list-div mb-12">
              <i
                style={{
                  fontSize: 20,
                  color: "var(--kilde-blue)",
                  marginRight: 5,
                }}
                className="bi bi-check"
              ></i>
              <p className="m-0">You can upload JPG, JPEG, PNG, BMP or PDF.</p>
            </div>
          </div>
        </div>
      </Spin>
    </div>
  );
};

export default Documents;
