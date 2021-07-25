import React, { useState, useEffect, useContext } from "react";
import { Redirect, useHistory, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { MainContext } from "../mainContext";
import { PlayersContext } from "../playersContext";
import { SocketContext } from "../socket";
const MySwal = withReactContent(Swal);

function Lobby() {
  const socket = useContext(SocketContext);
  const history = useHistory();
  const params = useLocation();
  const [display, setDisplay] = useState({ display: "none" });

  const { players } = useContext(PlayersContext);
  const { name, owner, setOwner, playAgain, setName } = useContext(MainContext);
  window.onpopstate = (e) => logout();

  useEffect(() => {
    setName(params.state.name);
  }, [setName, params]);

  const logout = () => {
    history.push("/");
    history.go(0);
  };
  useEffect(() => {
    if (!name) return history.push("/");
  }, [history, name]);

  useEffect(() => {
    socket.on("disconnect", () => {
      setOwner(false);
    });
  });

  useEffect(() => {
    socket.on("changeOwner", () => {
      setOwner(true);
    });
  }, [socket, setOwner]);

  useEffect(() => {
    socket.on("notOwner", () => {
      setOwner(false);
    });
  }, [socket, setOwner]);

  useEffect(() => {
    socket.on("notification", (notif) => {
      if (notif?.owner) {
        setOwner(true);
        socket.emit("changeOwner");
      }
      MySwal.fire({
        title: notif?.title,
        text: notif?.description,
      });
    });
  }, [socket, setOwner]);

  useEffect(() => {
    if (params.state) {
      setOwner(params.state.owner);
    }

    if (owner) {
      setDisplay({ display: "block" });
    }
  }, [owner, params, setOwner]);

  useEffect(() => {
    socket.on("play", () => {
      history.push("/play");
    });
  });

  const cekLogin = () => {
    if (!params.state) {
      return false;
    }
    return true;
  };

  const start = () => {
    socket.emit("start", playAgain);
  };

  if (cekLogin()) {
    return (
      <div id="room" className="container mt-5">
        <h1 id="room-name" owner="false">
          Room - {params.state.room}
        </h1>
        <ul className="list-group" id="player-list">
          {players.map((player) => {
            return (
              <li className="list-group-item" key={player.id}>
                {player.name}
              </li>
            );
          })}
        </ul>
        <button
          id="start-game"
          className="btn btn-light mt-3 w-100"
          style={display}
          onClick={start}
        >
          Mulai
        </button>
      </div>
    );
  } else {
    return <Redirect to="/" />;
  }
}

export default Lobby;
