import React, { useEffect, useState } from "react";
import DashboardLayout from "../../Layouts/DashboardLayout/DashboardLayout";
import Search_icon from "../../Assets/Images/search_icon.svg";

import "./style.css";
import RenderHelpDeskComponent from "./RenderHelpDeskComponent";
import InputDefault from "../../Components/InputDefault/InputDefault";
import { Divider, Select } from "antd";
import { helpDeskItems } from "../../Utils/Reusables";
import HelpDeskVideoCarousel from "./HelpDeskVideoCarousel";
import { useLocation } from "react-router-dom";

const HelpDeskPage = () => {
  const location = useLocation();
  const [tab, setTab] = useState(helpDeskItems[0]?.value);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    if (location.state && location.state.tab) {
      setTab(location.state.tab);
    }
  }, [location]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    // Reset the active tab if there's a search value
    if (value.trim() !== "") {
      setTab(null);
    }
  };

  const handleChange = (value) => {
    setTab(value);

    // Clear search value when a tab is selected
    if (searchValue) {
      setSearchValue("");
    }
  };

  return (
    <DashboardLayout>
      <div>
        <div className="onboarding-main-div">
          {/* <OnboardingBanner /> */}
          <div className="help-desk-sub-main-div">
            <div className="stepper-left-sidebar">
              <div className="help-desk-stepper-div">
                <div className="stepper-sub-div">
                  <p className="sb-verification-title-onboarding mt-0">
                    Help Center
                  </p>

                  <div className="help-desk-tab-main-div">
                    {helpDeskItems.map((tabData) => (
                      <div
                        key={tabData.value}
                        className={
                          tab === tabData.value
                            ? "help-desk-tab-active-div"
                            : "help-desk-tab-div"
                        }
                        onClick={() => {
                          setTab(tabData.value);
                          setSearchValue("");
                        }}
                      >
                        <img
                          src={
                            tab === tabData.value
                              ? tabData.activeIcon
                              : tabData.defaultIcon
                          }
                          alt={`${tabData.label}-icon`}
                        />
                        <p className="user-dropdown-link m-0">
                          {tabData.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="sb-stepper-progress-help-desk stepper-div media-stepper-margin">
              <div className="stepper-right">
                <div className="sb-verification-content-container">
                  <div className="sb-verification-title m-0 mb-24">
                    <div style={{ position: "relative" }}>
                      <InputDefault
                        type="text"
                        placeholder="Search"
                        name="search"
                        onChange={handleSearchChange}
                        value={searchValue}
                      />
                      <img
                        src={Search_icon}
                        alt="search"
                        style={{
                          position: "absolute",
                          top: 10,
                          right: 16,
                        }}
                      />
                    </div>
                  </div>
                  <div className="mb-24 hide-help-desk-desktop">
                    <Select
                      value={tab}
                      className="help-desk-select"
                      onChange={handleChange}
                      options={helpDeskItems.map((option) => ({
                        value: option.value,
                        label: (
                          <div className="help-desk-select-label">
                            <img
                              src={
                                tab === option.value
                                  ? option.activeIcon
                                  : option.defaultIcon
                              }
                              alt={`${option.label}-icon`}
                              style={{
                                marginRight: 8,
                                width: 20,
                                height: 20,
                              }}
                            />
                            <p className="help-desk-label">{option.label}</p>
                          </div>
                        ),
                      }))}
                    />
                  </div>

                  <div className="helpdesk-subdiv">
                    <RenderHelpDeskComponent
                      tab={tab}
                      searchValue={searchValue}
                      setTab={setTab}
                    />
                  </div>
                  <div className="footer-divider-div">
                    <Divider plain />
                  </div>
                  <div>
                    <HelpDeskVideoCarousel />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HelpDeskPage;
