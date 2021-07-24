import React, { useState } from "react";

const MainContext = React.createContext();

const MainProvider = ({ children }) => {
  const [room, setRoom] = useState("");
  const [name, setName] = useState("");

  return (
    <MainContext.Provider value={{ name, room, setName, setRoom }}>
      {children}
    </MainContext.Provider>
  );
};

export { MainContext, MainProvider };
