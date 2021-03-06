import React, { useEffect, useContext } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useHistory } from "react-router-dom";
import { MainContext } from "../mainContext";
import { PlayersContext } from "../playersContext";
import { SocketContext } from "../socket";

const MySwal = withReactContent(Swal);

function Homepage() {
  const socket = useContext(SocketContext);
  const { name, setName, room, setRoom, setOwner } = useContext(MainContext);
  const { players, setPlayer } = useContext(PlayersContext);

  useEffect(() => {
    socket.on("users", (data) => {
      setPlayer(data);
    });
  }, [players, setPlayer, socket]);

  useEffect(() => {
    MySwal.fire({
      title: "Masukan Nama Anda",
      input: "text",
      inputAttributes: {
        style: "color: grey",
      },
      confirmButtonText: "Masuk",
      inputValidator: (value) => {
        if (!value) {
          return "You need to write something!";
        }
      },
    }).then((data) => {
      setName(data.value);
      MySwal.close();
    });
  }, [socket, setName]);

  const history = useHistory();

  const CreateRoom = () => {
    const ranRoom = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1) + min);
    };
    const room = ranRoom(1000, 9999);
    const owner = true;
    setRoom(room);
    socket.emit("login", { name, room, owner }, (error) => {
      if (error) {
        MySwal.fire({
          title: "Error",
          text: error,
        });
      }
      history.push({
        pathname: `/lobby/${room}`,
        state: {
          name: name,
          owner: true,
          room: room,
        },
      });
    });
  };

  const joinRoom = () => {
    socket.emit("login", { name, room }, (error) => {
      if (error) {
        MySwal.fire({
          title: "Error",
          text: error,
        });
        return (document.querySelector("#room-name-input").value = "");
      }
      setOwner(false);
      history.push({
        pathname: `/lobby/${room}`,
        state: {
          name: name,
          owner: false,
          room: room,
        },
      });
    });
  };

  return (
    <div id="start" className="container mt-5">
      <h1>Uno Game</h1>
      <a
        href={process.env.PUBLIC_URL + "/carabermain.txt"}
        target="_blank"
        rel="noreferrer"
        className="btn btn-light"
      >
        Cara Bermain
      </a>
      <div className="row mt-2">
        <div className="col-lg-12">
          <button
            id="create-room"
            onClick={CreateRoom}
            className="form-control"
          >
            Create Room
          </button>
        </div>
      </div>
      <div className="row mt-2">
        <div className="col-lg-10">
          <input
            autoComplete="off"
            type="text"
            id="room-name-input"
            className="form-control"
            placeholder="Nama Room"
            onChange={(e) => setRoom(e.target.value)}
          />
        </div>
        <div className="col-lg-2">
          <button id="join-room" className="form-control" onClick={joinRoom}>
            Masuk Room
          </button>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
