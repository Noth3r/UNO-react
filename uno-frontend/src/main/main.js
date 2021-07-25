import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import "../style/main.scss";
import { MainContext } from "../mainContext";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { SocketContext } from "../socket";
import swal from "sweetalert";

const MySwal = withReactContent(Swal);

function Main() {
  const socket = useContext(SocketContext);
  const [discardedCard, setDiscardedCard] = useState("/cards/0-0.png");
  const [messages, setMessages] = useState([]);
  const { name, room, owner } = useContext(MainContext);
  const [cards, setCards] = useState([]);
  const [msg, setMsg] = useState("");
  const [cardCount, setCardCount] = useState({});

  const backupName = name;
  const backupRoom = room;
  const history = useHistory();
  window.onpopstate = (e) => logout();

  useEffect(() => {
    if (!name) return history.push("/");
  }, [history, name]);

  useEffect(() => {
    socket.on("alert", (data) => {
      MySwal.fire({ title: data });
    });
  });

  useEffect(() => {
    socket.on("updateDiscarded", (data) => {
      if (data[0] == null) {
        const tes = data[1];
        setDiscardedCard(`/cards/${tes}.png`);
      } else {
        const tes = data[0] + "-" + data[1];
        setDiscardedCard(`/cards/${tes}.png`);
      }
    });
  }, [socket]);

  useEffect(() => {
    socket.on("end", (data) => {
      // socket.emit("win");
      MySwal.fire({
        title: "Permainan Berakhir",
        text: data + " memenangkan permainan",
      }).then(() => {
        swal({
          title: "Play Again?",
          buttons: { yes: "Yes BUG", no: "Nope" },
        }).then((value) => {
          switch (value) {
            case "yes":
              const playAgain = true;
              const name = backupName;
              socket.emit(
                "login",
                {
                  name,
                  room,
                  owner,
                  playAgain,
                },
                (error) => {
                  if (error) {
                    MySwal.fire({
                      title: "Error",
                      text: error,
                    }).then(() => {
                      history.push("/");
                      history.go(0);
                    });
                  }
                  history.push({
                    pathname: `/lobby/${room}`,
                    state: {
                      name: backupName,
                      owner: owner,
                      room: room,
                    },
                  });
                }
              );
              break;
            default:
              history.push("/");
              history.go(0);
              break;
          }
        });
      });
    });
  }, [backupName, backupRoom, history, owner, room, socket]);

  useEffect(() => {
    socket.on("updateUser", (data) => {
      setCardCount(cardCount);
    });
  }, [cardCount, socket]);

  useEffect(() => {
    socket.on("updateCards", (data) => {
      setCards(data);
    });
    return;
  }, [socket, cards]);

  useEffect(() => {
    socket.on("dc", (notif) => {
      if (notif?.title === "Someone just left") {
        MySwal.fire({
          title: "Seseorang Terputus dari Server",
          confirmButtonText: "Ok",
        }).then(() => {
          history.push("/");
          history.go(0);
          return;
        });
      }
    });
  }, [socket, history]);

  const logout = () => {
    history.push("/");
    history.go(0);
  };

  const closeForm = () => {
    document.getElementById("myForm").style.display = "none";
  };
  const openForm = () => {
    document.getElementById("myForm").style.display = "block";
  };

  const chat = () => {
    const msg = document.querySelector("#usermsg").value;
    document.querySelector("#usermsg").value = "";
    const player = name + ": ";
    const today = new Date();
    let minute = today.getMinutes();
    if (minute.toString().length === 1) {
      minute = "0" + minute;
    }
    const time =
      today.getHours() + ":" + minute + ":" + today.getSeconds() + " ";
    const hasil = { msg, player, time };
    socket.emit("chatSend", hasil);
  };

  useEffect(() => {
    socket.on("msg", (data) => {
      setMsg(data);
    });
  }, [socket]);

  useEffect(() => {
    socket.on("chatComing", (hasil) => {
      setMessages((oldArr) => [...oldArr, hasil]);
    });
  }, [socket]);

  const play = (i) => {
    console.log(i);
    socket.emit("play", i);
  };

  const draw = () => {
    socket.emit("draw");
  };

  return (
    <div id="game" className="container mt-5">
      <h1>Game</h1>
      <div className="row">
        <div className="col-2">
          <img
            alt="discarded"
            id="discarded-card"
            src={process.env.PUBLIC_URL + discardedCard}
            width="100%"
          />
        </div>
        <div className="col-2">
          <img
            alt="draw"
            id="draw"
            src={process.env.PUBLIC_URL + "/cards/uno.png"}
            width="100%"
            onClick={draw}
          />
        </div>
      </div>
      <ul className="list-group mt-2" id="card-count">
        {Object.entries(cardCount)}
      </ul>
      <div className="alert alert-success mt-2" role="alert" id="msg">
        {msg}
      </div>
      <div className="card mt-2">
        <div className="card-body">
          <div className="row row-cols-4" id="card-list">
            {cards.map((card, i) => {
              if (card[1] < 13) {
                return (
                  <div
                    className="col-"
                    id={`card-${i}`}
                    key={i}
                    onClick={() => play(i)}
                  >
                    <img
                      src={
                        process.env.PUBLIC_URL +
                        `/cards/${card[0]}-${card[1]}.png`
                      }
                      width="100%"
                      alt={i}
                      height="auto"
                    />
                  </div>
                );
              } else {
                return (
                  <div className="col-" id={`card-${i}`} key={i}>
                    <img
                      src={process.env.PUBLIC_URL + `/cards/${card[1]}.png`}
                      width="100%"
                      alt={i}
                      height="auto"
                      onClick={() => {
                        swal("Pilih Warna", {
                          buttons: {
                            0: "Merah",
                            1: "Kuning",
                            2: "Biru",
                            3: "Hijau",
                          },
                        }).then((warna) => {
                          if (warna != null) {
                            socket.emit("play", [i, parseInt(warna)]);
                          }
                        });
                      }}
                    />
                  </div>
                );
              }
            })}
          </div>
        </div>
      </div>
      <div id="notif">
        <div className="msgln">
          <b>Chat Notification</b>
        </div>
      </div>
      <button className="open-button" onClick={openForm}>
        Chat
      </button>

      <div className="chat-popup" id="myForm">
        <div id="login" className="form-container">
          <h1 id="h1chat">Login</h1>
          <input
            autoComplete="off"
            id="username"
            type="text"
            placeholder="Masukkan Nama Anda"
          />
          <button type="submit" id="submitmsg" className="btn">
            Login
          </button>
        </div>
        <div id="chat" className="form-container">
          <h1 id="h1chat">Chat</h1>

          <div id="chatbox">
            {messages.length > 0 ? (
              messages.map((msg, i) => {
                return (
                  <div key={i} className="msgln">
                    {" "}
                    <span className="chat-time">{msg.time}</span>
                    <b className="user-name">{msg.player}</b>
                    {msg.msg}
                    <br></br>
                  </div>
                );
              })
            ) : (
              <div className="msgln"></div>
            )}
          </div>
          <input
            autoComplete="off"
            name="usermsg"
            type="text"
            id="usermsg"
            placeholder="Type message..."
          />
          <button type="submit" id="submitmsg" className="btn" onClick={chat}>
            Send
          </button>
          <button type="button" className="btn cancel" onClick={closeForm}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default Main;
