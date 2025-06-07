import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import logo from "../assets/logopic.png";
import { UserDataContext } from '../context/UserContext'; // ✅ Import context

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useContext(UserDataContext); // ✅ Use context

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, {
        email,
        password
      });

      if (response.status === 200) {
        const data = response.data;
        setUser(data.user); // ✅ Save to context
        localStorage.setItem('token', data.token); // Save token to localStorage
        navigate('/home');
      }
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      // Optional: Show user feedback here
    }
  };

  return (
    <div className='p-7 h-screen flex flex-col justify-between'>
      <div>
        <img className='w-18 mb-10' src={logo} alt="Logo" />

        <form onSubmit={submitHandler}>
          <h3 className='text-lg font-medium mb-2'>What's your email</h3>
          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
            type="email"
            placeholder='email@example.com'
          />

          <h3 className='text-lg font-medium mb-2'>Enter Password</h3>
          <input
            className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            type="password"
            placeholder='password'
          />

          <button className='bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg'>
            Login
          </button>
        </form>

        <p className='text-center'>
          New here? <Link to='/signup' className='text-blue-600'>Create new Account</Link>
        </p>
      </div>

      <div>
        <Link
          to='/captain-login'
          className='bg-[#10b461] flex items-center justify-center text-white font-semibold mb-5 rounded-lg px-4 py-2 w-full text-lg'
        >
          Sign in as Captain
        </Link>
      </div>
    </div>
  );
};

export default UserLogin;
