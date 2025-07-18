import axios from "axios";

export const axiosJWT = axios.create()

export const loginUser = async (data) => {
    const res = await axios.post(`http://localhost:3001/api/user/sign-in`, data)
    return res.data
}

export const signupUser = async (data) => {
    const res = await axios.post(`http://localhost:3001/api/user/sign-up`, data)
    return res.data
}

export const getDetailsUser = async (id, access_token) => {
    const res = await axiosJWT.get(`http://localhost:3001/api/user/get-details/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const getAllUser = async () => {
    const res = await axiosJWT.get(`http://localhost:3001/api/user/getAll`)
    return res.data
}

export const deleteUser = async (id, access_token) => {
    const res = await axiosJWT.delete(`http://localhost:3001/api/user/delete-user/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const refreshToken = async () => {
    const res = await axios.post(`http://localhost:3001/api/user/refresh-token`, {
        withCredentials: true
    })
    return res.data
}

export const logoutUser = async () => {
    const res = await axios.post(`http://localhost:3001/api/user/log-out`)
    return res.data
}

export const updateUser = async (id, access_token, data) => {
    const res = await axiosJWT.put(`http://localhost:3001/api/user/update-user/${id}`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const deleteManyUser = async (data, access_token) => {
    const res = await axiosJWT.post(`http://localhost:3001/api/user/delete-many`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}