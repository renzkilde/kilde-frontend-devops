import { Skeleton } from "antd";
import React, { useState } from "react";

const ReferralVideo = () => {
  const [loading, setLoading] = useState(true);

  const videoUrl = "https://www.youtube.com/embed/rddaUjltwvg";
  const title = "Kilde referral program video";

  const handleIframeLoad = () => {
    setLoading(false);
  };

  return (
    <div className="mt-16">
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "500px",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        {loading && (
          <Skeleton.Button
            active
            block
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "8px",
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 1,
            }}
          />
        )}

        <iframe
          src={videoUrl}
          title={title}
          onLoad={handleIframeLoad}
          allowFullScreen
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          style={{
            display: loading ? "none" : "block",
            width: "100%",
            height: "100%",
            borderRadius: "4px",
          }}
        />
      </div>
    </div>
  );
};

export default ReferralVideo;
