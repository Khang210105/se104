import React from "react";
import { WrapperStyleTextSell, StyleNameProduct, WrapperReportText, WrapperPriceText, WrapperDiscountText, WrapperCardStyle } from "./style";
import {StarFilled} from '@ant-design/icons'
import {useNavigate} from 'react-router-dom'
import { convertPrice } from "../../untils";

const CardComponent = (props) => {
	const {countInStock, description, image, name, price, rating, type, selled, discount, id} = props
	const navigate = useNavigate()
	const handleDetailsProduct = (id) => {
		navigate(`/product-details/${id}`)
	}
	return (
	<WrapperCardStyle
		hoverable
		//headStyle={{ width: '200px', height: '200px' }}
		style={{ width: 200 }}
		//bodyStyle={{ padding: '10px' }}
		cover = {<img alt='example' src={image} />}
		onClick={() => handleDetailsProduct(id)}
		disabled={countInStock===0}
	>
		<StyleNameProduct style={{fontSize:'16px'}}>{name}</StyleNameProduct>
		<WrapperReportText>
			<span style={{ marginRight: '4px' }}>
				<span>{rating}</span> <StarFilled style={{ fontSize: '12px', color: 'rgb(253, 216, 54)' }} />
			</span>
			<WrapperStyleTextSell> | Đã bán {selled || 0}</WrapperStyleTextSell>
		</WrapperReportText>
		<WrapperPriceText>
			<span style={{ marginRight: '8px' }}> {convertPrice(price)} </span>
			<WrapperDiscountText>
				- {discount || 5} % 
			</WrapperDiscountText>
		</WrapperPriceText>
	</WrapperCardStyle>
	);
};

export default CardComponent;