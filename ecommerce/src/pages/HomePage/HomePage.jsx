import React from "react";
import TypeProduct from "../../component/TypeProduct/TypeProduct";
import SliderComponent from "../../component/SliderComponent/SliderComponent";
import { WrapperTypeProduct, WrapperButtonMore,WrapperProducts } from "./style";
import CardComponent from "../../component/CardComponent/CardComponent";
import slider1 from '../../assets/images/slider1.webp';
import slider2 from '../../assets/images/slider2.webp';



const HomePage = () => {
    const arr = ['TV', 'Tủ lạnh', 'Laptop']
    return(
        <>
            <div style={{width: '1270px', margin:'0 auto'}}>
                <WrapperTypeProduct>
                    {arr.map((item) => {
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
                        <CardComponent/>
                        <CardComponent/>
                        <CardComponent/>
                        <CardComponent/>
                        <CardComponent/>
                        <CardComponent/>
                        <CardComponent/>
                    </WrapperProducts>
                    <div style={{width:'100%', display: 'flex', justifyContent: 'center', marginTop: '10px'}}>
                        <WrapperButtonMore textButton='Xem Thêm' type='outline' styleButton={{
                            border:'1px solid rgb(11, 116, 229)', color: 'rgb(11, 116, 229)',
                            width: '240px', height: '38px', borderRadius: '4px'
                        }}
                            styleTextButton={{fontWeight: 500}}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default HomePage