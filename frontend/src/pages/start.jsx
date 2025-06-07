import React from 'react';
import logo from '../assets/logopic.png';
import { Link } from 'react-router-dom';
import logobg from '../assets/logobg.svg';

const Start = () => {
  console.log('logobg:', logobg); // Debug the image import

  return (
    <div>
      <div
       style={{
  backgroundImage: `url(https://images.unsplash.com/photo-1566243052021-d39ace07c392?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`,
 backgroundSize: 'cover',          // Fills entire container, cropping if needed
  backgroundPosition: 'center',     // Keeps image centered
  backgroundRepeat: 'no-repeat',
}}

        className="h-screen pt-8 flex justify-between flex-col w-full"
      >
        <img className="w-16 ml-8" src={logo} alt="logo" />
        <div className="bg-white pb-8 py-4 px-4">
          <h2 className="text-[30px] font-semibold">Get Started with PickUpPal</h2>
          <p className="text-[18px] text-gray-600 mt-2">Your Ride, Your Time</p>
          <p className="text-[14px] text-gray-500 mt-1">
            Book rides effortlessly, share with friends, and travel on your schedule.
          </p>
          <Link
            to="/login"
            className="flex items-center justify-center w-full bg-black text-white py-3 rounded-lg mt-5"
          >
            Continue
          </Link>
         
        </div>
      </div>
    </div>
  );
};

export default Start;