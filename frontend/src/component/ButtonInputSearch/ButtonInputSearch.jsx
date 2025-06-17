import React from "react";
import {Button} from "antd";
import {SearchOutlined} from '@ant-design/icons';
import InputComponent from "../InputComponent/InputComponent";
import ButtonComponent from "../ButtonComponent/ButtonComponent";

const ButtonInputSearch = (props) => {
    const {
        size, placeholder, textButton, 
        bordered, backgroundColorInput='#fff', 
        backgroundColorButton='rgb(13,92,182)',
        ColorButton='#fff'
    } = props

    return(
        <div style={{display: 'flex',}}>
            <InputComponent 
                size={size}
                placeholder = {placeholder}
                style = {{backgroundColor: backgroundColorInput}}
                {...props}
            />
        </div>
    )
}

export default ButtonInputSearch