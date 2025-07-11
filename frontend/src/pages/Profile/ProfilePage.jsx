import React, { useEffect, useState } from "react";
import { WrapperHeader, WrapperContentProfile, WrapperLabel, WrapperInput, WrapperUploadFile } from "./style";
import InputForm from '../../component/InputForm/InputForm';
import ButtonComponent from "../../component/ButtonComponent/ButtonComponent";
import { useDispatch, useSelector } from "react-redux";
import * as UserService from '../../services/UserService';
import { useMutationHook } from "../../hooks/useMutationHook";
import * as message from '../../component/Message/Message';
import Loading1 from "../../component/LoadingComponent/Loading";
import {updateUser} from '../../redux/slides/userSlide'
import { Button, Upload } from "antd";
import {UploadOutlined} from '@ant-design/icons';
import { getBase64 } from "../../untils";

const ProfilePage = () => {
    const user = useSelector((state) => state.user)
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [avatar, setAvatar] = useState('')

    const mutation = useMutationHook(
        async (data) => {
            const {id, access_token, ...rests} = data
            const response = await UserService.updateUser(id, access_token, rests)
            return response
        }
    )
    const dispatch = useDispatch()
    const {data, isLoading, isSuccess, isError} = mutation

    useEffect(() => {
        setName(user?.name)
        setEmail(user?.email)
        setPhone(user?.phone)
        setAddress(user?.address)
        setAvatar(user?.avatar)
    }, [user])

    useEffect(() => {
        if (isSuccess) {
            message.success()
            handleGetDetailsUser(user?.id, user?.access_token)
        }
        else if (isError) {
            message.error()
        }
    }, [isSuccess, isError])

    const handleGetDetailsUser = async (id, token) => {
        const res = await UserService.getDetailsUser(id, token)
        dispatch(updateUser({...res?.data, access_token: token}))
    }
    
    const handleOnchangeEmail = (value) => {
        setEmail(value)
    }

    const handleOnchangeName = (value) => {
        setName(value)
    }

    const handleOnchangePhone = (value) => {
        setPhone(value)
    }

    const handleOnchangeAddress = (value) => {
        setAddress(value)
    }

    const handleOnchangeAvatar = async ({fileList}) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj );
        }
        setAvatar(file.preview)
    }

    const handleUpdate = () => {
        mutation.mutate({id: user?.id, email, name, phone, address, avatar, access_token : user?.access_token })

    };
    return(
        <div style={{width:'1270px', margin:'0 auto', height: '500px'}}>
            <WrapperHeader>Thông tin người dùng</WrapperHeader>
            <Loading1 isPending={mutation.isPending}>
                <WrapperContentProfile>
                <WrapperInput>
                    <WrapperLabel htmlFor="name">Name</WrapperLabel>
                    <InputForm style={{width: '300px'}} id="name" value={name} onChange={handleOnchangeName} />
                    <ButtonComponent
                        onClick={handleUpdate}
                        size={40}
                        styleButton = {{
                            height:'30px',
                            width: 'fit-content',
                            border: '1px solid rgb(26, 148, 255)',
                            borderRadius: '4px',
                            padding:'2px 6px 6px'
                        }}
                        textButton={'Cập nhật'}
                        styleTextButton={{color: 'rgb(26, 148, 255)', fontSize: '15px', fontWeight: '700'}}>
                    </ButtonComponent>
                </WrapperInput>

                <WrapperInput>
                    <WrapperLabel htmlFor="email">Email</WrapperLabel>
                    <InputForm style={{width: '300px'}} id="email" value={email} onChange={handleOnchangeEmail} />
                    <ButtonComponent
                        onClick={handleUpdate}
                        size={40}
                        styleButton = {{
                            height:'30px',
                            width: 'fit-content',
                            border: '1px solid rgb(26, 148, 255)',
                            borderRadius: '4px',
                            padding:'2px 6px 6px'
                        }}
                        textButton={'Cập nhật'}
                        styleTextButton={{color: 'rgb(26, 148, 255)', fontSize: '15px', fontWeight: '700'}}>
                    </ButtonComponent>
                </WrapperInput>

                <WrapperInput>
                    <WrapperLabel htmlFor="phone">Phone</WrapperLabel>
                    <InputForm style={{width: '300px'}} id="phone" value={phone} onChange={handleOnchangePhone} />
                    <ButtonComponent
                        onClick={handleUpdate}
                        size={40}
                        styleButton = {{
                            height:'30px',
                            width: 'fit-content',
                            border: '1px solid rgb(26, 148, 255)',
                            borderRadius: '4px',
                            padding:'2px 6px 6px'
                        }}
                        textButton={'Cập nhật'}
                        styleTextButton={{color: 'rgb(26, 148, 255)', fontSize: '15px', fontWeight: '700'}}>
                    </ButtonComponent>
                </WrapperInput>

                <WrapperInput>
                    <WrapperLabel htmlFor="address">Address</WrapperLabel>
                    <InputForm style={{width: '300px'}} id="address" value={address} onChange={handleOnchangeAddress} />
                    <ButtonComponent
                        onClick={handleUpdate}
                        size={40}
                        styleButton = {{
                            height:'30px',
                            width: 'fit-content',
                            border: '1px solid rgb(26, 148, 255)',
                            borderRadius: '4px',
                            padding:'2px 6px 6px'
                        }}
                        textButton={'Cập nhật'}
                        styleTextButton={{color: 'rgb(26, 148, 255)', fontSize: '15px', fontWeight: '700'}}>
                    </ButtonComponent>
                </WrapperInput>

                <WrapperInput>
                    <WrapperLabel htmlFor="avatar">Avatar</WrapperLabel>
                    <WrapperUploadFile 
                        onChange={handleOnchangeAvatar}
                        maxCount={1}
                    >
                        <Button icon={<UploadOutlined />}> Select Files </Button>
                    </WrapperUploadFile>
                    {avatar && (
                        <img src={avatar} style={{
                            height:'60px',
                            width:'60px',
                            borderRadius:'50%',
                            objectFit:'cover'
                        }} alt='avatar' />
                    )}
                    <ButtonComponent
                        onClick={handleUpdate}
                        size={40}
                        styleButton = {{
                            height:'30px',
                            width: 'fit-content',
                            border: '1px solid rgb(26, 148, 255)',
                            borderRadius: '4px',
                            padding:'2px 6px 6px'
                        }}
                        textButton={'Cập nhật'}
                        styleTextButton={{color: 'rgb(26, 148, 255)', fontSize: '15px', fontWeight: '700'}}>
                    </ButtonComponent>
                </WrapperInput>
                </WrapperContentProfile>
            </Loading1>
        </div>
    )
}

export default ProfilePage