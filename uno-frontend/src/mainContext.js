import React, { useState } from "react";

const MainContext = React.createContext();

const MainProvider = ({ children }) => {
  const [room, setRoom] = useState("");
  const [name, setName] = useState("");
  const [owner, setOwner] = useState(false);
  const [playAgain, setPlayAgain] = useState(false);

  return (
    <MainContext.Provider
      value={{
        name,
        room,
        owner,
        playAgain,
        setName,
        setRoom,
        setOwner,
        setPlayAgain,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};

export { MainContext, MainProvider };
