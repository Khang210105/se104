import React from "react";
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

const Loading = ({ children, isPending, delay = 0 }) => {
    return (
        <Spin
            spinning={isPending} 
            delay={delay}
        >
            {children}
        </Spin>
    );
};

export default Loading;
