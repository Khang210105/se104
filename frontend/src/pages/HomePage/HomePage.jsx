import React, { useEffect, useRef, useState } from "react";
import TypeProduct from "../../component/TypeProduct/TypeProduct";
import SliderComponent from "../../component/SliderComponent/SliderComponent";
import { WrapperTypeProduct, WrapperButtonMore,WrapperProducts } from "./style";
import CardComponent from "../../component/CardComponent/CardComponent";
import slider1 from '../../assets/images/slider1.webp';
import slider2 from '../../assets/images/slider2.webp';
import * as ProductService from '../../services/ProductService';
import {useQuery} from '@tanstack/react-query';
import { useSelector } from "react-redux";
import Loading1 from '../../component/LoadingComponent/Loading1';
import {useDebounce} from '../../hooks/useDebounce';

const HomePage = () => {
    const searchProduct = useSelector((state) => state?.product?.search)
    const searchDebounce = useDebounce(searchProduct, 500)
    const [pending, setPending] = useState(false)
    const [limit, setLimit] = useState(6)
    const [typeProducts, setTypeProducts] = useState([])
    const fetchProductAll = async (context) => {
        const limit = context?.queryKey && context?.queryKey[1]
        const search = context?.queryKey && context?.queryKey[2]
        const res = await ProductService.getAllProduct(search, limit)
        return res
    }

    const fetchAllTypeProduct = async () => {
        const res = await ProductService.getAllTypeProduct()
        if (res?.status === 'OK') {
            setTypeProducts(res?.data)
        }
    }

    const { isLoading, data: products, isPreviousData } = useQuery({
        queryKey: ['products', limit, searchDebounce],
        queryFn: fetchProductAll,
        retry: 3,
        retryDelay: 1000,
        keepPreviousData: true
    });

    useEffect(() => {
        fetchAllTypeProduct()
    }, [])

    return(
        <Loading1 isPending={ isLoading || pending }>
            <div style={{width: '1270px', margin:'0 auto'}}>
                <WrapperTypeProduct>
                    {typeProducts.map((item) => {
                    return(
                        <TypeProduct name={item} key={item} />
                    )
                    })}
                </WrapperTypeProduct>
            </div>
            <div className='body' style={{width:'100%', backgroundColor:'#efefef',}}>
                <div id='container' style={{height:'1000px', width: '1270px', margin:'0 auto' }}>
                    <SliderComponent arrImages={[slider1, slider2]}/>
                    <WrapperProducts>
                        {products?.data?.map((product) => (
                            <CardComponent
                                key={product._id} 
                                countInStock={product.countInStock} 
                                description = {product.description} 
                                image={product.image} 
                                name = {product.name}
                                price = {product.price}
                                rating = {product.rating}
                                type = {product.type}
                                selled = {product.selled}
                                discount = {product.discount}
                                id = {product._id}
                            />
                        ))}
                    </WrapperProducts>
                    <div style={{width:'100%', display: 'flex', justifyContent: 'center', marginTop: '10px'}}>
                        <WrapperButtonMore textButton= {isPreviousData ? 'Load more' : 'Xem Thêm'} type='outline' styleButton={{
                            border:'1px solid rgb(11, 116, 229)', color:  `${products?.total === products?.data?.length ? '#ccc' : 'rgb(11, 116, 229)'}`,
                            width: '240px', height: '38px', borderRadius: '4px'
                        }}
                            disabled={products?.total === products?.data?.length || products?.totalPage === 1}
                            styleTextButton={{ fontWeight: 500, color: products?.total === products?.data?.length && '#fff' }}
                            onClick = {()=> setLimit((prev)=>prev + 6)}
                        />
                    </div>
                </div>
            </div>
        </Loading1>
    )
}

export default HomePage