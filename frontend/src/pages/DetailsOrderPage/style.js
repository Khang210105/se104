import styled from "styled-components";

// Phần bao quanh nhóm thông tin người dùng
export const WrapperHeaderUser = styled.div`
  display: flex;
  gap: 24px;
  margin-top: 16px;
  margin-bottom: 32px;
`;

// Từng khối thông tin (người nhận, giao hàng, thanh toán)
export const WrapperInfoUser = styled.div`
  flex: 1;
  background-color: #fff;
  border-radius: 8px;
  padding: 16px 20px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

// Nhãn tiêu đề cho từng nhóm thông tin
export const WrapperLabel = styled.div`
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
  font-size: 15px;
`;

// Nội dung bên trong nhóm info
export const WrapperContentInfo = styled.div`
  font-size: 14px;
  color: #555;

  .name-info {
    font-weight: 500;
    margin-bottom: 4px;
  }

  .address-info,
  .phone-info,
  .delivery-info,
  .delivery-fee,
  .payment-info,
  .status-payment {
    margin-bottom: 4px;

    span {
      font-weight: 500;
      color: #222;
      margin-right: 4px;
    }
  }

  .status-payment {
    color: rgb(255, 66, 78);
    font-weight: 600;
  }

  .name-delivery {
    color: #1677ff;
    font-weight: 600;
    margin-right: 4px;
  }
`;

// Phần tiêu đề bảng sản phẩm
export const WrapperStyleContent = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

// Label cho từng cột trong bảng sản phẩm
export const WrapperItemLabel = styled.div`
  width: 200px;
  text-align: center;
  font-weight: bold;
  color: #444;
  font-size: 14px;
`;

// Wrapper sản phẩm hiển thị
export const WrapperProduct = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 8px;
  background-color: #fafafa;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 0 6px rgba(0,0,0,0.08);
  }
`;

// Tên sản phẩm cùng hình ảnh trong đơn hàng
export const WrapperNameProduct = styled.div`
  display: flex;
  align-items: center;
  width: 670px;
`;

// Item từng cột dữ liệu như giá, số lượng, giảm giá,...
export const WrapperItem = styled.div`
  width: 200px;
  font-weight: bold;
  text-align: center;
  font-size: 14px;
  color: #1677ff;
  padding: 12px 0;
  border-right: 1px dashed #ddd;

  &:last-child {
    border-right: none; // cột cuối không cần gạch
  }
`;

export const WrapperAllPrice = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`

export const ProductImage = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
  border: 1px solid rgb(238, 238, 238);
  padding: 2px;
  border-radius: 6px;
  flex-shrink: 0;
`;