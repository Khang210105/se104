import React, { useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
    WrapperContentInfo, 
    WrapperHeaderUser, 
    WrapperInfoUser, 
    WrapperItemLabel, 
    WrapperLabel, 
    WrapperProduct, 
    WrapperStyleContent, 
    WrapperItem,
    WrapperNameProduct,
    WrapperAllPrice,
    ProductImage
} from './style'
import * as OrderService from '../../services/OrderService'
import { useQuery } from "@tanstack/react-query";
import {orderContant} from '../../contant'
import { convertPrice } from "../../untils";

const DetailsOrderPage = () => {
    const params = useParams()
    const location = useLocation()
    const { state } = location
    const { id } = params
    const fetchDetailsOrder = async () => {
        const res = await OrderService.getDetailsOrder(id, state?.token)
        //console.log('state', res);
        return res?.data
    }

    const queryOrder = useQuery({
        queryKey: ['orders-details'],
        queryFn: fetchDetailsOrder,
        enabled: Boolean(id)
    })

    const {isPending, data} = queryOrder

    const priceMemo = useMemo(() => {
        const result = data?.orderItems?.reduce((total, cur) => {
            return total + ((cur.price * cur.amount))
        }, 0)
        return result
    }, [data])

    const priceDiscountMemo = useMemo(() => {
        const result = data?.orderItems?.reduce((total, cur) => {
            const discountPercent = cur.discount ?? 0;
            return total + ((cur.price * cur.amount * discountPercent) / 100);
        }, 0);
        return result || 0;
    }, [data]);

    const rowLabelStyle = {
    padding: '12px 16px',
    fontWeight: 'bold',
    fontSize: '14px',
    color: '#444',
    background: '#fafafa',
    borderRight: '1px solid #eee',
    };

    const rowValueStyle = {
    padding: '12px 16px',
    textAlign: 'right',
    fontWeight: 'bold',
    fontSize: '14px',
    color: 'blue',
    background: '#fff',
    };

    const rowDivider = {
    height: '1px',
    background: '#eee',
    gridColumn: 'span 2',
    };

    return (
  <div style={{ width: '100%', minHeight: '100vh', background: '#f5f5fa', padding: '24px 0' }}>
    <div style={{ width: '1270px', margin: '0 auto' }}>
      <h4 style={{ marginBottom: 20 }}>Chi tiết đơn hàng</h4>

      {/* Thông tin người dùng */}
      <WrapperHeaderUser>
        <WrapperInfoUser>
          <WrapperLabel>Địa chỉ người nhận</WrapperLabel>
          <WrapperContentInfo>
            <div className="name-info">{data?.shippingAddress?.fullName}</div>
            <div className="address-info">
              <span>Địa chỉ:</span> {`${data?.shippingAddress?.address} ${data?.shippingAddress?.city}`}
            </div>
            <div className="phone-info">
              <span>Điện thoại:</span> {data?.shippingAddress?.phone}
            </div>
          </WrapperContentInfo>
        </WrapperInfoUser>

        <WrapperInfoUser>
          <WrapperLabel>Hình thức giao hàng</WrapperLabel>
          <WrapperContentInfo>
            <div className="delivery-info">
              <span className="name-delivery"> {orderContant.delivery[state?.delivery]} </span>
            </div>
            <div className="delivery-fee">
              <span>Phí giao hàng:</span> {convertPrice(data?.shippingPrice)}
            </div>
          </WrapperContentInfo>
        </WrapperInfoUser>

        <WrapperInfoUser>
          <WrapperLabel>Hình thức thanh toán</WrapperLabel>
          <WrapperContentInfo>
            <div className="payment-info">{orderContant[data?.paymentMethod]}</div>
            <div className="status-payment">
              {orderContant.payment[data?.paymentMethod]}
            </div>
          </WrapperContentInfo>
        </WrapperInfoUser>
      </WrapperHeaderUser>

      {/* Danh sách sản phẩm */}
      <WrapperStyleContent>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ width: '670px', fontWeight: 'bold', color: '#444', fontSize: '14px' }}>Sản phẩm</div>
          <WrapperItemLabel>Giá</WrapperItemLabel>
          <WrapperItemLabel>Số lượng</WrapperItemLabel>
          <WrapperItemLabel>Giảm giá</WrapperItemLabel>
        </div>

        {data?.orderItems?.map((order, index) => (
          <WrapperProduct key={index}>
            <WrapperNameProduct>
                <ProductImage  
                    src={order?.image} 
                    alt={order?.name} 
                    style={{
                        width: '90px',
                        height: '90px',
                        objectFit: 'cover',
                        border: '1px solid rgb(238, 238, 238)',
                        padding: '2px',
                        borderRadius: '6px'
                    }}
                />
                <div style={{ 
                    marginLeft: 12, 
                    display:'flex',
                    flexDirection:'column',
                    justifyContent:'center' 
                }}>
                    <div style={{ fontSize:'15px', fontWeight: 500, marginBottom: 6 }}>{order?.name}</div>
                    {/* <div style={{ fontSize: 13, color: '#777' }}>Mã SP: {order?.product}</div> */}
                </div>
            </WrapperNameProduct>
            <WrapperItem>{convertPrice(order?.price)}</WrapperItem>
            <WrapperItem>{order?.amount}</WrapperItem>
            <WrapperItem>{order?.discount ? convertPrice(priceMemo * order?.discount / 100) : '0 VND'}</WrapperItem>
          </WrapperProduct>
        ))}

        {/* Tổng kết giá */}
        <WrapperAllPrice style={{ marginTop: 20 }}>
        <div
            style={{
            display: 'grid',
            gridTemplateColumns: '200px 200px',
            rowGap: 0,
            border: '1px solid #eee',
            borderRadius: 6,
            overflow: 'hidden',
            }}
        >
            {/* Tạm tính */}
            <div style={rowLabelStyle}>Tạm tính:</div>
            <div style={rowValueStyle}>{convertPrice(priceMemo)}</div>

            <div style={rowDivider}></div>
            <div style={rowDivider}></div>

            {/* Phí vận chuyển */}
            <div style={rowLabelStyle}>Phí vận chuyển:</div>
            <div style={rowValueStyle}>{convertPrice(data?.shippingPrice)}</div>

            <div style={rowDivider}></div>
            <div style={rowDivider}></div>

            <div style={rowLabelStyle}>Giảm giá:</div>
            <div style={rowValueStyle}>- {convertPrice(priceDiscountMemo)}</div>

            <div style={rowDivider}></div>
            <div style={rowDivider}></div>

            {/* Tổng cộng */}
            <div style={rowLabelStyle}>Tổng cộng:</div>
            <div style={{ ...rowValueStyle, fontSize: 16, color: 'red' }}>
            {convertPrice(data?.totalPrice)}
            </div>
        </div>
        </WrapperAllPrice>

      </WrapperStyleContent>
    </div>
  </div>
);
}

export default DetailsOrderPage