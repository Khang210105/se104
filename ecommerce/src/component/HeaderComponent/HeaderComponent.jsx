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
import Loading1 from '../../component/LoadingComponent/Loading1';

const { Search } = Input;
const onSearch = (value, _e, info) =>
  console.log(info === null || info === void 0 ? void 0 : info.source, value);

const HeaderComponent = () => {
    const navigate = useNavigate()
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const [userName, setUserName] = useState('')
    const [userAvatar, setUserAvatar] = useState('')
    const [loading, setLoading] = useState(false)
    const handleNavigateLogin = () => {
        navigate('/sign-in')
    }

    const handleLogout = async () => {
        setLoading(true)
        await UserService.logoutUser()
        dispatch(resetUser())
        setLoading(false)
    }

    useEffect(() => {
        setLoading(true)
        setUserName(user?.name)
        setUserAvatar(user?.avatar)
        setLoading(false)
    }, [user?.name, user?.avatar])

    const content = (
    <div>
        <WrapperContentPopup onClick={handleLogout}>Đăng xuất</WrapperContentPopup>
        <WrapperContentPopup onClick={()=> navigate('/profile-user')}>Thông tin người dùng</WrapperContentPopup>
    </div>
    );

    console.log('user', user);

    return(
        <div style={{width:'100%', background:'rgb(26, 148, 255', display:'flex', justifyContent:'center',}}>
            <WrapperHeader gutter={16}>
                <Col span={5}>
                    <WrapperTextHeader> E-Commerce </WrapperTextHeader>
                </Col>
                <Col span={13}>
                    <ButtonInputSearch
                        size='large'
                        textButton='Tìm kiếm'
                        placeholder="input search text" 
                        //onSearch={onSearch} 
                        //enterButton 
                    />
                </Col>
                <Col span={6} style = {{display: 'flex', gap: '54px', alignItems: 'center'}}>
                    <Loading1 isLoading={loading} delay={300}>
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
                                <Popover content={content} trigger="click">
                                    <div style={{cursor:'pointer'}}> { userName?.length ? userName : user?.email } </div>
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
                    <div>
                        <Badge count={4} size='small'>
                            <ShoppingCartOutlined style={{fontSize: '30px', color: '#fff'}} />
                        </Badge>
                        <WrapperHeaderWord>Giỏ hàng</WrapperHeaderWord>
                    </div>
                </Col>
            </WrapperHeader>
        </div>
    )
}

export default HeaderComponent