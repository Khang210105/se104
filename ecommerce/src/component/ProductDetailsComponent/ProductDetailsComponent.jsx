import React from "react";
import {Row, Col, Image} from 'antd';
import {WrapperStyleImageSmall, WrapperStyleColImage, WrapperStyleNameProduct, WrapperStyleTextSell, WrapperPriceProduct} from './style';
import imageProduct from '../../assets/images/samsung_monitor.webp';
import imagesmall from '../../assets/images/cpu_ultra9.webp';
import {StarFilled, PlusOutlined, MinusOutlined} from '@ant-design/icons';
import {WrapperPriceText, WrapperAddressProduct, WrapperQualityProduct, WrapperInputNumber,WrapperBtnQualityProduct} from './style';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import { InputNumber } from 'antd';

const ProductDetailsComponent = () => {
    const onChange = () => {}
    return(
        <Row style={{padding:'16px', background:'#fff', borderRadius:'4px'}}>
            <Col span={10} style={{borderRight:'1px solid #e5e5e5', paddingRight:'8px'}}>
                <Image src={imageProduct} alt='image-product' preview={false} />
                <Row style={{paddingTop:'10px', justifyContent:'space-between'}}>
                    <WrapperStyleColImage span={4}>
                        <WrapperStyleImageSmall src={imagesmall} alt='image' preview={false} />
                    </WrapperStyleColImage>

                    <WrapperStyleColImage span={4}>
                        <WrapperStyleImageSmall src={imagesmall} alt='image' preview={false} />
                    </WrapperStyleColImage>

                    <WrapperStyleColImage span={4}>
                        <WrapperStyleImageSmall src={imagesmall} alt='image' preview={false} />
                    </WrapperStyleColImage>

                    <WrapperStyleColImage span={4}>
                        <WrapperStyleImageSmall src={imagesmall} alt='image' preview={false} />
                    </WrapperStyleColImage>

                    <WrapperStyleColImage span={4}>
                        <WrapperStyleImageSmall src={imagesmall} alt='image' preview={false} />
                    </WrapperStyleColImage>

                    <WrapperStyleColImage span={4}>
                        <WrapperStyleImageSmall src={imagesmall} alt='image' preview={false} />
                    </WrapperStyleColImage>
                    
                </Row>
            </Col>
            <Col span={14} style={{paddingLeft:'10px'}}>
                <WrapperStyleNameProduct>Màn hình Samsung LS27FG812SEXXV 27" (4K UHD 3840 x 2160/ OLED/ 240Hz/ 0.03 ms)</WrapperStyleNameProduct>
                <div>
                    <StarFilled style={{fontSize:'10px', color: 'rgb(253, 216, 54)'}} />
                    <StarFilled style={{fontSize:'10px', color: 'rgb(253, 216, 54)'}} />
                    <StarFilled style={{fontSize:'10px', color: 'rgb(253, 216, 54)'}} />
                    <StarFilled style={{fontSize:'10px', color: 'rgb(253, 216, 54)'}} />
                    <StarFilled style={{fontSize:'10px', color: 'rgb(253, 216, 54)'}} />
                    <WrapperStyleTextSell> | Đã bán 1000+</WrapperStyleTextSell>
                </div>
                <WrapperPriceProduct>
                    <WrapperPriceText>32.990.000 Đ</WrapperPriceText>
                </WrapperPriceProduct>

                <WrapperAddressProduct>
                    <span>Giao đến </span>
                    <span className='address'>65/4 Tăng Nhơn Phú, PLB, Tp Thủ Đức</span> - 
                    <span className='change-address'>Đổi địa chỉ</span>
                </WrapperAddressProduct>

                <div style={{margin:'10px 0 20px', padding:'10px 0' , borderTop:'1px solid #e5e5e5', borderBottom:'1px solid #e5e5e5'}}>
                    <div style={{marginBottom:'10px'}}>Số lượng</div>
                    <WrapperQualityProduct>
                        <button style={{border:'none', background: 'transparent'}}>
                            <MinusOutlined style= {{color: '#000', fontSize:'20px'}} />
                        </button>
                        <WrapperInputNumber min={1} defaultValue={1} onChange={onChange} size='small' />
                        <button style={{border:'none', background: 'transparent'}}>
                            <PlusOutlined style= {{color: '#000', fontSize:'20px'}} />
                        </button >
                    </WrapperQualityProduct>
                </div>
                <div style={{display: 'flex', alignItems:'center', gap:'12px'}}>
                    <ButtonComponent
                        
                        size={40}
                        styleButton = {{
                            backgroundColor: 'rgb(255, 57, 69)',
                            height:'48px',
                            width: '220px',
                            border: 'none',
                            borderRadius: '4px',
                        }}
                        textButton={'Chọn mua'}
                        styleTextButton={{color: '#fff', fontSize: '15px', fontWeight: '700'}}>
                    </ButtonComponent>

                    <ButtonComponent
                        
                        size={40}
                        styleButton = {{
                            backgroundColor: '#fff',
                            height:'48px',
                            width: '220px',
                            border: '1px solid rgb(13, 92, 182)',
                            borderRadius: '4px',
                        }}
                        textButton={'Mua trước trả sau'}
                        styleTextButton={{color: 'rgb(13, 92, 182)', fontSize: '15px'}}>
                    </ButtonComponent>
                </div>
            </Col>
        </Row>
    )
}

export default ProductDetailsComponent