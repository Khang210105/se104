// style.js
import styled from 'styled-components'

// Wrapper chính bao quanh toàn bộ nội dung đơn hàng
export const WrapperContainer = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #f5f5fa;
  padding: 30px 0;
`;

// Danh sách đơn hàng (bao quanh nhiều đơn)
export const WrapperListOrder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

// Một item đơn hàng
export const WrapperItemOrder = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

// Phần trạng thái đơn hàng
export const WrapperStatus = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
`;

// Phần thông tin sản phẩm (ảnh, tên, giá)
export const WrapperHeaderItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

// Phần footer mỗi đơn hàng (tổng tiền, nút xem chi tiết)
export const WrapperFooterItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #eee;
`;
