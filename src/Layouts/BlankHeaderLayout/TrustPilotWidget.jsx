import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const TrustPilotWidget = () => {
  const location = useLocation();
  const widgetRef = useRef(null);

  useEffect(() => {
    const existingScript = document.querySelector(
      'script[src="https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"]'
    );
    if (!existingScript) {
      const script = document.createElement("script");
      script.src =
        "https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js";
      script.async = true;
      script.onload = () => {
        // Reinitialize the Trustpilot widget after the script loads
        if (window.Trustpilot && widgetRef.current) {
          window.Trustpilot.loadFromElement(widgetRef.current);
        }
      };
      document.body.appendChild(script);
    } else {
      // If the script is already in the document, just load the widget
      if (window.Trustpilot && widgetRef.current) {
        window.Trustpilot.loadFromElement(widgetRef.current);
      }
    }
  }, [location]);

  return (
    <div
      className="trustpilot-widget"
      ref={widgetRef}
      data-locale="en-US"
      data-template-id="53aa8807dec7e10d38f59f32"
      data-businessunit-id="64d285016570bb5b3274ee30"
      data-style-height="80px"
      data-style-width="100%"
      data-theme="dark"
      style={{
        position: "relative",
        display: "inline-block",
        width: "fit-content",
        maxWidth: "90%",
      }}
    >
      <a
        href="https://www.trustpilot.com/review/kilde.sg"
        target="_blank"
        rel="noopener noreferrer"
      >
        Trustpilot
      </a>
    </div>
  );
};

export default TrustPilotWidget;
