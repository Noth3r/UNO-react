import React, { useState } from "react";

const MainContext = React.createContext();

const MainProvider = ({ children }) => {
  const [room, setRoom] = useState("");
  const [name, setName] = useState("");
  const [owner, setOwner] = useState(false);

  return (
    <MainContext.Provider
      value={{ name, room, owner, setName, setRoom, setOwner }}
    >
      {children}
    </MainContext.Provider>
  );
};

export { MainContext, MainProvider };
