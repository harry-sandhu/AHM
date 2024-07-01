import "./App.css";
import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Hash from "./auth/hashcheckfile";
import ExcelSheet from "./ExcelSheet";

const App = () => {
  const [authenticated, setAuthenticated] = useState(true);

  const handleAuthentication = () => {
    setAuthenticated(true);
  };

  return (
    <Router>
      <div className="App font-roboto box-border m-0 p-0">
        {!authenticated ? (
          <Hash handleAuthentication={handleAuthentication} />
        ) : (
          <div className="h-screen overflow-y-auto">
            <ExcelSheet />
          </div>
        )}
      </div>
    </Router>
  );
};

export default App;
