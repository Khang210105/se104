import React from 'react'
import { Lable, WrapperInfo, WrapperContainer, WrapperValue, WrapperItemOrder, WrapperCountOrder, WrapperItemOrderInfo} from './style'
import Loading1 from '../../component/LoadingComponent/Loading1'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import {orderContant} from '../../contant'
import { convertPrice } from '../../untils'

const OrderSuccess = () => {
    const order = useSelector((state) => state.order)
    const location  = useLocation()
    const {state} = location
    console.log('state.order', state.order);
    return (
        <div style={{background: '#f5f5fa', width: '100%', height: '100vh'}}>
            <Loading1 isPending={false}>
                <div style={{width: '1270px', height: '100%', margin: '0 auto'}}>
                    <h3> Đơn hàng đã đặt thành công </h3>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <WrapperContainer>
                            <WrapperInfo>
                                <div>
                                    <Lable> Phương thức giao hàng </Lable>
                                    <WrapperValue>
                                        <span style={{color:'#ea8500', fontWeight: 'bold'}}> {orderContant.delivery[state?.delivery]} </span> GHTK
                                    </WrapperValue>
                                </div>
                            </WrapperInfo>
                            <WrapperInfo>
                                <div>
                                    <Lable> Phương thức thanh toán </Lable>
                                    <WrapperValue>
                                        {orderContant.payment[state?.payment]}
                                    </WrapperValue>
                                </div>
                            </WrapperInfo>
                            <WrapperInfo>
                                <WrapperItemOrderInfo>
                                {state.orders?.map((order) => {
                                    console.log('state', order);
                                    return(
                                        <WrapperItemOrder>
                                        <div style={{width: '500px', display: 'flex', alignItems:'center', gap: 4}}>
                                            <img src={order?.image} alt="" style={{width: '77px', height: '79px', objectFit: 'cover'}} />
                                            <div style={{
                                                width: 260,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                fontSize:'18px'
                                            }}>{order?.name}</div>
                                        </div>
                                        <div style={{flex: 1, display:'flex', alignItems:'center', gap:'10px'}}>
                                            <span>
                                                <span style={{fontSize:'13px', color:'#242424'}}> Giá tiền {convertPrice(order?.price)} </span>
                                            </span>
                                            <span>
                                                <span style={{fontSize:'13px', color:'#242424'}}> Số lượng {order?.amount} </span>
                                            </span>
                                            <span>
                                                <span style={{fontSize:'13px', color:'#242424'}}> Giảm giá {convertPrice((order?.price * order?.amount) * order?.discount / 100)} </span>
                                            </span>
                                        </div>
                                        </WrapperItemOrder>
                                        )
                                    })}
                                </WrapperItemOrderInfo>
                                <div>
                                    <span style={{fontSize:'13px', color:'red', fontWeight: 'bold'}}> Tổng tiền: {convertPrice(state?.totalPrice)} </span>
                                </div>
                            </WrapperInfo>
                        </WrapperContainer>
                    </div>
                </div>
            </Loading1>
        </div>
    )
}

export default OrderSuccess