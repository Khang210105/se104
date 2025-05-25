import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

// Tạo icon loading với kích thước tùy chọn
const antIcon = <LoadingOutlined style={{ fontSize: 30, color: "#1890ff" }} spin />;

const Loading1 = ({ children, isLoading, delay }) => {
    return (
        <Spin
            spinning={isLoading}
            delay={delay}
            indicator={antIcon}
        >
            {children}
        </Spin>
    );
};

export default Loading1;
