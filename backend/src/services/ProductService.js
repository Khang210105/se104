const Product = require('../models/ProductModel')

const createProduct = (newProduct) => {
    return new Promise(async(resolve, reject) => {
        const {name, image, type, price, countInStock, rating, description, discount} = newProduct
        try {
            const checkProduct = await Product.findOne({
                name: name
            })
            if(checkProduct !== null){
                resolve({
                    status: 'Error',
                    message: 'The name of product is already',
                })
            }
            const newProduct = await Product.create({
                name, 
                image, 
                type,  
                countInStock: Number(countInStock),
                price,
                rating, 
                description,
                discount: Number(discount),
            })
            if(newProduct){
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: newProduct
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const updateProduct = (id, data) => {
    return new Promise(async(resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({
                _id: id
            })
            if(checkProduct === null){
                resolve({
                    status: 'OK',
                    message: 'The product is not defined',
                })
            }

            const updateProduct = await Product.findByIdAndUpdate(id, data, {new: true})

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updateProduct,
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteProduct = (id) => {
    return new Promise(async(resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({
                _id: id
            })
            if(checkProduct === null){
                resolve({
                    status: 'OK',
                    message: 'The product is not defined'
                })
            }

            await Product.findByIdAndDelete(id)

            resolve({
                status: 'OK',
                message: 'Delete product SUCCESS'
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteManyProducts = (ids) => {
    return new Promise(async(resolve, reject) => {
        try {
            await Product.deleteMany({_id: ids})
            resolve({
                status: 'OK',
                message: 'Delete product SUCCESS'
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllProduct = (limit, page, sort, filter) => {
    return new Promise(async(resolve, reject) => {
        try {
            const totalProduct = await Product.countDocuments()
            let allProduct = []
            if(filter){
                const label = filter[0];
                const allObjectFilter = await Product.find( {[label]: {'$regex':filter[1]}}).limit(limit).skip(page * limit)
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: allObjectFilter,
                    total: totalProduct,
                    pageCurrent: Number(page+1),
                    totalPage: Math.ceil(totalProduct / limit)
                })
            }

            if(sort){
                const objectSort = {}
                objectSort[sort[1]] = sort[0]
                const allProductSort = await Product.find().limit(limit).skip(page * limit).sort(objectSort)
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: allProductSort,
                    total: totalProduct,
                    pageCurrent: Number(page+1),
                    totalPage: Math.ceil(totalProduct / limit)
                })
            }
            if(!limit){
                allProduct = await Product.find()
            }
            else{
                allProduct = await Product.find().limit(limit).skip(page*limit)
            }
            
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: allProduct,
                total: totalProduct,
                pageCurrent: Number(page+1),
                totalPage: Math.ceil(totalProduct / limit)
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getDetailsProduct = (id) => {
    return new Promise(async(resolve, reject) => {
        try {
            const product = await Product.findOne({
                _id: id
            })
            if(product === null){
                resolve({
                    status: 'OK',
                    message: 'The product is not defined'
                })
            }

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: product
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllType = () => {
    return new Promise(async(resolve, reject) => {
        try {
            const allType = await Product.distinct('type')
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: allType,
            })
        } catch (e) {
            reject(e)
        }
    })
}


module.exports = {
    createProduct,
    updateProduct,
    getDetailsProduct,
    deleteProduct,
    getAllProduct,
    deleteManyProducts,
    getAllType
}