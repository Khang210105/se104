import React, { useState, useEffect } from "react";
import {WrapperContainerLeft, WrapperContainerRight, WrapperTextLight} from './style';
import InputForm from '../../component/InputForm/InputForm';
import ButtonComponent from '../../component/ButtonComponent/ButtonComponent';
import imageLogo from '../../assets/images/logo-login.jpg';
import { Image, Divider } from "antd";
import {EyeFilled, EyeInvisibleFilled} from '@ant-design/icons';
import { useLocation, useNavigate } from "react-router-dom";
import {useMutation} from '@tanstack/react-query';
import axios from "axios";
import * as UserService from '../../services/UserService';
import { useMutationHook } from "../../hooks/useMutationHook";
import Loading from "../../component/LoadingComponent/Loading";
import ButtonSign from "../../component/ButtonSign/ButtonSign";
import * as message from '../../component/Message/Message';
import { jwtDecode } from 'jwt-decode';
import { updateUser } from '../../redux/slides/userSlide';
import { useDispatch } from 'react-redux';

const SignInPage = () => {
    const [isShowPassword, setIsShowPassword] = useState(false);
    const location = useLocation()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleNavigateSignUp = () => {
        navigate('/sign-up')
    }

    const mutation = useMutationHook(
        data => UserService.loginUser(data)
    )

    const { data, isLoading, isSuccess, isError } = mutation

    useEffect(() => {
        if(isSuccess){
            if (location?.state){
                navigate(location?.state)
            }
            else {
                navigate('/')
            }
            localStorage.setItem('access_token', JSON.stringify(data?.access_token))
            if (data?.access_token) {
                const decoded = jwtDecode(data?.access_token)
                if (decoded?.id) {
                    handleGetDetailsUser(decoded?.id, data?.access_token)
                }
            }
        }
            
    }, [isSuccess])

    const handleGetDetailsUser = async (id, token) => {
        const res = await UserService.getDetailsUser(id, token)
        dispatch(updateUser({...res?.data, access_token: token}))
    }

    const handleOnchangeEmail = (value) => {
        setEmail(value)
    }

    const handleOnchangePassword = (value) => {
        setPassword(value)
    }

    const handleSignIn = () => {
        mutation.mutate({
            email,
            password
        })
    }

    return(
        <div style={{display:'flex', alignItems:'center', justifyContent:'center',background:'rgba(0, 0, 0, 0.53)', height:'100vh'}}>
            <div style={{width:'800px', height:'445px', borderRadius:'6px', background:'#fff', display:'flex'}}>
                <WrapperContainerLeft>
                    <h1 >Xin chào</h1>
                    <p style={{marginBottom:'10px', fontSize:'15px'}}>Đăng nhập hoặc Tạo tài khoản</p>
                    <InputForm style={{marginBottom:'10px'}} placeholder="abc@gmail.com" value={email} onChange={handleOnchangeEmail} />
                    <div style={{position:'relative'}}>
                        <span
                            onClick={() => setIsShowPassword(!isShowPassword)}
                            style={{
                                zIndex: 10,
                                position:'absolute',
                                top: '4px',
                                right: '8px',
                            }}
                        >{
                            isShowPassword ? (
                                <EyeFilled />
                            ) : (
                                <EyeInvisibleFilled />
                            )
                        }
                            </span>
                    <InputForm 
                        placeholder="password" 
                        type={isShowPassword ? 'text' : 'password'} 
                        value={password} 
                        onChange={handleOnchangePassword} />
                    </div>
                    {data?.status === 'ERROR' && <span style={{color:'red'}}>{data?.message}</span> }
                    <Loading isPending={mutation.isPending}>
                        <ButtonSign
                            disabled={!email.length || !password.length}
                            onClick={handleSignIn}
                            size={40}
                            styleButton = {{
                                background: 'rgb(255, 57, 69)',
                                height:'48px',
                                width: '100%',
                                border: 'none',
                                borderRadius: '4px',
                                margin: '26px 0 10px',
                            }}
                            textButton={'Đăng nhập'}
                            styleTextButton={{color: '#fff', fontSize: '15px', fontWeight: '700'}}>
                        </ButtonSign>
                    </Loading>
                    <p> <WrapperTextLight>  Quên mật khẩu ? </WrapperTextLight></p>
                    <p style={{fontSize:'13px'}}> Bạn chưa có tài khoản ? <WrapperTextLight onClick={handleNavigateSignUp } style={{cursor:'pointer'}}> Tạo tài khoản </WrapperTextLight> </p> 
                    </WrapperContainerLeft>

                    <WrapperContainerRight>
                        <Image src={imageLogo} preview={false} alt='image-logo' height='203px' width='243px' style={{borderRadius:'100px'}} />
                        <h4>Mua sắm tại Haky</h4>
                    </WrapperContainerRight>
            </div>
        </div>
    );
}

export default SignInPage