const User = require('../models/UserModel')
const bcrypt = require('bcrypt')
const { generalAccessToken, generalRefreshToken } = require('./jwtService')

const createUser = (newUser) => {
    return new Promise(async(resolve, reject) => {
        const {name, email, password, confirmPassword, phone} = newUser
        try {
            const checkUser = await User.findOne({
                email: email
            })
            if(checkUser !== null){
                resolve({
                    status: 'Error',
                    message: 'The email is already',
                })
            }
            const hash = bcrypt.hashSync(password, 10)
            console.log('hash', hash)
            const createdUser = await User.create({
                name, 
                email, 
                password: hash,
                phone
            })
            if(createdUser){
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: createdUser
                })
            }
            resolve({})
        } catch (e) {
            reject(e)
        }
    })
}

const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const {email, password} = userLogin
        try {
            const checkUser = await User.findOne({
                email: email
            })
            if(checkUser === null){
                resolve({
                    status: 'Error',
                    message: 'Email hoặc mật khẩu không đúng',
                })
            }
            const comparePassword = bcrypt.compareSync(password, checkUser.password)

            if (!comparePassword) {
                resolve({
                    status: 'Error',
                    message: 'Email hoặc mật khẩu không đúng',
                })
            }

            const access_token = await generalAccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin,
            })

            const refresh_token = await generalRefreshToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin,
            })

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                access_token,
                refresh_token
            })
        } catch (e) {
            reject(e)
        }
    })
}

const updateUser = (id, data) => {
    return new Promise(async(resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id
            })
            if (checkUser === null){
                resolve({
                    status: 'Error',
                    message: 'The user is not defined',
                })
            }

            const updatedUser = await User.findByIdAndUpdate(id, data, {new: true})

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedUser,
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteUser = (id) => {
    return new Promise(async(resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id
            })
            if(checkUser === null){
                resolve({
                    status: 'ERROR',
                    message: 'The user is not defined'
                })
            }

            await User.findByIdAndDelete(id)

            resolve({
                status: 'OK',
                message: 'Delete user SUCCESS'
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteManyUsers = (ids) => {
    return new Promise(async(resolve, reject) => {
        try {
            await User.deleteMany({_id: ids})
            resolve({
                status: 'OK',
                message: 'Delete user SUCCESS'
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllUser = () => {
    return new Promise(async(resolve, reject) => {
        try {
            const allUser = await User.find()
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: allUser
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getDetailsUser = (id) => {
    return new Promise(async(resolve, reject) => {
        try {
            const user = await User.findOne({
                _id: id
            })
            if(user === null){
                resolve({
                    status: 'ERROR',
                    message: 'The user is not defined'
                })
            }

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: user
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    deleteManyUsers
}