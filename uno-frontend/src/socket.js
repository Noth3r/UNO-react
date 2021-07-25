import React from "react";
import io from "socket.io-client";

const SocketContext = React.createContext();
const SocketProvider = ({ children }) => {
  const url = "http://localhost:8000/";
  const socket = io(url, {
    transports: ["websocket", "polling"],
  });
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export { SocketContext, SocketProvider };
