import React, { Fragment, useEffect, useState } from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { routes } from './routes';
import DefaultComponent from './component/DefaultComponent/DefaultComponent';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { isJsonString } from './untils';
import { jwtDecode } from 'jwt-decode';
import * as UserService from './services/UserService';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from './redux/slides/userSlide';
import Loading1 from './component/LoadingComponent/Loading1';
import { isPending } from '@reduxjs/toolkit';

function App() {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const user = useSelector((state)=> state.user)

  useEffect(() => {
    setIsLoading(true)
    const {storageData, decoded} = handleDecoded()
      if (decoded?.id) {
        handleGetDetailsUser(decoded?.id, storageData)
      }
    setIsLoading(false)
    }, [])

  const handleDecoded = () => {
    let storageData = localStorage.getItem('access_token')
    let decoded = {}
    if(storageData && isJsonString(storageData)){
      storageData = JSON.parse(storageData)
      decoded = jwtDecode(storageData)
    }
    return { decoded, storageData }
  }

  UserService.axiosJWT.interceptors.request.use(async (config) => {
    const currentTime = new Date()
    const { decoded } = handleDecoded()
    if (decoded?.exp < currentTime.getTime() / 1000) {
      const data = await UserService.refreshToken()
      config.headers['token'] = `Bearer ${data?.access_token}`
    }
    return config;
  }, (error) => {
    return Promise.reject(error); 
  });

  const handleGetDetailsUser = async (id, token) => {
    const res = await UserService.getDetailsUser(id, token)
    dispatch(updateUser({...res?.data, access_token: token}))
          
  }

  return (
    <div>
      <Loading1 isLoading={isLoading}>
        <Router>
          <Routes>
            {routes.map((routes) => {
              const Page = routes.page
              const isCheckAuth = !routes.isPrivate || user.isAdmin
              const Layout = routes.isShowHeader ? DefaultComponent : Fragment
              return(
                <Route key={routes.path} path={isCheckAuth ? routes.path: undefined} element={
                  <Layout>
                    <Page/>
                  </Layout>
                } />
              )
            })}
          </Routes>
        </Router>
      </Loading1>
    </div>
  )
}
export default App