import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import React from "react";

const SingpassLoader = () => {
    return (
        <div className="sb-onboarding-form-container">
            <div className="loading-text">
                <Spin
                    indicator={
                        <LoadingOutlined style={{ fontSize: 40, color: "var(--kilde-blue)" }} />
                    }
                    spinning={true}
                ></Spin>
                <h2>Fetching information. Please wait...</h2>
            </div>
        </div>
    );
};

export default SingpassLoader;
