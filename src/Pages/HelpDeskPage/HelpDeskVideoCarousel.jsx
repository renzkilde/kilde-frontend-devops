import React, { useState, useCallback, useRef } from "react";
import Right_black_arrow from "../../Assets/Images/right_black_arrow.svg";
import Left_black_arrow from "../../Assets/Images/ArrowLineLeft.svg";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import OwlCarousel from "react-owl-carousel";
import { Skeleton } from "antd";

const VideoWithLoader = React.memo(({ videoUrl, title }) => {
  const [loading, setLoading] = useState(true);

  const handleIframeLoad = useCallback(() => {
    setLoading(false);
  }, []);

  return (
    <div
      style={{
        borderRadius: "8px",
        overflow: "hidden",
        transition: "transform 0.3s ease-in-out",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "125px",
          borderRadius: "8px",
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
            borderRadius: "8px",
          }}
        />
      </div>
      <div style={{ padding: "8px" }}>
        <h3 style={{ fontSize: "14px", fontWeight: "600" }}>{title}</h3>
      </div>
    </div>
  );
});

const VideoCarousel = () => {
  const carouselRef = useRef(null);
  const videos = [
    {
      url: "https://www.youtube.com/embed/EuNPk8rzFb4",
      title: "Kilde platform introduction tour",
    },
    {
      url: "https://www.youtube.com/embed/ydao0Vj3ioI",
      title: "Kilde platform update",
    },  
    {
      url: "https://www.youtube.com/embed/qZGP8RxNRfs",
      title: "Are Kilde's Investees worth your Investment?",
    },
    {
      url: "https://www.youtube.com/embed/73OrYhI149A",
      title: "January 2025 highlights",
    },
    {
      url: "https://www.youtube.com/embed/-xmONFFBESU",
      title: "Kilde's Investor eligibility explained",
    },
  ];

  return (
    <div>
      <div className="sb-justify-center-item-center mb-16">
        <p className="fw-600 m-0">About Kilde</p>
      </div>

      <OwlCarousel
        ref={carouselRef}
        className="owl-theme"
        margin={10}
        nav
        navText={[
          `<img src=${Left_black_arrow} alt="left_arrow" />`,
          `<img src=${Right_black_arrow} alt="right_arrow" />`,
        ]}
        dots={false}
        responsive={{
          0: { items: 1 },
          600: { items: 2 },
          992: { items: 3 },
        }}
      >
        {videos.map((video) => (
          <VideoWithLoader
            key={video.url}
            videoUrl={video.url}
            title={video.title}
          />
        ))}
      </OwlCarousel>
    </div>
  );
};

export default VideoCarousel;
