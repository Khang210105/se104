import React, { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import * as OrderService from '../../services/OrderService'
import { useSelector } from 'react-redux'
import Loading1 from "../../component/LoadingComponent/Loading1";
import { convertPrice } from '../../untils';
import ButtonComponent from '../../component/ButtonComponent/ButtonComponent'
import {WrapperContainer, WrapperListOrder, WrapperItemOrder, WrapperStatus, WrapperHeaderItem, WrapperFooterItem} from './style'
import {useLocation, useNavigate} from 'react-router-dom'
import { useMutationHook } from '../../hooks/useMutationHook'
import { message } from 'antd';

const MyOrderPage = () => {
    const location = useLocation()
    const {state} = location
    const navigate = useNavigate()
    const fetchMyOrder = async () => {
        const res = await OrderService.getOrderByUserId(state?.id, state?.token)
        //console.log('state', res);
        return res?.data
    }

    const queryOrder = useQuery({
        queryKey: ['orders'],
        queryFn: fetchMyOrder,
        enabled: Boolean(state?.id && state?.token)
    })

    const {isPending, data} = queryOrder

    const handleDetailsOrder = (id) => {
        navigate(`/details-order/${id}`,{
            state: {
                token: state?.token,
                delivery: state?.delivery,
            }
        })
    }

    const mutation = useMutationHook(
        (data) => {
            const {id, token, orderItems} = data
            const res = OrderService.cancelOrder(id, token, orderItems)
            return res
        }
    )

    const handleCancelOrder = (order) => {
        mutation.mutate({id: order._id, token: state?.token, orderItems: order?.orderItems},{
            onSuccess:() => {
                queryOrder.refetch()
            }
        })
    }

    const{isPending: isPendingCancel, isSuccess: isSuccessCancel, isError: isErrorCancel, data: dataCancel} = mutation

    useEffect(() => {
        if(isSuccessCancel && dataCancel?.status === 'OK'){
            message.success()
        }
        else if (isErrorCancel) {
            message.error()
        }
    }, [isErrorCancel, isSuccessCancel])

    const renderProduct = (data) => {
        return data?.map((order) => {
            return(
                <WrapperHeaderItem>
                    <img src={order?.image} 
                        style={{
                            width:'70px',
                            height:'70px',
                            objectFit:'cover',
                            border:'1px solid rgb(238, 238, 238)',
                            padding: '2px',
                        }}
                    />
                    <div style={{
                        width:260,
                        overflow:'hidden',
                        textOverflow:'ellipsis',
                        whiteSpace:'nowrap',
                        marginLeft:'10px',
                    }}>
                        {order?.name}
                    </div>
                    <span style={{fontSize:'13px', color:'#242424', marginLeft:'auto'}}>Giá tiền: {convertPrice(order?.price)}</span>
                    <span style={{fontSize:'13px', color:'#242424', marginLeft:'auto'}}>SL: {order?.amount}</span>
                </WrapperHeaderItem>
            )
        })
    }

    return (
        <Loading1 isPending={isPending}>
            <WrapperContainer>
                <div style={{ width: '1270px', height: '100vh', margin:'0 auto' }}>
                    <h4>Đơn hàng của tôi</h4>
                    <WrapperListOrder>
                        {data?.map((order)=>{
                            console.log('order', order);
                            return(
                                <WrapperItemOrder key={order?._id}>
                                    <WrapperStatus>
                                        <span style={{fontSize: '14px', fontWeight:'bold'}}>Trạng thái</span>
                                        <div>
                                            <span style={{color:'rgb(255, 66, 78)'}}>Giao hàng: </span> {`${order.isDelivery ? "Đã giao hàng" : "Chưa giao hàng"}`}
                                        </div>
                                        <div>
                                            <span style={{color:'rgb(255, 66, 78)'}}>Thanh toán: </span> {`${order.isDelivery ? "Đã thanh toán" : "Chưa thanh toán"}`}
                                        </div>
                                    </WrapperStatus>
                                    {renderProduct(order?.orderItems)}
                                    <span style={{display:'flex', flexDirection:'column', alignItems:'flex-end', fontSize:'14px'}}>Tiền ship: {order?.shippingPrice}</span>
                                    <WrapperFooterItem>
                                        <div>
                                            <span style={{color:'rgb(255, 66, 78)'}}>Tổng tiền: </span>
                                            <span style={{fontSize:'13px', color:'rgb(56, 56, 61)', fontWeight: 700}}>{convertPrice(order?.totalPrice)}</span>
                                        </div>
                                        <div style={{display:'flex', gap:'10px'}}>
                                            <ButtonComponent
                                                onClick={() => handleCancelOrder(order)}
                                                size={40}
                                                styleButton={{
                                                    height: '36px',
                                                    border: '1px solid rgb(11, 116, 229)',
                                                    borderRadius: '4px',
                                                }}
                                                textButton={'Hủy đơn hàng'}
                                                styleTextButton={{color:'rgb(11, 116, 229)', fontSize:'14px'}}
                                            >
                                            </ButtonComponent>
                                            <ButtonComponent
                                                onClick={() => handleDetailsOrder(order?._id)}
                                                size={40}
                                                styleButton={{
                                                    height: '36px',
                                                    border: '1px solid rgb(11, 116, 229)',
                                                    borderRadius: '4px',
                                                }}
                                                textButton={'Xem chi tiết'}
                                                styleTextButton={{color:'rgb(11, 116, 229)', fontSize:'14px'}}
                                            >
                                            </ButtonComponent>
                                        </div>
                                    </WrapperFooterItem>
                                </WrapperItemOrder>
                            )
                        })}
                    </WrapperListOrder>
                </div>
            </WrapperContainer>
            
        </Loading1>
    )
}

export default MyOrderPage
