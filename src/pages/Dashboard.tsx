import React from 'react'
import { useAppDispatch } from '../app/hooks'
import { removeUser } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () =>{
    dispatch(removeUser());
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