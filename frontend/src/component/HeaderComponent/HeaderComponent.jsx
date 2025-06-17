import React, { useEffect, useState } from 'react';
import { Button,Col, Row, Badge, Popover } from 'antd';
import { WrapperHeader, WrapperTextHeader,WrapperHeaderAccount,WrapperHeaderWord, WrapperHeaderShop, WrapperContentPopup } from "./style";
import { Input, Space } from 'antd';
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch';
import {UserOutlined, CaretDownOutlined,ShoppingCartOutlined} from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as UserService from '../../services/UserService';
import { resetUser } from '../../redux/slides/userSlide';
import Loading1 from '../LoadingComponent/Loading1';
import { searchProduct } from '../../redux/slides/productSlide';

const HeaderComponent = ({isHiddenSearch=false, isHiddenCart=false}) => {
    const navigate = useNavigate()
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const [userName, setUserName] = useState('')
    const [userAvatar, setUserAvatar] = useState('')
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState('')
    const [isOpenPopup, setIsOpenPopup] = useState(false)
    const order = useSelector((state) => state.order)
    const handleNavigateLogin = () => {
        navigate('/sign-in')
    }

    const handleLogout = async () => {
        setLoading(true)
        await UserService.logoutUser()
        dispatch(resetUser())
        setLoading(false)
        navigate('/');
    }

    useEffect(() => {
        setLoading(true)
        setUserName(user?.name)
        setUserAvatar(user?.avatar)
        setLoading(false)
    }, [user?.name, user?.avatar])

    const content = (
    <div>
        <WrapperContentPopup onClick={()=> handleClickNavigate('profile')}>Thông tin người dùng</WrapperContentPopup>
        {user?.isAdmin && (
            <WrapperContentPopup onClick={()=>handleClickNavigate('admin')}> Quản lý hệ thống </WrapperContentPopup>
        )}
        <WrapperContentPopup onClick={() => handleClickNavigate('my-order')}> Đơn hàng của tôi </WrapperContentPopup>
        <WrapperContentPopup onClick={() => handleClickNavigate()}>Đăng xuất</WrapperContentPopup>
        
    </div>
    );

    const handleClickNavigate = (type) => {
        if(type === 'profile'){
            navigate('/profile-user')
        }
        else if(type === 'admin'){
            navigate('/system/admin')
        }
        else if(type === 'my-order'){
            navigate('/my-order', {
                state: {
                    id: user?.id,
                    token: user?.access_token,
                }
            })
        }
        else{
            handleLogout()
        }
        setIsOpenPopup(false)
    }

    const onSearch = (e) => {
        setSearch(e.target.value)
        dispatch(searchProduct(e.target.value))
    }

    const handleNavigateOrder = () => {
        if(!user?.id){
            navigate('/sign-in')
        }
        else {
            navigate('/order')
        }
    }   

    const handleReturnHome = () => {
        navigate('/')
    }

    return(
        <div style={{width:'100%', background:'rgb(26, 148, 255)', display:'flex', justifyContent:'center',}}>
            <WrapperHeader style={{justifyContent: isHiddenSearch && isHiddenSearch ? 'space-between' : 'unset'}}>
                <Col span={5}>
                    <WrapperTextHeader style={{cursor:'pointer'}} onClick={() => handleReturnHome()}> E-Commerce </WrapperTextHeader>
                </Col>
                {!isHiddenSearch && (
                    <Col span={13}>
                    <ButtonInputSearch
                        size='large'
                        placeholder="Tìm kiếm..." 
                        onChange={onSearch} 
                    />
                    </Col>
                )}
                <Col span={6} style = {{display: 'flex', gap: '54px', alignItems: 'center'}}>
                    <Loading1 isLoading={loading}>
                        <WrapperHeaderAccount>
                            {userAvatar ? (
                                <img src={userAvatar} alt="avatar" style={{
                                    height:'50px',
                                    width:'50px',
                                    borderRadius:'50%',
                                    objectFit:'cover'
                        }} />
                            ) : (
                                <UserOutlined style={{fontSize: '30px'}} />
                            )}
                        
                        {user?.access_token? (
                            <>
                                <Popover
                                content={content}
                                trigger="click"
                                open={isOpenPopup}
                                onOpenChange={(visible) => setIsOpenPopup(visible)} // 👈 xử lý khi click bên ngoài
                                >
                                <div style={{cursor:'pointer'}}>
                                    {userName?.length ? userName : user?.email}
                                </div>
                                </Popover>
                            </>
                        ) : (
                        <div onClick={handleNavigateLogin} style={{cursor:'pointer'}}>
                            <WrapperHeaderWord>Đăng ký / Đăng nhập</WrapperHeaderWord>
                            <div>
                                <WrapperHeaderWord>Tài khoản</WrapperHeaderWord>
                                <CaretDownOutlined />
                            </div>
                        </div>
                        )}
                        </WrapperHeaderAccount>
                    </Loading1>
                    {!isHiddenCart && (
                        <div onClick={() => handleNavigateOrder()} style={{cursor: 'pointer'}}>
                            <Badge count={order?.orderItems?.length} size='small'>
                                <ShoppingCartOutlined style={{fontSize: '30px', color: '#fff'}} />
                            </Badge>
                            <WrapperHeaderWord>Giỏ hàng</WrapperHeaderWord>
                        </div>    
                    )}
                </Col>
            </WrapperHeader>
        </div>
    )
}

export default HeaderComponent