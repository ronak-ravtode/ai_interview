import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import Interview from './pages/Interview'
import { use } from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import { setUserData } from './redux/userSlice'
import { useDispatch } from 'react-redux'

export const ServerURL = "http://localhost:8000"

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const getUser = async() => {
      try {
        const res = await axios.get(`${ServerURL}/api/user/current-user`, {withCredentials: true})
        const data = res.data;
        dispatch(setUserData(data));
      } catch (error) {
        console.log(error)
        dispatch(setUserData(null));
      }
    }
    getUser()
  },[dispatch])
  return (
    <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/auth' element={<Auth />} /> 
        <Route path ='/interview' element={<Interview />} />

    </Routes>
  )
}

export default App
