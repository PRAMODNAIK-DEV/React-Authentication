import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import { ToastContainer } from 'react-toastify';
import { useAppDispatch } from './app/hooks';
import { setUserToken } from './features/auth/authSlice';

function App() {

  const dispatch = useAppDispatch();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // THis is a traditional logic, SO when the app loads or user refresh the page then the All the app's state in the store will be resetted to intitial state, So to set the token back from the preserved localStorage.
  useEffect(() => {
    dispatch(setUserToken(user));
  })
  return (
    <div className="App">
      <BrowserRouter>
      <ToastContainer/>
      <Routes>
        <Route path='/' element={<Navigate to="/auth" replace />}/>
        <Route path='/auth' element={<Auth/>} />
        <Route path='/dashboard' element={<Dashboard/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
