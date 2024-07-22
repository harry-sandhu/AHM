// src/components/OtpPopup.js
import React, { useState } from "react";
import axios from "axios";

const OtpPopup = ({ formData, onClose, onSuccess }) => {
  const [otp, setOtp] = useState("");

  const handleVerifyOtp = async () => {
    const payload = {
      email: formData.email,
      otp: otp.trim(), // Ensure no extra spaces
    };

    console.log("Sending payload:", payload);

    try {
      const response = await axios.post(
        "http://localhost:80/api/OTP/verify-otp",
        payload
      );
      console.log("Response:", response.data);
      if (response.data.message === "OTP verified successfully") {
        // Save the sign-up data only if the OTP is correct
        await axios.post(
          "https://ahmserver.vercel.app/api/auth/sign-up",
          formData
        );
        localStorage.setItem("token", response.data.token);
        onSuccess();
      } else {
        alert("Invalid OTP");
      }
    } catch (error) {
      console.error("Error verifying OTP", error);
      if (error.response) {
        console.log("Error response data:", error.response.data);
      }
    }
  };

  const handleResendOtp = async () => {
    try {
      await axios.post("https://ahmserver.vercel.app/api/OTP/send-otp-email", {
        email: formData.email,
      });
      alert("OTP has been sent!");
    } catch (error) {
      console.error("Error sending OTP", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4">Verify OTP</h2>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full px-3 py-2 border rounded mb-4"
        />
        <button
          onClick={handleVerifyOtp}
          className="w-full bg-green-500 text-white py-2 rounded"
        >
          Verify OTP
        </button>
        <button
          onClick={handleResendOtp}
          className="w-full bg-gray-500 text-white py-2 rounded mt-2"
        >
          Resend OTP
        </button>
        <button
          onClick={onClose}
          className="w-full bg-red-500 text-white py-2 rounded mt-2"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default OtpPopup;
