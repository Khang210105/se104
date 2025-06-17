import React, { useRef, useState } from "react";
import { WrapperHeader } from "./style";
import {Button, Form, Modal, Space} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from '../InputComponent/InputComponent';
import * as OrderService from '../../services/OrderService';
import Loading1 from '../LoadingComponent/Loading1';
import { useQuery } from "@tanstack/react-query";
import {useSelector} from 'react-redux';
import {orderContant} from '../../contant'

const OrderAdmin = ()=> {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const searchInput = useRef(null);
    const [searchText, setSearchText] = useState('');
const [searchedColumn, setSearchedColumn] = useState('');
    const user = useSelector((state) => state?.user)
    const getAllOrders = async () => {
        const res = await OrderService.getAllOrders(user?.access_token)
        //console.log('res', res);
        return res
    }
    const queryOrder = useQuery({
        queryKey: ['orders'],
        queryFn: getAllOrders
    });
    const { isLoading: isLoadingOrders, data: orders } = queryOrder
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
  confirm();
  setSearchText(selectedKeys[0]);
  setSearchedColumn(dataIndex);
};

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
                        //onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon = {<SearchOutlined />}
                        size='small'
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>

                    <Button
                        //onClick={() => clearFilters && handleReset(clearFilters)}
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
    });
    
    const columns = [
    {
        title: 'Mã đơn hàng',
        dataIndex: '_id',
    },
    {
        title: 'Khách hàng',
        dataIndex: 'userName',
        ...getColumnSearchProps(['user', 'name']),
    },
    {
        title: 'Số điện thoại',
        dataIndex: 'phone',
    },
    {
        title: 'Địa chỉ',
        dataIndex: 'address',
    },
    {
        title: 'Tổng tiền',
        dataIndex: 'totalPrice',
        render: (value) => `${value.toLocaleString()}₫`,
        sorter: (a, b) => a.totalPrice - b.totalPrice,
    },
    {
        title: 'Trạng thái',
        dataIndex: 'isDelivered',
        filters: [
        { text: 'Đã giao', value: true },
        { text: 'Chưa giao', value: false },
        ],
        render: (value) => (value ? 'Đã giao' : 'Chưa giao'),
        onFilter: (value, record) => record.isDelivered === value,
    },
    {
        title: 'Giao dịch',
        dataIndex: 'isPaid',
        filters: [
        { text: 'Đã thanh toán', value: true },
        { text: 'Chưa thanh toán', value: false },
        ],
        render: (value) => (value ? 'Đã thanh toán' : 'Chưa thanh toán'),
        onFilter: (value, record) => record.isDelivered === value,
    },
    {
        title: 'Phương thức thanh toán',
        dataIndex: 'payment',
    },
    {
        title: 'Ngày tạo',
        dataIndex: 'createdAt',
        render: (date) => new Date(date).toLocaleString(),
        sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    ];

    const dataTable = orders?.data?.length && orders?.data?.map((order) => {
        console.log('Số điện thoại gốc:', order?.shippingAddress?.phone);
        return {
            ...order, 
            key: order._id, 
            userName: order?.shippingAddress?.fullName, 
            phone: order?.shippingAddress?.phone, 
            address: order?.shippingAddress?.address,
            payment: orderContant.payment[order?.paymentMethod],
        }})
    
    return(
        <div>
            <WrapperHeader>Quản lý đơn hàng</WrapperHeader>
            <div style={{marginTop:'20px'}}>
                <div style={{ marginBottom: 16 }}>
                
                </div>
                <TableComponent  columns={columns} isPending={isLoadingOrders} data={dataTable} />
            </div>
        </div>
    )
}

export default OrderAdmin