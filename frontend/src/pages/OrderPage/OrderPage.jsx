import {Checkbox} from 'antd'
import React, {useState} from 'react'
import { WrapperCountOrder, WrapperInfo, WrapperItemOrder, WrapperLeft, WrapperListOrder, WrapperPriceDiscount } from './style'
import { WrapperRight, WrapperStyleHeader, WrapperTotal, WrapperInputNumber } from './style'
import {DeleteOutlined, MinusOutlined, PlusOutlined} from '@ant-design/icons'
import image from '../../assets/images/image.webp'
import ButtonComponent from '../../component/ButtonComponent/ButtonComponent'
import {useDispatch, useSelector} from 'react-redux'
import { decreaseAmount, increaseAmount, removeAllOrderProduct, removeOrderProduct } from '../../redux/slides/orderSlide'

const OrderPage = () => {
    const order = useSelector((state) => state.order)
    const [listChecked, setListChecked] = useState([])
    const dispatch = useDispatch()
    const onChange = (e) => {
        if(listChecked.includes(e.target.value)){
            const newListChecked = listChecked.filter((item) => item !== e.target.value)
            setListChecked(newListChecked)
        }
        else {
            setListChecked([...listChecked, e.target.value])
        }
    };

    const handleChangeCount = (type, idProduct) => {
        if(type === 'increase'){
            dispatch(increaseAmount({idProduct}))
        }
        else{
            dispatch(decreaseAmount({idProduct}))
        }
    }
    const handleDeleteOrder = (idProduct) => {
        dispatch(removeOrderProduct({idProduct}))
    }

    const handleOnchangeCheckAll = (e) => {
        if(e.target.checked){
            const newListChecked = []
            order?.orderItems?.forEach((item) => {
                newListChecked.push(item?.product)
            })
            setListChecked(newListChecked)
        }
        else{
            setListChecked([])
        }
    }
    const handleRemoveAllOrder = () => {
        if(listChecked?.length > 1){
            dispatch(removeAllOrderProduct(listChecked))
        }
    }
    return (
        <div style={{background: '#f5f5fa', width: '100%', height: '100vh'}}>
            <div style={{width: '1270px', height: '100%', margin: '0 auto'}}>
                <h3>Giỏ hàng</h3>
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <WrapperLeft>
                        <WrapperStyleHeader>
                            <span style={{display: 'inline-block', width: '390px'}}>
                                <Checkbox onChange={handleOnchangeCheckAll} checked={listChecked?.length === order?.orderItems?.length}  ></Checkbox>
                                <span> Tất cả ({order?.orderItems?.length} sản phẩm)</span>
                            </span>
                            <div style={{flex: 1, display:'flex', alignItems: 'center', justifyContent:'center'}}>
                                <span>Đơn giá</span>
                                <span>Số lượng</span>
                                <span>Thành tiên</span>
                                <DeleteOutlined style={{cursor: 'pointer'}} onClick={handleRemoveAllOrder} />
                            </div>
                        </WrapperStyleHeader>
                        <WrapperListOrder>
                            {order?.orderItems?.map((order) => {
                                return(
                                    <WrapperItemOrder>
                                        <div style={{width: '390px', display: 'flex', alignItems:'center', gap: 4}}>
                                            <Checkbox onChange={onChange} value={order?.product} checked={listChecked.includes(order?.product)} ></Checkbox>
                                            <img src={order?.image} alt="" style={{width: '77px', height: '79px', objectFit: 'cover'}} />
                                            <div style={{
                                                width: 260,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}>{order?.name}</div>
                                        </div>
                                        <div style={{flex: 1, display:'flex', alignItems:'center', justifyContent: 'space-between'}}>
                                            <span>
                                                <span style={{fontSize:'13px', color:'#242424'}}> {order?.price} </span>
                                                <WrapperPriceDiscount>
                                                    {order?.amount}
                                                </WrapperPriceDiscount>
                                            </span>
                                            <WrapperCountOrder>
                                            <button style={{border:'none', background: 'transparent', cursor: 'pointer'}} onClick={() => handleChangeCount('decrease', order?.product)} >
                                                    <MinusOutlined style= {{color: '#000', fontSize:'10px'}} />
                                                </button>
                                                <WrapperInputNumber defaultValue={order?.amount} value={order?.amount} size='small' />
                                                <button style={{border:'none', background: 'transparent', cursor: 'pointer'}} onClick={() => handleChangeCount('increase', order?.product)} >
                                                    <PlusOutlined style= {{color: '#000', fontSize:'10px'}} />
                                                </button >
                                            </WrapperCountOrder>
                                            <span style={{color:'rgb(255, 66, 78)', fontSize:'13px', fontWeight: 500}}> {order?.price * order?.amount} </span>
                                            <DeleteOutlined style={{cursor:'pointer'}} onClick={() => handleDeleteOrder(order?.product)} />
                                        </div>
                                    </WrapperItemOrder>
                                )
                            })}
                        </WrapperListOrder>
                    </WrapperLeft>
                    <WrapperRight>
                        <div style={{width:'100%'}}>
                            <WrapperInfo>
                                <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                                    <span>Tạm tính</span>
                                    <span style={{color:'#000', fontSize:'14px', fontWeight:'bold'}}></span>
                                </div>
                                <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                                    <span>Giảm giá</span>
                                    <span style={{color:'#000', fontSize:'14px', fontWeight:'bold'}}></span>
                                </div>
                                <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                                    <span>Thuế</span>
                                    <span style={{color:'#000', fontSize:'14px', fontWeight:'bold'}}></span>
                                </div>
                                <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                                    <span>Phí giao hàng</span>
                                    <span style={{color:'#000', fontSize:'14px', fontWeight:'bold'}}></span>
                                </div>
                            </WrapperInfo>
                            <WrapperTotal>

                            </WrapperTotal>
                        </div>
                    </WrapperRight>
                </div>
            </div>
        </div>
    )
}

export default OrderPage