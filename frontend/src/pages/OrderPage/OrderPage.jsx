import {Button, Checkbox, Descriptions, Form} from 'antd'
import React, {useEffect, useMemo, useState} from 'react'
import { WrapperCountOrder, WrapperInfo, WrapperItemOrder, WrapperLeft, WrapperListOrder, WrapperPriceDiscount, WrapperDelivery } from './style'
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
import { updateUser } from '../../redux/slides/userSlide'
import { useNavigate } from 'react-router-dom'
import { message } from "antd";
import StepComponent from '../../component/StepComponent/StepComponent'

const OrderPage = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate()
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
        dispatch(selectedOrder({listChecked}))
    }, [listChecked])

    useEffect(() => {
        form.setFieldsValue(stateUserDetails)
    }, [form, stateUserDetails])

    useEffect(() => {
        if(isOpenModalUpdateInfo){
            // console.log('user in modal:', user)
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
            const discountPercent = cur.discount ?? 0;
            return total + ((cur.price * cur.amount * discountPercent) / 100);
        }, 0);
        return result || 0;
    }, [order]);

    const priceShipMemo = useMemo(() => {
        if(priceMemo >= 200000 && priceMemo < 500000){
            return 10000
        }
        else if(priceMemo >= 500000 || order?.orderItemsSelected?.length === 0){
            return 0
        }
        else {
            return 20000
        }
    }, [priceMemo])

    const totalPrice = useMemo(() => {
        return Number(priceMemo) + Number(priceShipMemo) - Number(priceDiscountMemo);
    }, [priceMemo, priceDiscountMemo, priceShipMemo]);

    const handleChangeCount = (type, idProduct, countInStock) => {
        const currentItem = order.orderItems.find(item => item.product === idProduct);
        if (!currentItem) return;

        if (type === 'increase') {
            if (currentItem.amount < countInStock) {
                dispatch(increaseAmount({ idProduct }));
            } else {
                message.warning('Bạn đã đạt số lượng tối đa trong kho!');
            }
        } else {
            if (currentItem.amount > 1) {
                dispatch(decreaseAmount({ idProduct }));
            }
        }
    };

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
            dispatch(removeAllOrderProduct({listChecked}))
        }
    }

    const handleAddCard = () => {
        // console.log('order', order);
        if(!order?.orderItemsSelected?.length){
            messageApi.error('Vui lòng chọn sản phẩm')
        }
        else if(!user?.phone || !user?.address || !user?.name || !user?.city){
            setIsOpenModalUpdateInfo(true)
        }
        else{
            navigate('/payment')
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

    const {isPending, data} = mutationUpdate

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

    const itemsDelivery = [
        {
            title: '20.000 VND',
            descriptions: 'Dưới 200.000 VND',
        },
        {
            title: '10.000 VND',
            descriptions: 'Từ 200.000 VND đến dưới 500.000 VND',
        },
        {
            title: '0 VND',
            descriptions: 'Trên 500.000 VND',
        }
    ]

    const handleCheckProduct = (product) => {
        setListChecked(prev => {
            if (prev.includes(product)) {
            return prev.filter(item => item !== product); // Bỏ chọn nếu đã chọn
            } else {
            return [...prev, product]; // Thêm vào nếu chưa chọn
            }
        });
    };

    return (
        <div style={{background: '#f5f5fa', width: '100%', height: '100vh'}}>
            {contextHolder}
            <div style={{width: '1270px', height: '100%', margin: '0 auto'}}>
                <h3>Giỏ hàng</h3>
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <WrapperLeft>
                        <WrapperDelivery>
                            <StepComponent items={itemsDelivery} current={priceShipMemo === 10000 ? 2 : priceShipMemo === 20000 ? 1 : order.orderItemsSelected.length === 0 ? 0 : 3} />
                        </WrapperDelivery>
                        <WrapperStyleHeader>
                            <span style={{display: 'inline-block', width: '390px'}}>
                                <Checkbox onChange={handleOnchangeCheckAll} checked={listChecked?.length === order?.orderItems?.length}  ></Checkbox>
                                <span> Tất cả ({order?.orderItems?.length} sản phẩm)</span>
                            </span>
                            <div style={{flex: 1, display:'flex', alignItems: 'center', justifyContent:'space-between'}}>
                                <span>Đơn giá</span>
                                <span>Số lượng</span>
                                <span>Thành tiền</span>
                                <DeleteOutlined style={{cursor: 'pointer'}} onClick={handleRemoveAllOrder} />
                            </div>
                        </WrapperStyleHeader>
                        <WrapperListOrder>
                            {order?.orderItems?.map((order) => {
                                return(
                                    <WrapperItemOrder key={order.product} onClick={() => handleCheckProduct(order?.product)}>
                                        <div style={{width: '390px', display: 'flex', alignItems:'center', gap: 4}}>
                                            <Checkbox onChange={onChange} value={order?.product} checked={listChecked.includes(order?.product)} ></Checkbox>
                                            <img src={order?.image} alt="" style={{width: '77px', height: '79px', objectFit: 'cover'}} />
                                            <div style={{
                                                width: 260,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                fontSize:'18px'
                                            }}>{order?.name}</div>
                                        </div>
                                        <div style={{flex: 1, display:'flex', alignItems:'center', justifyContent: 'space-between'}}>
                                            <span onClick={(e) => e.stopPropagation()}>
                                                <span style={{fontSize:'13px', color:'#242424'}}> {convertPrice(order?.price)} </span>
                                                {/* <WrapperPriceDiscount>
                                                    {}
                                                </WrapperPriceDiscount> */}
                                            </span>
                                            <WrapperCountOrder onClick={(e) => e.stopPropagation()}>
                                            <button style={{border:'none', background: 'transparent', cursor: 'pointer'}} onClick={() => handleChangeCount('decrease', order?.product, order?.countInStock)} >
                                                    <MinusOutlined style= {{color: '#000', fontSize:'10px'}}  />
                                                </button>
                                                <WrapperInputNumber defaultValue={order?.amount} value={order?.amount} size='small'  />
                                                <button 
                                                    style={{border:'none', background: 'transparent', cursor: 'pointer'}} 
                                                    onClick={() => handleChangeCount('increase', order?.product, order?.countInStock)}>
                                                    <PlusOutlined style= {{color: '#000', fontSize:'10px'}}  />
                                                </button >
                                            </WrapperCountOrder>
                                            <span style={{color:'rgb(255, 66, 78)', fontSize:'13px', fontWeight: 500}} onClick={(e) => e.stopPropagation()}> {convertPrice(order?.price * order?.amount)} </span>
                                            <DeleteOutlined style={{cursor:'pointer'}} onClick={() => handleDeleteOrder(order?.product)}  />
                                        </div>
                                    </WrapperItemOrder>
                                )
                            })}
                        </WrapperListOrder>
                    </WrapperLeft>
                    <WrapperRight>
                        <div style={{width:'100%'}}>
                            <WrapperInfo>
                                <div>
                                    <span> Địa chỉ: </span>
                                    <span style={{fontWeight: 'bold'}}> {`${user?.address} ${user?.city}`} </span>
                                    <span onClick={handleChangeAddress} style={{color: 'blue', cursor: 'pointer'}}> Thay đổi </span>
                                </div>
                            </WrapperInfo>
                            <WrapperInfo>
                                <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                                    <span style={{fontSize:'14px'}}>Tạm tính</span>
                                    <span style={{color:'#000', fontSize:'14px', fontWeight:'bold'}}>{convertPrice(priceMemo)}</span>
                                </div>
                                <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                                    <span style={{fontSize:'14px',marginTop:'5px'}}>Giảm giá</span>
                                    <span style={{color:'#000', fontSize:'14px', fontWeight:'bold'}}> - {convertPrice(priceDiscountMemo)} </span>
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
                            onClick={() => handleAddCard()}
                            size={40}
                            styleButton={{
                                background:'rgb(255, 57, 69)',
                                height: '48px',
                                width: '320px',
                                border: 'none',
                                borderRadius: '4px',
                            }}
                            textButton={'Mua hàng'}
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
                <Loading1 isPending={mutationUpdate.isPending}>
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
        </div>
    )
}

export default OrderPage