import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

// Tạo icon loading với kích thước tùy chọn
const antIcon = <LoadingOutlined style={{ fontSize: 30, color: "#1890ff" }} spin />;

const Loading1 = ({ children, isPending = false, delay = 200 }) => {
    return (
        <Spin
            spinning={Boolean(isPending)}
            delay={delay}
            indicator={antIcon}
        >
            {children}
        </Spin>
    );
};

export default Loading1;
