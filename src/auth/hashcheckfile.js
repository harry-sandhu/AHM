import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

const storedHashValue = "Ahm@2719";
const storedUsername = "Manjeet";

const checkCredentials = (username, password, handleAuthentication) => {
  if (username === storedUsername && password === storedHashValue) {
    console.log("Credentials match! Opening Excel sheet...");
    handleAuthentication();
  } else {
    console.log("Credentials mismatch. Please try again.");
    toast.error("Credentials mismatch. Please try again.", {
      position: toast.POSITION.TOP_RIGHT,
    });
  }
};

const Hash = ({ handleAuthentication }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      checkCredentials(username, password, handleAuthentication);
    }
  };

  const navigate = useNavigate();

  return (
    <section className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="bg-gray-100 flex rounded-2xl shadow-lg max-w-3xl p-5 items-center">
        <div className="md:w-1/2 px-8 md:px-16">
          <h2 className="font-bold text-2xl text-[#002D74]">Login</h2>
          <p className="text-xs mt-4 text-[#002D74]">
            Please enter your username and password to continue
          </p>

          <form noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              onChange={handleUsernameChange}
              onKeyPress={handleKeyPress}
            />
            <div className="relative">
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={handlePasswordChange}
                onKeyPress={handleKeyPress}
              />
            </div>
            <Button
              type="button"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              className="bg-[#05AB2A] text-[#F3FFF1] flex shadow-[0px_4px_3px_rgba(0,0,0,0.25)] py-1 px-4 rounded mx-60 my-8 text-sm font-thin"
              onClick={() =>
                checkCredentials(username, password, handleAuthentication)
              }
            >
              Check Password
            </Button>
          </form>
        </div>

        <div className="md:block hidden w-1/2 ">
          <img className="rounded-2xl" src="Images/truck.jpg" alt="Login" />
        </div>
      </div>
    </section>
  );
};

export default Hash;
