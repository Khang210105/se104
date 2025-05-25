import React from "react";
import {WrapperLableText, WrapperTextValue, WrapperContent, WrapperTextPrice} from './style'
import {Checkbox, Rate} from 'antd';

const NavbarComponent = () => {
    const onChange = () => { }
    const renderContent = (type, options) => {
        switch(type){
            case 'text':
                return options.map((option) => {
                        return(
                            <WrapperTextValue>{option}</WrapperTextValue>
                        )
                })
            case 'checkbox':
                return (
                    <Checkbox.Group style={{ width: '100%', display:'flex', flexDirection: 'column', gap: '12px' }} onChange={onChange}>
                        {options.map((option) => {
                            return(
                                <Checkbox value={option.value}>{option.label}</Checkbox>
                            )
                        })}
                        
                    </Checkbox.Group>
                )
            case 'star':
                return options.map((option) => {
                    return(
                        <div style={{display:'flex', gap:'4px'}}>
                            <Rate style={{fontSize:'12px'}} disabled defaultValue={option} />
                            <span> {`tu ${option} sao`}</span>
                        </div>
                    )
                })
            case 'price':
                return options.map((option) => {
                    return(
                        <WrapperTextPrice>{option}</WrapperTextPrice>
                    )
                })
            default:
                return {}
        }
    }
    return (
        <div>
            <WrapperLableText>Danh mục sản phẩm</WrapperLableText>
            <WrapperContent>
                {renderContent('text',['Tu lanh', 'TV', 'May giat'])}
            </WrapperContent>
        </div>
    )
}

export default NavbarComponent