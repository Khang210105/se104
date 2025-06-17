import React, {  useState } from "react";
import {Row, Col, Image, Rate} from 'antd';
import { WrapperStyleNameProduct, WrapperStyleTextSell} from './style';
import { PlusOutlined, MinusOutlined, ShoppingCartOutlined, CheckCircleOutlined} from '@ant-design/icons';
import {WrapperQualityProduct, WrapperInputNumber} from './style';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import * as ProductService from '../../services/ProductService';
import { useQuery } from "@tanstack/react-query";
import Loading1 from "../LoadingComponent/Loading1";
import {useDispatch, useSelector} from 'react-redux'
import {useLocation, useNavigate} from 'react-router-dom'
import { addOrderProduct } from "../../redux/slides/orderSlide";
import { convertPrice } from "../../untils";

const ProductDetailsComponent = ({idProduct}) => {
    const [numProduct, setNumProduct] = useState(1)
    const user = useSelector((state) => state.user)
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const onChange = (value) => {
        setNumProduct(Number(value))
    }
    const fetchGetDetailsProduct = async (context) => {
        const id = context?.queryKey && context?.queryKey[1]
        if (id){
            const res = await ProductService.getDetailsProduct(id)
            return res.data
        }
    }

    const handleChangeCount = (type) => {
    if (type === 'increase') {
        setNumProduct(numProduct + 1);
    } else {
        setNumProduct(prev => Math.max(1, prev - 1));
    }
};

    const handleAddOrderProduct = () => {
        if(!user?.id){
            navigate('/sign-in', {state: location?.pathname})
        }
        else {
            dispatch(addOrderProduct({
                orderItem: {
                    name: productDetails?.name,
                    amount: numProduct,
                    image: productDetails?.image,
                    price: productDetails?.price,
                    product: productDetails?._id,
                    discount: productDetails?.discount,
                    countInStock: productDetails?.countInStock,
                }
            }))
        }
    }

    const { isPending, data: productDetails } = useQuery({
        queryKey: ['product-details', idProduct],
        queryFn: ({ queryKey }) => fetchGetDetailsProduct({ queryKey }),
        enabled: !!idProduct,
    });

    // useEffect(() => {
    //     if (productDetails) {
    //         console.log('productDetails', productDetails);
    //     }
    // }, [productDetails]);

    return(
        <Loading1 isPending={isPending}>
            <Row style={{padding:'16px', background:'#fff', borderRadius:'4px'}}>
                <Col span={10} style={{borderRight:'1px solid #e5e5e5', paddingRight:'8px'}}>
                    <Image src={productDetails?.image} alt='image-product' preview={false} />
                </Col>
                <Col span={14} style={{paddingLeft:'10px'}}>
                    <WrapperStyleNameProduct> {productDetails?.name} </WrapperStyleNameProduct>
                    
                    <div style={{ marginTop: 12 }}>
    <Rate allowHalf defaultValue={productDetails?.rating} value={productDetails?.rating} />
    <WrapperStyleTextSell />
                <div style={{ 
                    background: '#f5f5f5', 
                    borderRadius: 8, 
                    padding: '8px 12px', 
                    margin: '8px 0', 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 14,
                    color: '#333' 
                }}>
                    <ShoppingCartOutlined style={{ color: '#1890ff' }} />
                    Đã bán: {productDetails?.selled}
                </div>
                
                <div style={{ 
                    background: '#f5f5f5', 
                    borderRadius: 8, 
                    padding: '8px 12px', 
                    margin: '8px 0', 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 14,
                    color: '#333' 
                }}>
                    <CheckCircleOutlined style={{ color: '#52c41a' }} />
                    Tình trạng: {productDetails?.description}
                </div>
            </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0' }}>
                        <span style={{ fontSize: 16, color: '#555' }}>Giá niêm yết:</span>
                        <span style={{
                            fontSize: 20,
                            fontWeight: 'bold',
                            color: '#ff4d4f',
                            backgroundColor: '#fff1f0',
                            padding: '4px 8px',
                            borderRadius: 6,
                        }}>
                            {convertPrice(productDetails?.price)}
                        </span>
                    </div>
                    <div style={{margin:'10px 0 20px', padding:'10px 0' , borderTop:'1px solid #e5e5e5', borderBottom:'1px solid #e5e5e5'}}>
                        <div style={{marginBottom:'10px', fontSize:'16px'}}>Số lượng</div>
                        <WrapperQualityProduct>
                            <button style={{border:'none', background: 'transparent', cursor: 'pointer'}} onClick={() => handleChangeCount('decrease')} >
                                <MinusOutlined style= {{color: '#000', fontSize:'20px'}} />
                            </button>
                            <WrapperInputNumber min={1} onChange={onChange} defaultValue={1} value={numProduct} size='small' />
                            <button style={{border:'none', background: 'transparent', cursor: 'pointer'}} onClick={() => handleChangeCount('increase')} >
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
                            onClick={handleAddOrderProduct}
                            textButton={'Chọn mua'}
                            styleTextButton={{color: '#fff', fontSize: '16px', fontWeight: '700'}}>
                        </ButtonComponent>
                    </div>
                </Col>
            </Row>
        </Loading1>
    )
}

export default ProductDetailsComponent