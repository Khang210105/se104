import {Button, Checkbox, Form, Radio} from 'antd'
import React, {useEffect, useMemo, useState} from 'react'
import { Lable, WrapperCountOrder, WrapperInfo, WrapperItemOrder, WrapperLeft, WrapperListOrder, WrapperPriceDiscount, WrapperRadio } from './style'
import { WrapperRight, WrapperStyleHeader, WrapperTotal, WrapperInputNumber } from './style'
import {DeleteOutlined, MinusOutlined, PlusOutlined} from '@ant-design/icons'
import ButtonComponent from '../../component/ButtonComponent/ButtonComponent'
import {useDispatch, useSelector} from 'react-redux'
import { decreaseAmount, increaseAmount, removeAllOrderProduct, removeOrderProduct, selectedOrder } from '../../redux/slides/orderSlide'
import { convertPrice } from "../../untils";
import Loading1 from '../../component/LoadingComponent/Loading1'
import ModalComponent from '../../component/ModalComponent/ModalComponent'
import InputComponent from '../../component/InputComponent/InputComponent'
import { useMutationHook } from '../../hooks/useMutationHook'
import * as UserService from '../../services/UserService';
import * as OrderService from '../../services/OrderService'
import * as message from '../../component/Message/Message'
import { updateUser } from '../../redux/slides/userSlide'
import { useNavigate } from 'react-router-dom'

const PaymentPage = () => {
    const [payment, setPayment] = useState('later_money')
    const [delivery, setDelivery] = useState('fast')
    const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
    const [stateUserDetails, setStateUserDetails] = useState({
        name: '',
        phone: '',
        address: '',
        city: '',
    })
    const order = useSelector((state) => state.order)
    const user = useSelector((state) => state.user)
    const [listChecked, setListChecked] = useState([])
    const dispatch = useDispatch()
    const [form] = Form.useForm();
    const onChange = (e) => {
        if(listChecked.includes(e.target.value)){
            const newListChecked = listChecked.filter((item) => item !== e.target.value)
            setListChecked(newListChecked)
        }
        else {
            setListChecked([...listChecked, e.target.value])
        }
    };

    useEffect(() => {
        form.setFieldsValue(stateUserDetails)
    }, [form, stateUserDetails])

    useEffect(() => {
        if(isOpenModalUpdateInfo){
            setStateUserDetails({
                city: user?.city,
                name: user?.name,
                address: user?.address,
                phone: user?.phone,
            })
        }
    }, [isOpenModalUpdateInfo])

    const handleChangeAddress = () => {
        setIsOpenModalUpdateInfo(true)
    }

    const priceMemo = useMemo(() => {
        const result = order?.orderItemsSelected?.reduce((total, cur) => {
            return total + ((cur.price * cur.amount))
        }, 0)
        return result
    }, [order])

    const priceDiscountMemo = useMemo(() => {
        const result = order?.orderItemsSelected?.reduce((total, cur) => {
            return total + ((cur.discount * cur.amount))
        }, 0)
        if(Number(result)){
            return result
        }
        return 0
    }, [order])

    const priceShipMemo = useMemo(() => {
        if(priceMemo > 100000){
            return 10000
        }
        else if(priceMemo === 0){
            return 0
        }
        else {
            return 20000
        }
    }, [priceMemo])

    const totalPrice = useMemo(() => {
        return Number(priceMemo) - Number(priceDiscountMemo) + Number(priceShipMemo)
    }, [priceMemo, priceDiscountMemo, priceShipMemo])

    const handleRemoveAllOrder = () => {
        if(listChecked?.length > 1){
            dispatch(removeAllOrderProduct({listChecked}))
        }
    }

    const handleAddOrder = () => {
        if(
            user?.access_token && 
            order?.orderItemsSelected && 
            user?.name && 
            user?.address && 
            user?.phone && 
            user?.city && 
            priceMemo && 
            user?.id
        ){
            mutationAddOrder.mutate(
            { 
                    token: user?.access_token, 
                    orderItems: order?.orderItemsSelected, 
                    fullName: user?.name, 
                    address: user?.address, 
                    phone: user?.phone, 
                    city: user?.city,
                    paymentMethod: user?.payment,
                    itemsPrice: priceMemo,
                    shippingPrice: priceShipMemo,
                    totalPrice: totalPrice,
                    user: user?.id,
            })
        }
    }

    const handleCancelUpdate = () => {
        setStateUserDetails({
            name: '',
            email: '',
            phone: '',
            isAdmin: false,
        })
        form.resetFields()
        setIsOpenModalUpdateInfo(false)
    }

    const mutationUpdate = useMutationHook(
        (data) => {
            const {
                id, 
                token, 
                ...rests} = data
            const res = UserService.updateUser(
                id, 
                token, 
                {...rests}
            )
            return res    
        } 
    )

    const mutationAddOrder = useMutationHook(
        (data) => {
            const {
                token, 
                ...rests} = data
            const res = OrderService.createOrder( 
                token, {...rests})
            return res
        },
    )

    const {isPending, data} = mutationUpdate
    const {data: dataAddOrder, isPending: isPendingAddOrder, isSuccess, isError} = mutationAddOrder

    const navigate = useNavigate()

    useEffect(() => {
        if(isSuccess && dataAddOrder?.status === 'OK') {
            message.success('Đặt hàng thành công')
            navigate('/orderSuccess', {
                state: {
                    delivery,
                    payment,
                    orders: order?.orderItemsSelected,
                    totalPrice: totalPrice
                }
            })
        }
        else if (isError) {
            message.error()
        }
    }, [isSuccess, isError])
    
    const handleUpdateInfoUser = () => {
        const {name, address, city, phone} = stateUserDetails
        if(name && address && city && phone){
            mutationUpdate.mutate({ id: user?.id, token: user?.access_token, ...stateUserDetails }, {
                onSuccess: () => {
                    dispatch(updateUser({name, address, city, phone}))
                    setIsOpenModalUpdateInfo(false)
                }
            })
        }
    }

    const handleOnchangeDetails = (e) => {
        setStateUserDetails({
            ...stateUserDetails,
            [e.target.name]: e.target.value,
        })
    }

    const handleDelivery = (e) => {
        setDelivery(e.target.value)
    }

    const handlePayment = (e) => {
        setPayment(e.target.value)
    }

    return (
        <div style={{background: '#f5f5fa', width: '100%', height: '100vh'}}>
            <Loading1 isPending={isPendingAddOrder}>
                <div style={{width: '1270px', height: '100%', margin: '0 auto'}}>
                    <h3> Thanh toán </h3>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <WrapperLeft>
                            <WrapperInfo>
                                <div>
                                    <Lable>Chọn phương thức giao hàng</Lable>
                                    <WrapperRadio onChange={handleDelivery} value={delivery}>
                                        <Radio value='fast'> <span style={{color:'#ea8500', fontWeight: 'bold'}}> FAST </span> Giao hàng tiết kiệm </Radio>
                                        <Radio value='gojek'> <span style={{color:'#ea8500', fontWeight: 'bold'}}> GOJEK </span> Giao hàng tiết kiệm </Radio>
                                    </WrapperRadio>
                                </div>
                            </WrapperInfo>
                            <WrapperInfo>
                                <div>
                                    <Lable>Chọn phương thức thanh toán</Lable>
                                    <WrapperRadio onChange={handlePayment} value={payment}>
                                        <Radio value='later_money'> Thanh toán tiền mặt khi nhận hàng </Radio>
                                        <Radio value='bank'> Chuyển khoản </Radio>
                                    </WrapperRadio>
                                </div>
                            </WrapperInfo>
                        </WrapperLeft>
                        <WrapperRight>
                            <div style={{width:'100%'}}>
                                <WrapperInfo>
                                    <div>
                                        <span> Địa chỉ: </span>
                                        <span style={{fontWeight: 'bold'}}> {`${user?.address} ${user?.city}`} </span>
                                        <span onClick={handleChangeAddress} style={{color: 'blue', cursor: 'pointer'}}> Thay đổi địa chỉ </span>
                                    </div>
                                </WrapperInfo>
                                <WrapperInfo>
                                    <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                                        <span style={{fontSize:'14px'}}>Tạm tính</span>
                                        <span style={{color:'#000', fontSize:'14px', fontWeight:'bold'}}>{convertPrice(priceMemo)}</span>
                                    </div>
                                    <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                                        <span style={{fontSize:'14px',marginTop:'5px'}}>Giảm giá</span>
                                        <span style={{color:'#000', fontSize:'14px', fontWeight:'bold'}}> {`${priceDiscountMemo} %`} </span>
                                    </div>
                                    {/* <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                                        <span>Thuế</span>
                                        <span style={{color:'#000', fontSize:'14px', fontWeight:'bold'}}></span>
                                    </div> */}
                                    <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                                        <span style={{fontSize:'14px',marginTop:'5px'}}>Phí giao hàng</span>
                                        <span style={{color:'#000', fontSize:'14px', fontWeight:'bold'}}> {convertPrice(priceShipMemo)} </span>
                                    </div>
                                </WrapperInfo>
                                <WrapperTotal>
                                    <span style={{fontSize:'20px'}}>Tổng tiền</span>
                                    <span style={{display:'flex', flexDirection:'column'}}>
                                        <span style={{color:'rgb(254, 56, 52)', fontSize:'24px', fontWeight:'bold'}} > {convertPrice(totalPrice)} </span>
                                        <span style={{color:'#000', fontSize:'11px'}} > (Đã bao gồm VAT nếu có) </span>
                                    </span>
                                </WrapperTotal>
                            </div>
                            <ButtonComponent
                                onClick={() => handleAddOrder()}
                                size={40}
                                styleButton={{
                                    background:'rgb(255, 57, 69)',
                                    height: '48px',
                                    width: '320px',
                                    border: 'none',
                                    borderRadius: '4px',
                                }}
                                textButton={'Đặt hàng'}
                                styleTextButton={{color:'#fff', fontSize:'15px', fontWeight:'700'}}
                            >
                            </ButtonComponent>
                        </WrapperRight>
                    </div>
                </div>
                <ModalComponent
                    forceRender
                    title="Cập nhật thông tin giao hàng"
                    open={isOpenModalUpdateInfo}
                    onCancel={handleCancelUpdate}
                    onOk = {handleUpdateInfoUser}
                >
                    <Loading1 isPending={isPending}>
                        <Form
                                name="basic"
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 20 }}
                                //onFinish={onUpdateUser}
                                autoComplete="on"
                                form={form}
                            >
                            
                            <Form.Item
                                label="Name"
                                name="name"
                                rules={[{ required: true, message: 'Please input your name!' }]}
                            >
                            <InputComponent value={stateUserDetails['name']} onChange={handleOnchangeDetails} name='name' />
                            </Form.Item>

                            <Form.Item
                                label="City"
                                name="city"
                                rules={[{ required: true, message: 'Please input your city!' }]}
                            >
                            <InputComponent value={stateUserDetails['city']} onChange={handleOnchangeDetails} name='city' />
                            </Form.Item>

                            <Form.Item
                                label="Phone"
                                name="phone"
                                rules={[{ required: true, message: 'Please input your phone number!' }]}
                            >
                            <InputComponent value={stateUserDetails.phone} onChange={handleOnchangeDetails} name='phone' />
                            </Form.Item>

                            <Form.Item
                                label="Address"
                                name="address"
                                rules={[{ required: true, message: 'Please input address of user!' }]}
                            >
                            <InputComponent value={stateUserDetails.address} onChange={handleOnchangeDetails} name='address' />
                            </Form.Item>

                        </Form>
                    </Loading1>
                </ModalComponent>
            </Loading1>
        </div>
    )
}

export default PaymentPage