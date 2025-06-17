import axios from "axios"
import { axiosJWT } from "./UserService"

// export const createProduct = async (data) => {
//     const res = await axios.post(`http://localhost:3001/api/product/create`, data)
//     return res.data
// }

export const createOrder = async (data, access_token) => {
    const res = await axiosJWT.post(`http://localhost:3001/api/order/create`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const getOrderByUserId = async (id, access_token) => {
    const res = await axiosJWT.get(`http://localhost:3001/api/order/get-all-order/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const getDetailsOrder = async (id, access_token) => {
    const res = await axiosJWT.get(`http://localhost:3001/api/order/get-details-order/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const cancelOrder = async (id, access_token, orderItems) => {
    const res = await axiosJWT.delete(`http://localhost:3001/api/order/cancel-order/${id}`, {data: orderItems}, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const getAllOrders = async (access_token) => {
    const res = await axiosJWT.get(`http://localhost:3001/api/order/get-all-order`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}
