import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import "../style/main.scss";
import { MainContext } from "../mainContext";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

function Main({ socket }) {
  const [discardedCard, setDiscardedCard] = useState(
    process.env.PUBLIC_URL + "/cards/0-0.png"
  );
  const [messages, setMessages] = useState([]);
  const { name } = useContext(MainContext);

  const history = useHistory();
  window.onpopstate = (e) => logout();

  useEffect(() => {
    if (!name) return history.push("/");
  }, [history, name]);

  useEffect(() => {
    socket.on("notification", (notif) => {
      if (notif?.title === "Someone just left") {
        MySwal.fire({
          title: "Seseorang Terputus dari Server",
          confirmButtonText: "Ok",
        }).then(() => {
          history.push("/");
          history.go(0);
        });
      }
    });
  });

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
    socket.on("chatComing", (hasil) => {
      setMessages((oldArr) => [...oldArr, hasil]);
    });
  }, [socket]);

  return (
    <div id="game" className="container mt-5">
      <h1>Game</h1>
      <div className="row">
        <div className="col-2">
          <img
            alt="discarded"
            id="discarded-card"
            src={discardedCard}
            width="100%"
          />
        </div>
        <div className="col-2">
          <img
            alt="draw"
            id="draw"
            src={process.env.PUBLIC_URL + "/cards/uno.png"}
            width="100%"
          />
        </div>
      </div>
      <ul className="list-group mt-2" id="card-count"></ul>
      <div className="alert alert-success mt-2" role="alert" id="msg"></div>
      <div className="card mt-2">
        <div className="card-body">
          <div className="row row-cols-4" id="card-list"></div>
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
