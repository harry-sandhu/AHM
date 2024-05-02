import React, { useState } from "react";

const storedHashValue = "Ahm@2719";

const checkHash = (inputValue, handleAuthentication) => {
  if (inputValue === storedHashValue) {
    console.log("Hash matches! Opening Excel sheet...");
    handleAuthentication();
  } else {
    console.log("Hash mismatch. Please try again.");
  }
};

const Hash = ({ handleAuthentication }) => {
  const [inputValue, setInputValue] = useState("");

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      checkHash(inputValue, handleAuthentication);
    }
  };

  return (
    <form className="flex justify-center items-center h-screen max-w-10">
      <div className="relative">
        <input
          type="text"
          placeholder="Enter Password Value"
          value={inputValue}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          className="mb-4 w-full p-3 border rounded outline-none"
        />
        <button
          className="w-10 bg-blue-500 text-white py-2 rounded"
          onClick={() => checkHash(inputValue, handleAuthentication)}
        >
          Check Password
        </button>
      </div>
    </form>
  );
};

export default Hash;
