import React, { useState } from "react";

const PlayersContext = React.createContext();

const PlayersProvider = ({ children }) => {
  const [players, setPlayer] = useState([]);

  return (
    <PlayersContext.Provider value={{ players, setPlayer }}>
      {children}
    </PlayersContext.Provider>
  );
};

export { PlayersContext, PlayersProvider };
