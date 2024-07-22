// src/pages/HomePage.js
import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center flex-col">
      <h1 className="text-3xl font-bold mb-4">Welcome to the Home Page!</h1>
      <button
        onClick={() => navigate("/excel")}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Go to Excel Files
      </button>
    </div>
  );
};

export default HomePage;
