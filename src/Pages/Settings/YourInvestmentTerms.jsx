import React, { useEffect, useState } from "react";
import DashboardLayout from "../../Layouts/DashboardLayout/DashboardLayout";
import { Content } from "antd/es/layout/layout";
import { Breadcrumb, Col, Row, Spin } from "antd";
import ROUTES from "../../Config/Routes";
import { useLocation, useNavigate } from "react-router-dom";
import Download_icon from "../../Assets/Images/download_icon.svg";
import View_icon from "../../Assets/Images/view_icon.svg";
import Borrower_pdf from "../../Assets/Images/borrower_pdf.svg";
import GlobalVariabels from "../../Utils/GlobalVariabels";
import axios from "axios";
import { LoadingOutlined } from "@ant-design/icons";
import { getNoteOfAcceptance } from "../../Apis/UserApi";

const YourInvestmentTerms = () => {
  const navigate = useNavigate();
  const [downloadingFile, setDownloadingFile] = useState({});
  const location = useLocation();
  const { noteOfAcceptance } = location.state || {};

  const [noteofAcceptanceresponses, setNoteofAcceptanceResponses] = useState(
    noteOfAcceptance || []
  );

  useEffect(() => {
    if (location.state?.fromAccountStatement) {
      getYourInvestmentTerm("NOTE_OF_ACCEPTANCE");
    }
  }, [location.state?.fromAccountStatement]);

  const getYourInvestmentTerm = async (data) => {
    try {
      const response = await getNoteOfAcceptance(data);
      if (response && Array.isArray(response)) {
        setNoteofAcceptanceResponses((prev) => [...prev, ...response]);
      } else {
        console.warn("Unexpected response format:", response);
      }
    } catch (error) {
      console.error("Failed to fetch note of acceptance:", error);
    }
  };

  const handleView = (file) => {
    window.open(`${GlobalVariabels.VIEW_IMG}/${file}`, "_blank");
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
                title: "Note of acceptance",
              },
            ]}
          />

          <Col
            xs={24}
            sm={24}
            md={18}
            lg={17}
            xl={13}
            xxl={10}
            className="medium-doc-col"
          >
            <p className="setting-head">Note of Acceptance</p>
            <Row className="note-of-acceptance-main">
              {noteofAcceptanceresponses?.length > 0
                ? noteofAcceptanceresponses?.map((file, index) => (
                    <React.Fragment>
                      <Col xs={18} lg={18}>
                        <div className="mb-4 mt-0 borrower-info-tag">
                          <div className="note-of-acceptance-div">
                            <div>
                              <img src={Borrower_pdf} alt="pdf_icon" />
                            </div>
                            <div>
                              <p
                                className="m-0"
                                style={{ wordBreak: "break-all" }}
                              >
                                {file.fileName}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Col>
                      <Col xs={6} lg={6} className="sb-justify-end-item-center">
                        <div className="note-of-acceptance-div">
                          <div
                            onClick={() => handleView(file?.fileReference)}
                            className="cursor-pointer"
                          >
                            <img src={View_icon} alt="view_icon" />
                          </div>
                          <div
                            onClick={() =>
                              handleDownload(file?.fileReference, file.fileName)
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
                  ))
                : "No Document Found"}
            </Row>
          </Col>
        </Content>
      </DashboardLayout>
    </div>
  );
};

export default YourInvestmentTerms;
