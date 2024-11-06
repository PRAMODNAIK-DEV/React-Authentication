import React, { useEffect, useState } from 'react';
import { useLoginUserMutation } from '../services/api';
import { toast } from 'react-toastify';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks';
import { setUser } from '../features/auth/authSlice';

type UserInputType = {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
};

const initialState: UserInputType = {
  email: "",
  password: "",
  confirmPassword: "",
  name: ""
};

const Auth = () => {
  
  const [formData, setformData] = useState(initialState);
  const [showRegister, setShowRegister] = useState(false);

  const { email, password, confirmPassword, name } = formData;

  const [login, {data: loginData, error: loginError, isError: isLoginError, isLoading: isLoginLoading, isSuccess: isLoginSuccess}] = useLoginUserMutation();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() =>{
    if(isLoginSuccess){
        console.log("Logged In Successfully!")
        dispatch(setUser({name: loginData.access_token, token: loginData.refresh_token }));
        navigate("/dashboard");
    }
  },[isLoginSuccess, navigate]);


  const toggleMode = () => {
    setShowRegister((prev) => !prev);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log("e.target",e.target);
    const { name, value } = e.target;
    setformData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (showRegister && password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    // Handle login or signup logic here
    // console.log("Form submitted", formData);

    
    try{
        const response = await login({username: email, password}).unwrap();

        // dispatch(setUser({name: response.access_token, token: response.refresh_token }));
    }
    catch(errors){
         console.log("Failed to add user ");
    }
  };

  console.log(loginData);

  return (
    <div className="auth-container">
      <h2>{showRegister ? 'Sign Up' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        {showRegister && (
          <div>
            <label>Full Name:</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={handleChange}
              required
            />
          </div>
        )}
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
            required
          />
        </div>
        {showRegister && (
          <div>
            <label>Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
        )}
        <button type="submit">{showRegister ? 'Sign Up' : 'Login'}</button>
        <button type="button" onClick={toggleMode}>
          {showRegister ? 'Switch to Login' : 'Switch to Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default Auth;
