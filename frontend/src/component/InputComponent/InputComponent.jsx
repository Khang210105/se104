import React from "react";
import {Input} from "antd";
const InputComponent = ({size, placeholder, bordered, style, ...rests}) => {
    return(
        <Input 
                size={size}
                placeholder = {placeholder}
                style = {style}
                {...rests}
            />
    )
}

export default InputComponent