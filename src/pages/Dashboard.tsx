import React from 'react'
import { useAppDispatch } from '../app/hooks'
import { removeUserToken } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () =>{
    dispatch(removeUserToken());
    navigate("/");
  }
  return (
    <>
    <div>Dashboard</div>
    <button onClick={handleLogout}>Logout</button>
    </>
  )
}

export default Dashboard