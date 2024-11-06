import React, { useState, useRef } from 'react';

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
  const [formValue, setFormValue] = useState(initialState);
  const [showRegister, setShowRegister] = useState(false);
  const { email, password, confirmPassword, name } = formValue;

  // Use refs to hold input values without triggering re-renders
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  const toggleMode = () => {
    setShowRegister((prev) => !prev);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Update state only once on form submission
    setFormValue({
      email: emailRef.current?.value || "",
      password: passwordRef.current?.value || "",
      confirmPassword: confirmPasswordRef.current?.value || "",
      name: nameRef.current?.value || ""
    });
    console.log("Form submitted", {
      email: emailRef.current?.value,
      password: passwordRef.current?.value,
      confirmPassword: confirmPasswordRef.current?.value,
      name: nameRef.current?.value
    });
  };

  return (
    <div className="auth-container min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">{showRegister ? 'Sign Up' : 'Login'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {showRegister && (
            <div>
              <label className="block text-gray-700">Full Name:</label>
              <input
                ref={nameRef}
                type="text"
                defaultValue={name}
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          )}
          <div>
            <label className="block text-gray-700">Email:</label>
            <input
              ref={emailRef}
              type="email"
              defaultValue={email}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-700">Password:</label>
            <input
              ref={passwordRef}
              type="password"
              defaultValue={password}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          {showRegister && (
            <div>
              <label className="block text-gray-700">Confirm Password:</label>
              <input
                ref={confirmPasswordRef}
                type="password"
                defaultValue={confirmPassword}
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          )}
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">
            {showRegister ? 'Sign Up' : 'Login'}
          </button>
          <button type="button" onClick={toggleMode} className="w-full text-blue-500 hover:underline mt-4">
            {showRegister ? 'Switch to Login' : 'Switch to Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
