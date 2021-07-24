import React, { useState, useEffect, useContext } from "react";
import { Redirect, useHistory, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { MainContext } from "../mainContext";
import { PlayersContext } from "../playersContext";

const MySwal = withReactContent(Swal);

function Lobby({ socket }) {
  const history = useHistory();
  const params = useLocation();
  const [display, setDisplay] = useState({ display: "none" });
  const [owner, setOwner] = useState(false);

  const { players, setPlayer } = useContext(PlayersContext);
  const { name } = useContext(MainContext);
  window.onpopstate = (e) => logout();

  const logout = () => {
    history.push("/");
    history.go(0);
  };
  useEffect(() => {
    if (!name) return history.push("/");
  }, [history, name]);

  useEffect(() => {
    console.log(players);
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
  }, [socket, setPlayer, players]);

  useEffect(() => {
    if (params.state) {
      setOwner(params.state.owner);
    }

    if (owner) {
      setDisplay({ display: "block" });
    }
  }, [owner, params]);

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
    socket.emit("start");
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
