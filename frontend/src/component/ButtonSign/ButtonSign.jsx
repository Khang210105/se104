import React from "react";
import {Button} from "antd";

const ButtonSign = ({size, styleButton, styleTextButton, textButton, disabled, ...rests}) => {
    return(
        <Button
            style={{
                ...styleButton,
                background: disabled ? 'rgb(140, 130, 130)' : styleButton.background
            }}
            size={size}
            {...rests}
        >
            <span style={styleTextButton}>{textButton}</span>
        </Button>
    )
}

export default ButtonSign