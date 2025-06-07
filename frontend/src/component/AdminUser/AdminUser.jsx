import React, { useEffect, useRef, useState } from "react";
import { WrapperHeader } from "./style";
import {Button, Form, Modal, Space} from 'antd';
import {DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined} from '@ant-design/icons';
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from '../../component/InputComponent/InputComponent';
import { WrapperUploadFile } from "./style";
import { getBase64 } from "../../untils";
import { createProduct } from "../../services/ProductService";
import * as UserService from '../../services/UserService';
import { useMutationHook } from "../../hooks/useMutationHook";
import Loading1 from '../../component/LoadingComponent/Loading1';
import * as message from "../../component/Message/Message";
import { useQuery } from "@tanstack/react-query";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import {useSelector} from 'react-redux';
import ModalComponent from "../ModalComponent/ModalComponent";
import Search from "antd/es/transfer/search";

const AdminUser = ()=> {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [rowSelected, setRowSelected] = useState('')
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const [isPendingUpdate, setIsPendingUpdate] = useState(false)
    const [isModalDelete, setIsModalDelete] = useState(false)
    const user = useSelector((state) => state?.user)

    const searchInput = useRef(null);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');

    const [stateUser, setStateUser] = useState({
        name: '',
        email: '',
        phone: '',
        isAdmin: false,
    })

    const [stateUserDetails, setStateUserDetails] = useState({
       name: '',
        email: '',
        phone: '',
        isAdmin: false,
        avatar: '',
        address: '',
    })

    const [form] = Form.useForm();

    const mutation = useMutationHook(
        (data) => {
            const {
                name,
                email,
                phone,
                isAdmin,
                } = data
            const res = UserService.signupUser({
                name,
                email,
                phone,
                isAdmin, 
            })
            return res    
        }
    )

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

    const mutationDelete = useMutationHook(
        (data) => {
            const {
                id, 
                token, 
                } = data
            const res = UserService.deleteUser(
                id, 
                token)
            return res    
        } 
    )

    const mutationDeleteMany = useMutationHook(
            (data) => {
                const {
                    token,
                    ...ids
                } = data
                const res = UserService.deleteManyUser(
                    ids, 
                    token
                )
                return res    
            } 
        )

    const handleDeleteManyUsers = (ids) => {
        mutationDeleteMany.mutate({ ids: ids, token: user?.access_token}, {
            onSettled: () => {
                queryUser.refetch()
            }
        })
    }

    const getAllUsers = async () => {
        const res = await UserService.getAllUser()
        //console.log('res', res);
        return res
    }
    
    const fetchGetDetailsUser = async (rowSelected) => {
        const res = await UserService.getDetailsUser(rowSelected)
        if (res?.data) {
            setStateUserDetails({
                name: res?.data?.name,
                email: res?.data?.email,
                phone: res?.data?.phone,
                isAdmin: res?.data?.isAdmin,
                address: res?.data?.address,
                avatar: res?.data?.avatar,
            })
        }
        setIsPendingUpdate(false)
    }

    useEffect(() => {
        form.setFieldsValue(stateUserDetails)
    }, [form, stateUserDetails])

    useEffect(() => {
        if (rowSelected && isOpenDrawer){
            setIsPendingUpdate(true)
            fetchGetDetailsUser(rowSelected)
        }
    }, [rowSelected, isOpenDrawer])

    const handleDetailsUser = () => {
        setIsOpenDrawer(true)
    }

    const { data: dataUpdated, isPending: isPendingUpdated, isSuccess:isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
    const { data: dataDeleted, isPending: isPendingDeleted, isSuccess:isSuccessDeleted, isError: isErrorDeleted } = mutationDelete
    const { data: dataDeletedMany, isPending: isPendingDeletedMany, isSuccess:isSuccessDeletedMany, isError: isErrorDeletedMany } = mutationDeleteMany

    //console.log('dataUpdated', dataUpdated);
    const queryUser = useQuery({
        queryKey: ['users'],
        queryFn: getAllUsers
    });

    const { isLoading: isLoadingUsers, data: users } = queryUser

    const renderAction = () => {
        return(
            <div>
                <DeleteOutlined style={{color:'red', fontSize:'30px', cursor:'pointer'}} onClick={()=>setIsModalDelete(true)} />
                <EditOutlined style={{color:'orange', fontSize:'30px', cursor:'pointer'}} onClick={handleDetailsUser} />
            </div>
        )
    }

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm()
        setSearchText(selectedKeys[0])
        setSearchedColumn(dataIndex)
    }

    const handleReset = (clearFilters) => {
        clearFilters()
        setSearchText('')
    }

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div
                style={{padding: 8,}}
                onKeyDown={(e)=> e.stopPropagation()}
            >
                <InputComponent
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e)=> setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={()=> handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />

                <Space>
                    <Button
                        type='primary'
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon = {<SearchOutlined />}
                        size='small'
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>

                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size='small'
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>

                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1890ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(()=>searchInput.current?.select(), 100);
            }
        }
        // render: (text) =>
        //     searchColumn === dataIndex ? (
        //         <Highlighter
        //             highlightStyle ={{
        //                 backgroundColor: '#ffc069',
        //                 padding: 0,
        //             }}
        //             searchWords={{searchText}}
        //             autoEscape
        //             textToHighlight={text ? text.toString() : ''}
        //         />
        //     ) : (
        //         text
        //     ),
    });

    const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        render: text => <a>{text}</a>,
        sorter: (a, b) => a.name.length - b.name.length,
        ...getColumnSearchProps('name')
    },
    {
        title: 'Email',
        dataIndex: 'email',
        sorter: (a, b) => a.email.length - b.email.length,
        ...getColumnSearchProps('email')
    },
    {
        title: 'Phone',
        dataIndex: 'phone',
        sorter: (a, b) => a.phone.length - b.phone.length,
        ...getColumnSearchProps('phone')
    },
    {
        title: 'Address',
        dataIndex: 'address',
        sorter: (a, b) => a.address.length - b.address.length,
        ...getColumnSearchProps('address')
    },
    {
        title: 'isAdmin',
        dataIndex: 'isAdmin',
        filter: [
            {
                text: 'True',
                value: true,
            },
            {
                text: 'False',
                value: false,
            }
        ],
    },
    {
        title: 'Action',
        dataIndex: 'action',
        render: renderAction
    },
    ];

    const dataTable = users?.data.length && users?.data.map((user) => {
        return { ...user, key: user._id, isAdmin: user.isAdmin ? 'TRUE' : 'FALSE' }
    })

    useEffect(() => {
        if(isSuccessDeletedMany && dataDeletedMany?.status === 'OK') {
            message.success()
        }
        else if (isErrorDeletedMany) {
            message.error()
        }
    }, [isSuccessDeletedMany])

    useEffect(() => {
        if(isSuccessDeleted && dataDeleted?.status === 'OK') {
            message.success()
            handleCancelDelete()
        }
        else if (isErrorDeleted) {
            message.error()
        }
    }, [isSuccessDeleted])

    const handleCloseDrawer = () => {
        setIsOpenDrawer(false);
        setStateUserDetails({
            name: '',
            email: '',
            phone: '',
            isAdmin: false,
        })
        form.resetFields()
    };

    useEffect(() => {
        if(isSuccessUpdated && dataUpdated?.status === 'OK') {
            message.success()
            handleCloseDrawer()
        }
        else if (isErrorUpdated) {
            message.error()
        }
    }, [isSuccessUpdated])

    const handleCancelDelete = () => {
        setIsModalDelete(false)
    }

    const handleDeleteUser = () => {
        mutationDelete.mutate({ id: rowSelected, token: user?.access_token}, {
            onSettled: () => {
                queryUser.refetch()
            }
        })
    }

    const handleCancel = () => {
        setIsModalOpen(false);
        setStateUser({
            name: '',
            email: '',
            phone: '',
            isAdmin: false,
        })
        form.resetFields()
    };

    const onFinish = () => {
        mutation.mutate(stateUser , {
            onSettled: () => {
                queryUser.refetch()
            }
        })
    }

    const handleOnchange = (e) => {
        setStateUser({
            ...stateUser,
            [e.target.name]: e.target.value,
        })
    }

    const handleOnchangeDetails = (e) => {
        setStateUserDetails({
            ...stateUserDetails,
            [e.target.name]: e.target.value,
        })
    }

    const handleOnchangeAvatarDetails = async ({fileList}) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateUserDetails({
            ...stateUserDetails,
            avatar: file.preview
        })
    }

    const onUpdateUser = () => {
        mutationUpdate.mutate({ id: rowSelected, token: user?.access_token, ...stateUserDetails }, {
            onSettled: () => {
                queryUser.refetch()
            }
        })
    }
    
    return(
        <div>
            <div style={{marginTop:'10px'}}>
                <WrapperHeader>Quản lý người dùng</WrapperHeader>
            </div>
            <div style={{marginTop:'20px'}}>
                <TableComponent handleDeleteMany={handleDeleteManyUsers} columns={columns} isPending={isPendingUpdate} data={dataTable} 
                onRow={(record, rowIndex)=>{
                    return {
                        onClick: event =>{
                            setRowSelected(record._id)
                        },
                    };
                }}
                />
            </div>
                <DrawerComponent 
                    title='Chi tiết người dùng' 
                    isOpen={isOpenDrawer} 
                    onClose={() => setIsOpenDrawer(false)}
                    width='90%'
                    >
                        <Loading1 isPending={isPendingUpdate || isPendingUpdated}>
                            <Form
                            name="basic"
                            labelCol={{ span: 2 }}
                            wrapperCol={{ span: 22 }}
                            onFinish={onUpdateUser}
                            autoComplete="on"
                            form={form}
                        >
                        
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Please input name of user!' }]}
                        >
                        <InputComponent value={stateUserDetails['name']} onChange={handleOnchangeDetails} name='name' />
                        </Form.Item>

                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: 'Please input email of user!' }]}
                        >
                        <InputComponent value={stateUserDetails['email']} onChange={handleOnchangeDetails} name='email' />
                        </Form.Item>

                        <Form.Item
                            label="Phone"
                            name="phone"
                            rules={[{ required: true, message: 'Please input phone of user!' }]}
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

                        <Form.Item
                            label="Avatar"
                            name="avatar"
                            rules={[{ required: true, message: 'Please upload avatar of user!' }]}
                        >
                            <WrapperUploadFile 
                                onChange={handleOnchangeAvatarDetails}
                                maxCount={1}
                            >
                            <Button > Select Files </Button>
                            {stateUserDetails?.avatar && (
                                <img src={stateUserDetails?.avatar} style={{
                                    height:'60px',
                                    width:'60px',
                                    borderRadius:'50%',
                                    objectFit:'cover',
                                    marginLeft:'10px'
                                }} alt='avatar' />
                            )}
                            </WrapperUploadFile>
                        </Form.Item>

                        <Form.Item wrapperCol={{offset: 20, span: 16}}>
                            <Button type="primary" htmlType="submit">
                                Apply
                            </Button>
                        </Form.Item>

                            </Form>
                        </Loading1>
                </DrawerComponent>

                <ModalComponent
                    forceRender
                    title="Xóa người dùng"
                    open={isModalDelete}
                    onCancel={handleCancelDelete}
                    onOk = {handleDeleteUser}
                >
                    <Loading1 isPending={isPendingDeleted}>
                        <div>Bạn có chắc là muốn xóa người dùng này không ?</div>
                    </Loading1>
                </ModalComponent>
        </div>
    )
}

export default AdminUser