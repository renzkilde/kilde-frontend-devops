import { Tooltip } from "antd";
import FileText from "../../../Assets/Images/SVGs/view_noa.svg";
import GlobalVariabels from "../../../Utils/GlobalVariabels";

const DownloadNOA = ({ item }) => {
  const handleViewPdf = (fileReference) => {
    const pdfUrl = `${GlobalVariabels.VIEW_IMG}/${fileReference}`;
    window.open(pdfUrl, "_blank");
  };
  return (
    <div>
      {item?.attachmentDetails !== null ? (
        <div className="acc-statementDoc-div">
          <Tooltip title="View">
            <img
              src={FileText}
              alt="FileText"
              className="cursor-pointer"
              onClick={() =>
                handleViewPdf(item?.attachmentDetails?.fileReference)
              }
            />
          </Tooltip>
          <p className="view-noa-text m-0">View NOA</p>
        </div>
      ) : (
        "-"
      )}
    </div>
  );
};

export default DownloadNOA;
