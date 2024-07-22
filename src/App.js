// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import SignUp from "./auth/signUp";
import SignIn from "./auth/signIn";
import ForgotPassword from "./auth/hashcheckfile";
import UpdateDetails from "./pages/accountSetting";
import HomePage from "./pages/homePage";
import ExcelPage from "./ExcelSheet";

// Helper component to protect routes
const PrivateRoute = ({ children }) => {
  return localStorage.getItem("token") ? children : <Navigate to="/sign-in" />;
};

const PublicRoute = ({ children }) => {
  return localStorage.getItem("token") ? <Navigate to="/home" /> : children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/sign-up"
          element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          }
        />
        <Route
          path="/sign-in"
          element={
            <PublicRoute>
              <SignIn />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/update-details"
          element={
            <PrivateRoute>
              <UpdateDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/excel"
          element={
            <PrivateRoute>
              <ExcelPage />
            </PrivateRoute>
          }
        />
        <Route
          path="*"
          element={
            <Navigate
              to={localStorage.getItem("token") ? "/home" : "/sign-up"}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
