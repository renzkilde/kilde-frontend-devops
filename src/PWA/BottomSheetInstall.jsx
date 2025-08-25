import React, { useEffect, useState } from "react";
import { usePWAInstallPrompt } from "./usePWAInstallPrompt";
import { setInstallCooldown } from "./installCooldown";
import LogoIcon from "../Assets/Images/SVGs/logo-icon.svg";
import { CloseOutlined } from "@ant-design/icons";
import "./BottomSheetInstall.css";
import { Button } from "antd";

function BottomSheetInstall({ user }) {
  const { promptInstall, isSupported } = usePWAInstallPrompt();
  const [showModal, setShowModal] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstallAvailable, setIsInstallAvailable] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();

    const isIOSDevice =
      /iphone|ipad|ipod/.test(userAgent) &&
      /safari/.test(userAgent) &&
      !/chrome/.test(userAgent) &&
      !window.matchMedia("(display-mode: standalone)").matches;

    const isMobile = /android|iphone|ipad|ipod/.test(userAgent);
    const isDesktop = /macintosh|windows/.test(userAgent);

    setIsIOS(isIOSDevice);

    // Only allow install prompt on supported mobile devices
    if ((isSupported || isIOSDevice) && isMobile && !isDesktop) {
      setIsInstallAvailable(true);
    }
  }, [isSupported]);

  const handleInstall = async () => {
    const outcome = await promptInstall();
    setShowModal(false);
    if (outcome === "dismissed") {
      window?.dataLayer?.push({
        event: "pwa-install-cancelled",
        user_id: user,
        register_method: localStorage.getItem("registrationType"),
      });
      setInstallCooldown();
    } else {
      window?.dataLayer?.push({
        event: "pwa-installed",
        user_id: user,
        register_method: localStorage.getItem("registrationType"),
      });
    }
  };

  const handleClose = () => {
    setShowModal(false);
    window?.dataLayer?.push({
      event: "pwa-install-cancelled",
      user_id: user,
      register_method: localStorage.getItem("registrationType"),
    });
    setInstallCooldown();
  };

  useEffect(() => {
    const handleAppInstalled = () => {
      window?.dataLayer?.push({
        event: "pwa-installed",
        user_id: user,
        register_method: localStorage.getItem("registrationType"),
      });
    };
    window.addEventListener("appinstalled", handleAppInstalled);
    return () => window.removeEventListener("appinstalled", handleAppInstalled);
  }, [user]);

  if (!isInstallAvailable) return null;

  return (
    <>
      {/* Sticky Banner */}
      {!showModal && (
        <div
          className="sticky-install-banner"
          onClick={() => {
            setShowModal(true);
            window?.dataLayer?.push({
              event: "pwa-banner-clicked",
              user_id: user,
              register_method: localStorage.getItem("registrationType"),
            });
          }}
        >
          <div className="banner-left">
            <img src={LogoIcon} alt="App Icon" className="app-icon" />
            <div className="banner-text">
              <p className="install-title">Install Kilde App</p>
              <p className="install-subtitle">Add Kilde to your home screen</p>
            </div>
          </div>
          <i className="bx bxs-chevron-right banner-arrow" />
        </div>
      )}

      {/* Bottom Sheet Modal */}
      {showModal && (
        <div className="bottom-sheet-overlay" onClick={handleClose}>
          <div
            className="bottom-sheet"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sheet-header">
              <img src={LogoIcon} alt="App Icon" className="sheet-logo" />
              <CloseOutlined onClick={handleClose} className="close-icon" />
            </div>

            <div className="text-content">
              <h3>Add Kilde to your Home Screen</h3>
              <p>
                The easiest way to stay on top of <br /> your investments
              </p>
            </div>

            {isIOS ? (
              <div className="ios-instructions">
                <p>iOS doesn’t allow direct install buttons.</p>
                <ol>
                  <li>
                    Open <strong>app.kilde.sg</strong> in Safari.
                  </li>
                  <li>
                    Tap the <strong>Share icon</strong> (square with arrow).
                  </li>
                  <li>
                    Tap <strong>“Add to Home Screen”</strong>.
                  </li>
                  <li>
                    Tap <strong>Add</strong> -- the Kilde icon will appear on
                    your home screen.
                  </li>
                </ol>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    style={{
                      width: "150px",
                      marginTop: 10,
                      borderRadius: "10px",
                    }}
                    type="default"
                    onClick={handleClose}
                  >
                    Close
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button type="link" style={{ color: "#aaa" }}>
                    Cancel
                  </Button>
                  <button onClick={handleInstall} className="install-btn">
                    Add Shortcut
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default BottomSheetInstall;
