import React, { useState, useEffect, useMemo } from "react";
import GeneralInfo from "./GeneralInfo";
import {
  generalInformation,
  gettingStarted,
  // verificationAndSecurity,
  investing,
  autoInvest,
  taxation,
  loginSecurityBasics,
  withholdingTaxFaq,
  highlightMatch,
  marketMakerFaq,
} from "../../Utils/Reusables";

const RenderHelpDeskComponent = ({ tab, searchValue, setTab }) => {
  const [expandedKeys, setExpandedKeys] = useState({
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
  });

  const allInformation = useMemo(
    () => [
      { key: 1, title: "General Information", data: generalInformation },
      { key: 2, title: "Getting Started", data: gettingStarted },
      { key: 3, title: "Investing", data: investing },
      { key: 4, title: "Auto-investment", data: autoInvest },
      { key: 5, title: "Login & Security Basics", data: loginSecurityBasics },
      { key: 6, title: "Withholding Tax", data: withholdingTaxFaq },
      { key: 7, title: "Market Maker", data: marketMakerFaq },
    ],
    []
  );

  useEffect(() => {
    if (!searchValue) {
      setTab(1);
    }
  }, [searchValue, setTab]);

  const globalSearchResults = useMemo(() => {
    return allInformation?.map((section) => ({
      key: section.key,
      title: section.title,
      data: section.data
        .filter((item) => {
          const descriptionText = item.description.toLowerCase();
          return (
            item.header.toLowerCase().includes(searchValue.toLowerCase()) ||
            descriptionText.includes(searchValue.toLowerCase())
          );
        })
        .map((item) => ({
          ...item,
          header: highlightMatch(item.header, searchValue),
          description: highlightMatch(item.description, searchValue),
        })),
    }));
  }, [searchValue, allInformation]);

  useEffect(() => {
    if (searchValue) {
      const newExpandedKeys = {};

      allInformation.forEach((section) => {
        const hasMatch = section.data.some((item) => {
          const descriptionText = item.description.toLowerCase();
          return (
            item.header.toLowerCase().includes(searchValue.toLowerCase()) ||
            descriptionText.includes(searchValue.toLowerCase())
          );
        });

        if (hasMatch) {
          newExpandedKeys[section.key] = section.data.map((_, index) => index);
        } else {
          newExpandedKeys[section.key] = [];
        }
      });
      setExpandedKeys((prevKeys) => {
        const keysChanged = Object.keys(newExpandedKeys).some(
          (key) =>
            JSON.stringify(newExpandedKeys[key]) !==
            JSON.stringify(prevKeys[key])
        );

        if (keysChanged) {
          return { ...prevKeys, ...newExpandedKeys };
        }

        return prevKeys;
      });
    }
  }, [searchValue, allInformation]);

  const handleExpand = (tabKey, newExpandedKeys) => {
    setExpandedKeys((prevKeys) => ({
      ...prevKeys,
      [tabKey]: newExpandedKeys,
    }));
  };

  const renderComponent = () => {
    if (searchValue) {
      // Render global search results
      return globalSearchResults.map((section) =>
        section.data.length > 0 ? (
          <GeneralInfo
            key={section.key}
            information={section.data}
            title={section.title}
            expandedKeys={expandedKeys[section.key]}
            onExpand={(keys) => handleExpand(section.key, keys)}
            searchValue={searchValue}
          />
        ) : null
      );
    }

    // Default tab-specific rendering
    switch (tab) {
      case 1:
        return (
          <GeneralInfo
            information={generalInformation}
            title="General Information"
            expandedKeys={expandedKeys[1]}
            onExpand={(keys) => handleExpand(1, keys)}
            searchValue={searchValue}
          />
        );
      case 2:
        return (
          <GeneralInfo
            information={gettingStarted}
            title="Getting Started"
            expandedKeys={expandedKeys[2]}
            onExpand={(keys) => handleExpand(2, keys)}
            searchValue={searchValue}
          />
        );
      case 3:
        return (
          <GeneralInfo
            information={investing}
            title="Investing"
            expandedKeys={expandedKeys[3]}
            onExpand={(keys) => handleExpand(3, keys)}
            searchValue={searchValue}
          />
        );
      case 4:
        return (
          <GeneralInfo
            information={autoInvest}
            title="Auto-investment"
            expandedKeys={expandedKeys[4]}
            onExpand={(keys) => handleExpand(4, keys)}
            searchValue={searchValue}
          />
        );
      case 5:
        return (
          <GeneralInfo
            information={loginSecurityBasics}
            title="Login & Security Basics"
            expandedKeys={expandedKeys[6]}
            onExpand={(keys) => handleExpand(6, keys)}
            searchValue={searchValue}
          />
        );
      case 6:
        return (
          <GeneralInfo
            information={withholdingTaxFaq}
            title="Withholding Tax"
            expandedKeys={expandedKeys[7]}
            onExpand={(keys) => handleExpand(7, keys)}
            searchValue={searchValue}
          />
        );
      case 7:
        return (
          <GeneralInfo
            information={marketMakerFaq}
            title="Market Maker"
            expandedKeys={expandedKeys[8]}
            onExpand={(keys) => handleExpand(8, keys)}
            searchValue={searchValue}
          />
        );
      default:
        return (
          <div style={{ padding: "20px", textAlign: "center" }}>
            <h3>No Content Available</h3>
            <p>Please select a valid tab to view the content.</p>
          </div>
        );
    }
  };

  return <div>{renderComponent()}</div>;
};

export default RenderHelpDeskComponent;
