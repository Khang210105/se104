const UserService = require('../services/UserService');
const JWTService = require('../services/jwtService');

const createUser = async (req, res) => {
    try {
        console.log(req.body)
        const {name, email, password, confirmPassword, phone} = req.body
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const isCheckEmail = reg.test(email)
        if (!email || !password || !confirmPassword){
            return res.status(200).json({
                status: 'ERROR',
                message: 'The input is required',
            });
        }
        if(!isCheckEmail){
            return res.status(200).json({
                status: 'ERROR',
                message: 'The input is email',
            });
        }
        if(password !== confirmPassword){
            return res.status(200).json({
                status: 'ERROR',
                message: 'The password must be equal to confirm password',
            });
        }
        
        const response = await UserService.createUser(req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const isCheckEmail = reg.test(email)
        if (!email || !password ){
            return res.status(200).json({
                status: 'ERROR',
                message: 'The input is required',
            })
        }
        else if (!isCheckEmail){
            return res.status(200).json({
                status: 'ERROR',
                message: 'The input is email',
            })
        }
        const response = await UserService.loginUser(req.body)
        console.log('repsponse', response);
        const {refresh_token, ...newResponse} = response
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: false,
            samesite: 'strict'
        })
        return res.status(200).json(newResponse)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id
        const data = req.body

        if (!userId){
            return res.status(200).json({
                status: 'ERROR',
                message: 'The user id is required'
            })
        }
        const response = await UserService.updateUser(userId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id
        const token = req.headers
        if (!userId){
            return res.status(200).json({
                status: 'ERROR',
                message: 'The user id is required'
            })
        }
        const response = await UserService.deleteUser(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteMany = async (req, res) => {
    try {
        const ids = req.body.ids
        if (!ids){
            return res.status(200).json({
                status: 'ERROR',
                message: 'The ids is required'
            })
        }
        const response = await UserService.deleteManyUsers(ids)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllUser = async (req, res) => {
    try {
        const response = await UserService.getAllUser()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getDetailsUser = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId){
            return res.status(200).json({
                status: 'ERROR',
                message: 'The user id is required'
            })
        }
        const response = await UserService.getDetailsUser(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const refreshToken = async (req, res) => {
    console.log('req.cookies.refresh_token', req.cookies.refresh_token);
    try {
        const token = req.cookies.refresh_token
        if (!token){
            return res.status(200).json({
                status: 'ERROR',
                message: 'The token is required'
            })
        }
        const response = await JWTService.refreshTokenJWTService(token)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const logoutUser = async (req, res) => {
    console.log('req.cookies.refresh_token', req.cookies.refresh_token);
    try {
        res.clearCookie('refresh_token')
        return res.status(200).json({
            status: 'OK',
            message: 'Logout successfully'
        })
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    refreshToken,
    logoutUser,
    deleteMany
}