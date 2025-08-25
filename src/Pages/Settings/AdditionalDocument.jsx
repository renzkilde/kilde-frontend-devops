import React, { useEffect, useState } from "react";
import DashboardLayout from "../../Layouts/DashboardLayout/DashboardLayout";
import { Content } from "antd/es/layout/layout";
import {
  Breadcrumb,
  Button,
  Col,
  Modal,
  Row,
  Spin,
  Tooltip,
  Upload,
} from "antd";
import ButtonDefault from "../../Components/ButtonDefault/ButtonDefault";
import axios from "axios";
import {
  AdditionalDocumentUploadApi,
  getNoteOfAcceptance,
} from "../../Apis/UserApi";
import ROUTES from "../../Config/Routes";
import { useNavigate } from "react-router-dom";
import {
  showMessageWithCloseIcon,
  showMessageWithCloseIconError,
} from "../../Utils/Reusables";
import Download_icon from "../../Assets/Images/download_icon.svg";
import View_icon from "../../Assets/Images/view_icon.svg";
import Borrower_pdf from "../../Assets/Images/borrower_pdf.svg";
import GlobalVariabels from "../../Utils/GlobalVariabels";
import {
  DeleteOutlined,
  EyeOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

const AdditionalDocument = () => {
  const navigate = useNavigate();
  const [fileList, setFileList] = useState([]);
  const [isRemove, setIsRemove] = useState(false);
  const [isRemoveFile, setIsRemoveFile] = useState();
  const [docLoading, setDocLoading] = useState(false);
  const [downloadingFile, setDownloadingFile] = useState({});
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [addiDoc, setAddiDoc] = useState([]);

  useEffect(() => {
    return () => {
      if (previewFile?.url?.startsWith("blob:")) {
        URL.revokeObjectURL(previewFile.url);
      }
    };
  }, [previewFile]);

  const handlePreview = (file) => {
    const fileObj = file.originFileObj || file;

    if (!(fileObj instanceof File)) return;

    const extension = fileObj.name.split(".").pop().toLowerCase();
    const url = URL.createObjectURL(fileObj);

    setPreviewFile({ url, type: extension === "pdf" ? "pdf" : "image" });
    setPreviewOpen(true);
  };

  useEffect(() => {
    getAdditionalDocuments();
  }, []);

  const props = {
    onRemove: (file) => {
      setIsRemove(true);
      setIsRemoveFile(file);
    },
    beforeUpload: (file) => {
      if (file.size > 10 * 1024 * 1024) {
        showMessageWithCloseIconError("File size must be under 10MB");
        return false;
      }

      setFileList((prevFileList) => [...prevFileList, file]);
      return false;
    },
    fileList,
    itemRender: (originNode, file, fileList, actions) => (
      <div
        className="custom-upload-item"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span>{file.name}</span>
        <div style={{ display: "flex", gap: "8px" }}>
          <Tooltip title="Preview">
            <EyeOutlined
              onClick={() => handlePreview(file)}
              style={{ cursor: "pointer", color: "#1890ff" }}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <DeleteOutlined
              onClick={() => actions.remove()}
              style={{ cursor: "pointer", color: "#ff4d4f" }}
            />
          </Tooltip>
        </div>
      </div>
    ),
  };

  const handleDeleteFile = () => {
    const index = fileList.indexOf(isRemoveFile);
    const newFileList = fileList.slice();
    newFileList.splice(index, 1);
    setFileList(newFileList);
    setIsRemove(false);
  };

  const handleBack = () => {
    setIsRemove(false);
  };

  const getAdditionalDocuments = async () => {
    try {
      const response = await getNoteOfAcceptance("OTHER");

      if (response && Array.isArray(response)) {
        setAddiDoc([...response]);
      } else {
        console.warn("Unexpected response format:", response);
      }
    } catch (error) {
      console.error("Failed to fetch note of acceptance:", error);
    }
  };

  const handleAdditionalDoc = async () => {
    try {
      setDocLoading(true);
      if (fileList && fileList.length > 0) {
        const formData = new FormData();
        for (let i = 0; i < fileList.length; i++) {
          formData.append(`files`, fileList[i]);
        }
        if (formData) {
          const response = await axios.post(`/api/v2/guest/upload`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          if (response && response?.data?.fileReference?.length > 0) {
            await AdditionalDocumentUploadApi({
              fileReferences: response?.data?.fileReference,
            });
            showMessageWithCloseIcon("Documents uploaded successfully");
            getAdditionalDocuments();
            setFileList([]);
          }
        }
      }
    } catch (error) {
      showMessageWithCloseIconError(
        "Failed to upload documents. Please try again."
      );
      setDocLoading(false);
    } finally {
      setDocLoading(false);
    }
  };

  const handleDownload = async (fileReference, fileName) => {
    if (fileReference) {
      setDownloadingFile((prevState) => ({
        ...prevState,
        [fileReference]: true,
      }));
      const fileUrl = `${GlobalVariabels.VIEW_IMG}/${fileReference}`;
      try {
        const response = await axios({
          url: fileUrl,
          method: "GET",
          responseType: "blob",
        });
        const blob = new Blob([response.data], {
          type: response.headers["content-type"],
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;

        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      } catch (error) {
        console.error("Error downloading file:", error);
      } finally {
        setDownloadingFile((prevState) => ({
          ...prevState,
          [fileReference]: false,
        }));
      }
    }
  };

  const handlePreviewAfterUpload = (file) => {
    if (!file || (!file.url && !file.fileReference)) return;

    const url = file.url || `${GlobalVariabels.VIEW_IMG}/${file.fileReference}`;
    const name = file.name || file.fileReference || "";
    const extension = name.split(".").pop().toLowerCase();

    if (extension === "pdf") {
      window.open(url, "_blank");
    } else {
      setPreviewFile({ url, type: "image" });
      setPreviewOpen(true);
    }
  };

  return (
    <div>
      <DashboardLayout>
        <Content className="setting-page-div">
          <Breadcrumb
            separator=" / "
            items={[
              {
                title: (
                  <span
                    onClick={() => navigate(ROUTES.SETTINGS)}
                    style={{ cursor: "pointer" }}
                  >
                    Personal Settings
                  </span>
                ),
              },
              {
                title: "Additional documents",
              },
            ]}
          />
          <p className="setting-head">Additional Documents</p>

          <Row gutter={16}>
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={16}
              className="gutter-row setting-twofa-div"
            >
              <p className="mt-0 filter-subtitle">
                Upload Additional Documents
              </p>
              <p className="add-doc-setting mt-0 mb-16">
                If the support team has asked for more documents, please upload
                them here.
              </p>
              <div className="setting-upload mt-0">
                <Upload {...props} multiple>
                  <Button className="setting-main-upload-btn">
                    <div>
                      <p className="m-0 add-doc-input-head">
                        Additional documents
                      </p>
                      <p className="mt-5 mb-0">
                        Drag & Drop or click here to select a file
                      </p>
                    </div>
                  </Button>
                </Upload>
              </div>
              <div className="mt-16">
                <ButtonDefault
                  onClick={handleAdditionalDoc}
                  title="Submit Files"
                  loading={docLoading}
                  disabled={fileList.length > 0 ? false : true}
                />
              </div>

              <div>
                <p className="mt-40 filter-subtitle">Submitted Files</p>
                {addiDoc?.length > 0 &&
                  addiDoc?.map((file, index) => (
                    <Row>
                      <React.Fragment>
                        <Col xs={18} lg={18}>
                          <div className="mb-4 mt-0 borrower-info-tag">
                            <div className="note-of-acceptance-div">
                              <div>
                                <img src={Borrower_pdf} alt="pdf_icon" />
                              </div>
                              <div>
                                <p className="m-0">{file.fileName}</p>
                              </div>
                            </div>
                          </div>
                        </Col>
                        <Col
                          xs={6}
                          lg={6}
                          className="sb-justify-end-item-center"
                        >
                          <div className="note-of-acceptance-div">
                            <div
                              onClick={() => handlePreviewAfterUpload(file)}
                              className="cursor-pointer"
                            >
                              <img src={View_icon} alt="view_icon" />
                            </div>
                            <div
                              onClick={() =>
                                handleDownload(
                                  file?.fileReference,
                                  file.fileName
                                )
                              }
                              className="cursor-pointer"
                            >
                              {downloadingFile["file.fileReference"] ? (
                                <Spin
                                  indicator={<LoadingOutlined spin />}
                                  size="small"
                                />
                              ) : (
                                <img src={Download_icon} alt="download_icon" />
                              )}
                            </div>
                          </div>
                        </Col>
                      </React.Fragment>
                    </Row>
                  ))}
              </div>
            </Col>
          </Row>
        </Content>
      </DashboardLayout>

      <Modal
        centered
        open={isRemove}
        onCancel={() => {
          setIsRemove(false);
        }}
        width={400}
        footer={null}
        maskClosable={false}
      >
        <h3 className="sb-text-align">
          Are you sure you want to delete this document?
        </h3>

        <div className="sb-text-align d-flex mt-20">
          <Button
            className="remove-modal-back-btn mr-8 w-100"
            onClick={handleBack}
          >
            Back
          </Button>
          <ButtonDefault
            style={{ width: "100%" }}
            title="Delete"
            onClick={() => handleDeleteFile()}
          />
        </div>
      </Modal>
      <Modal
        open={previewOpen}
        title="Preview"
        footer={null}
        onCancel={() => setPreviewOpen(false)}
        width={800}
      >
        {previewFile?.type === "pdf" ? (
          <iframe
            src={previewFile.url}
            style={{ width: "100%", height: "500px" }}
            title="PDF Preview"
            onError={() => {
              window.open(previewFile.url, "_blank");
              setPreviewOpen(false);
            }}
          />
        ) : (
          <img
            alt="Preview"
            style={{ width: "100%", maxHeight: "500px", objectFit: "contain" }}
            src={previewFile?.url}
          />
        )}
      </Modal>
    </div>
  );
};

export default AdditionalDocument;
