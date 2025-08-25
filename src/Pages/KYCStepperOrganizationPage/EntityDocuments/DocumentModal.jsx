import { Modal } from "antd";

const DocumentModal = ({ open, content, onClose, title }) => {
  let fileType;
  if (content.startsWith("data:")) {
    fileType = getFileTypeFromBase64(content);
  } else {
    fileType = content && content.split(".").pop();
  }

  function getFileTypeFromBase64(content) {
    const matches = content.match(/^data:([A-Za-z-+/]+);base64/);
    if (matches && matches.length > 1) {
      return matches[1];
    }
    return null;
  }
  return (
    <Modal
      open={open}
      title={title}
      onCancel={onClose}
      footer={null}
      className="view-modal"
    >
      {(content && fileType === "application/pdf") || fileType === "pdf" ? (
        <iframe
          src={content}
          style={{ width: "100%", height: "500px" }}
          title="PDF Document"
        />
      ) : (content && fileType === "application/x-zip-compressed") ||
        fileType === "zip" ? (
        <div></div>
      ) : (
        <img src={content} alt="Document" style={{ maxWidth: "100%" }} />
      )}
    </Modal>
  );
};

export default DocumentModal;
