import React, { useEffect, useState } from "react";
import {WrapperContainerLeft, WrapperContainerRight, WrapperTextLight} from './style';
import InputForm from '../../component/InputForm/InputForm';
import ButtonComponent from '../../component/ButtonComponent/ButtonComponent';
import imageLogo from '../../assets/images/logo-login.jpg';
import { Image, Divider } from "antd";
import {EyeFilled, EyeInvisibleFilled, MediumCircleFilled} from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import * as UserService from '../../services/UserService';
import { useMutationHook } from "../../hooks/useMutationHook";
import Loading from "../../component/LoadingComponent/Loading";
import ButtonSign from '../../component/ButtonSign/ButtonSign';
import * as message from '../../component/Message/Message';


const SignUpPage = () => {
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);

    const navigate = useNavigate();
    const handleNavigateSignIn = () => {
        navigate('/sign-in')
    }

    const mutation = useMutationHook(
        data => UserService.signupUser(data)
    )

    const {data, isLoading, isSuccess, isError} = mutation

    useEffect(()=>{
        if(isSuccess){
            message.success()
            handleNavigateSignIn()
        }
        else if (isError){
            message.error()
        }
    }, [isSuccess, isError])

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleOnchangeEmail = (value) => {
        setEmail(value)
    }

    const handleOnchangePassword = (value) => {
        setPassword(value)
    }

    const handleOnchangeConfirmPassword = (value) => {
        setConfirmPassword(value)
    }

    const handleSignUp = () => {
        mutation.mutate({email, password, confirmPassword})
        console.log('sign-up', email, password, confirmPassword)
    }

    return(
        <div style={{display:'flex', alignItems:'center', justifyContent:'center',background:'rgba(0, 0, 0, 0.53)', height:'100vh'}}>
            <div style={{width:'800px', height:'445px', borderRadius:'6px', background:'#fff', display:'flex'}}>
                <WrapperContainerLeft>
                    <h1>ĐĂNG KÝ TÀI KHOẢN</h1>
                    
                    <InputForm 
                        style={{marginBottom:'10px'}} 
                        placeholder="abc@gmail.com" 
                        value={email} 
                        onChange = {handleOnchangeEmail} />
                    <div style={{position:'relative'}}>
                        <span
                            onClick={() => setIsShowPassword(!isShowPassword)}
                            style={{
                                zIndex: 10,
                                position:'absolute',
                                top: '4px',
                                right: '8px'
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
                        style={{marginBottom:'10px'}} 
                        type={isShowPassword ? 'text' : 'password'}
                        value={password} 
                        onChange={handleOnchangePassword}
                    />

                    </div>
                    
                    <div style={{position:'relative'}}>
                        <span
                            onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
                            style={{
                                zIndex: 10,
                                position:'absolute',
                                top: '4px',
                                right: '8px',
                            }}
                        >{
                            isShowConfirmPassword ? (
                                <EyeFilled />
                            ) : (
                                <EyeInvisibleFilled />
                            )
                        }
                            </span>
                    <InputForm 
                        placeholder="confirm password" 
                        type={isShowConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword} 
                        onChange={handleOnchangeConfirmPassword}
                    />
                    </div>
                {data?.status === 'ERROR' && <span style={{color:'red'}}>{data?.message}</span> }
                <Loading isPending={mutation.isPending}>
                    <ButtonSign
                        disabled={!email.length || !password.length || !confirmPassword.length}
                        onClick={handleSignUp}
                        size={40}
                        styleButton = {{
                            background: 'rgb(255, 57, 69)',
                            height:'48px',
                            width: '100%',
                            border: 'none',
                            borderRadius: '4px',
                            margin: '26px 0 10px',
                        }}
                        textButton={'Đăng ký'}
                        styleTextButton={{color: '#fff', fontSize: '15px', fontWeight: '700'}}>
                    </ButtonSign>
                </Loading>
                <p style={{fontSize:'13px'}}> Bạn đã có tài khoản ? <WrapperTextLight onClick={handleNavigateSignIn} style={{cursor:'pointer'}}> Đăng nhập </WrapperTextLight> </p> 
                </WrapperContainerLeft>

                <WrapperContainerRight>
                    <Image src={imageLogo} preview={false} alt='image-logo' height='203px' width='243px' style={{borderRadius:'100px'}} />
                    <h4 style={{marginTop:'30px', fontSize:'20px'}}>Mua sắm tại Haky</h4>
                </WrapperContainerRight>
            </div>
        </div>
    );
}

export default SignUpPage