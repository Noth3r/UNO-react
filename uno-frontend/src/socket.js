import React from "react";
import io from "socket.io-client";

const SocketContext = React.createContext();
const SocketProvider = ({ children }) => {
  const socket = io();
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export { SocketContext, SocketProvider };
