import React from "react";

import { Collapse } from "antd";

import plus_collapse from "../../Assets/Images/plus_collapse.svg";
import minus_collapse from "../../Assets/Images/minus_collapse.svg";

const { Panel } = Collapse;

const GeneralInfo = ({
  information,
  title,
  expandedKeys,
  onExpand,
  searchValue,
}) => {

  const getTextFromHTMLString = (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    return doc.body.textContent || "";
  };

  const filteredInformation = information.filter((item) => {
    const headerText = getTextFromHTMLString(item.header).toLowerCase();
    const descriptionText = getTextFromHTMLString(
      item.description
    ).toLowerCase();
    const search = searchValue.toLowerCase();

    return headerText.includes(search) || descriptionText.includes(search);
  });

  return (
    <div>
      <Collapse
        className="help-desk-collapse"
        bordered={false}
        activeKey={expandedKeys}
        onChange={(keys) => onExpand(keys)}
        expandIcon={({ isActive }) =>
          isActive ? (
            <img src={minus_collapse} alt="minus_collapse" />
          ) : (
            <img src={plus_collapse} alt="plus_collapse" />
          )
        }
        items={filteredInformation.map((item, index) => ({
          key: index,
          label: (
            <div
              className="helpdesk-header"
              dangerouslySetInnerHTML={{
                __html: item.header,
              }}
            />
          ),
          children: (
            <p
              className="helpdesk-description"
              dangerouslySetInnerHTML={{
                __html: item.description,
              }}
            />
          ),
        }))}
      />
    </div>
  );
};

export default GeneralInfo;
