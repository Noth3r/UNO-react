import React, { useState } from "react";

const PlayersContext = React.createContext();

const PlayersProvider = ({ children }) => {
  const [players, setPlayer] = useState([]);
  const [id, setId] = useState(0);

  return (
    <PlayersContext.Provider value={{ players, setPlayer, id, setId }}>
      {children}
    </PlayersContext.Provider>
  );
};

export { PlayersContext, PlayersProvider };
