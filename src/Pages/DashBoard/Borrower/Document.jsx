import React, { useState } from "react";

import Download_icon from "../../../Assets/Images/download_icon.svg";
import View_icon from "../../../Assets/Images/view_icon.svg";
import Down_blue_arrow from "../../../Assets/Images/Icons/down_blue_arrow.svg";

import Borrower_pdf from "../../../Assets/Images/borrower_pdf.svg";
import { Button, Col, Row, Spin, Tooltip } from "antd";
import GlobalVariabels from "../../../Utils/GlobalVariabels";
import axios from "axios";
import { getFilenameDetails } from "../../../Utils/Reusables";
import { LoadingOutlined } from "@ant-design/icons";

const Document = ({ TrancheRes }) => {
  const [downloadingFile, setDownloadingFile] = useState({});
  const [visibleAttachments, setVisibleAttachments] = useState(3);
  const [expanded, setExpanded] = useState(false);

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

  const handleMoreVideos = () => {
    if (expanded) {
      setVisibleAttachments(3);
    } else {
      setVisibleAttachments(TrancheRes?.attachments?.length || 2); // Show all
    }
    setExpanded(!expanded);
  };

  return (
    <Col xs={24} sm={24} md={24} lg={24} className="medium-doc-col">
      <p className="mt-0 tranch-head">Documents</p>
      <Row>
        {TrancheRes?.attachments?.length > 0
          ? TrancheRes?.attachments
              ?.slice(0, visibleAttachments)
              .map((file, index) => (
                <React.Fragment key={index}>
                  <Col xs={18} lg={18}>
                    <div className="mb-4 mt-0 borrower-info-tag">
                      <div className="borrower-pdf-div">
                        <div>
                          <img src={Borrower_pdf} alt="pdf_icon" />
                        </div>
                        <div>
                          <Tooltip title={file.fileName}>
                            <p className="m-0">
                              {getFilenameDetails(file.fileName)}
                            </p>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col xs={6} lg={6} className="sb-justify-end-item-center">
                    <div className="borrower-pdf-div">
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
                        {downloadingFile[file.fileReference] ? (
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
        {!expanded && TrancheRes?.attachments?.length > 3 ? (
          <Button className="show-all" onClick={handleMoreVideos}>
            Show More{" "}
            <img src={Down_blue_arrow} alt="down_blue_arrow" className="ml-4" />
          </Button>
        ) : null}
      </Row>
    </Col>
  );
};

export default Document;
