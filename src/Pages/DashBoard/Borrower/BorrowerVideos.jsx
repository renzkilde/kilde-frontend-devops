import { Col } from "antd";
import React from "react";

const Document = ({ TrancheRes }) => {
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const match = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/[^\/]+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    return match ? match[1] : null;
  };

  const videoId = getYouTubeVideoId(TrancheRes?.borrower?.youtubeVideoLink);

  return (
    <Col xs={24} sm={24} md={24} lg={24} className="medium-doc-col">
      <p className="mt-0 tranch-head">Videos</p>

      {videoId !== null ? (
        <div
          style={{
            position: "relative",
            paddingBottom: "56.25%",
            height: 0,
            overflow: "hidden",
            width: "100%",
          }}
        >
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              borderRadius: "8px",
            }}
            className="borrower-video-iframe"
          ></iframe>
        </div>
      ) : (
        <p className="mt-16 no-data-text">No video available at the moment. </p>
      )}
    </Col>
  );
};

export default Document;
