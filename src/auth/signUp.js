// src/pages/SignUp.js
import React, { useState } from "react";
import axios from "axios";
import OtpPopup from "../components/otpVerification";

const SignUp = ({ history }) => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    phoneNumber: "",
    companyName: "",
    password: "",
  });
  const [showOtpPopup, setShowOtpPopup] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://ahmserver.vercel.app/api/OTP/send-otp-email", {
        email: formData.email,
      });
      alert("OTP has been sent!");
      setShowOtpPopup(true);
    } catch (error) {
      console.error("Error sending OTP", error);
    }
  };

  const handleOtpSuccess = () => {
    setShowOtpPopup(false);
    history.push("/home");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6">Sign Up</h2>
        <form onSubmit={handleSignUp}>
          <div className="mb-4">
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Company Name</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            Sign Up
          </button>
        </form>
        {showOtpPopup && (
          <OtpPopup
            formData={formData}
            onClose={() => setShowOtpPopup(false)}
            onSuccess={handleOtpSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default SignUp;
