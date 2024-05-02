import "./App.css";
import React, { useState } from "react";
import Hash from "./auth/hashcheckfile";
import ExcelSheet from "./ExcelSheet";
const App = () => {
  const [authenticated, setAuthenticated] = useState(false);

  const handleAuthentication = () => {
    setAuthenticated(true);
  };

  return (
    <div className="App font-roboto box-border m-0 p-0">
      {!authenticated ? (
        <Hash handleAuthentication={handleAuthentication} />
      ) : (
        <ExcelSheet />
      )}
    </div>
  );
};

export default App;