import React, { useEffect, useState } from "react";
import { Menu } from "antd";
import {
  ProductOutlined,
  UserOutlined
} from '@ant-design/icons';
import HeaderComponent from "../../component/HeaderComponent/HeaderComponent";
import AdminUser from "../../component/AdminUser/AdminUser";
import AdminProduct from "../../component/AdminProduct/AdminProduct";

const AdminPage = () => {
  const [openKeys, setOpenKeys] = useState(['user']);
  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (!rootSubmenuKeys.includes(latestOpenKey)) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  const rootSubmenuKeys = ['user', 'product'];

	const items = [
    {
      key: 'user',
      icon: <UserOutlined />,
      label: 'User'
    },
    {
      key: 'product',
      icon: <ProductOutlined />,
      label: 'Product'
    }
  	]

	const [keySelected, setKeySelected] = useState('')

	const renderPage = (key) => {
		switch(key) {
			case 'user':
				return (
					<AdminUser />
				)
			case 'product':
				return (
					<AdminProduct />
				)
			default: 
				return <></>
		}
	}

	const handleOnClick = ({ key }) => {
		setKeySelected(key);
	};

	return (
    <>
        <HeaderComponent isHiddenSearch isHiddenCart />
        <div style={{display:'flex'}}>
            <Menu
            mode="inline"
            style={{ 
              width: 256, 
              boxShadow: '1px 1px 2px #ccc',
              height:'100vh'
            }}
            items={items}
            onClick={handleOnClick}
            />
            <div style={{flex: 1, padding: '15px'}}>
                {renderPage(keySelected)}
            </div>
        </div>
    </>
    
  );
};

export default AdminPage;
