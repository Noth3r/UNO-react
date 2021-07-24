import React from "react";
import "../style/main.scss";

function Main({ socket }) {
  return (
    <div id="game" class="container mt-5">
      <h1>Game</h1>
      <div class="row">
        <div class="col-2">
          <img
            alt="discarded"
            id="discarded-card"
            src={process.env.PUBLIC_URL + "/cards/0-0.png"}
            width="100%"
          />
        </div>
        <div class="col-2">
          <img
            alt="draw"
            id="draw"
            src={process.env.PUBLIC_URL + "/cards/uno.png"}
            width="100%"
          />
        </div>
      </div>
      <ul class="list-group mt-2" id="card-count"></ul>
      <div class="alert alert-success mt-2" role="alert" id="msg"></div>
      <div class="card mt-2">
        <div class="card-body">
          <div class="row row-cols-4" id="card-list"></div>
        </div>
      </div>
      <div id="notif">
        <div class="msgln">
          <b>Chat Notification</b>
        </div>
      </div>
      <button class="open-button" onclick="openForm()">
        Chat
      </button>

      <div class="chat-popup" id="myForm">
        <div id="login" class="form-container">
          <h1 id="h1chat">Login</h1>
          <input
            autoComplete="off"
            id="username"
            type="text"
            placeholder="Masukkan Nama Anda"
          />
          <button type="submit" id="submitmsg" class="btn" onclick="login()">
            Login
          </button>
        </div>
        <div id="chat" class="form-container">
          <h1 id="h1chat">Chat</h1>

          <div id="chatbox"></div>
          <input
            autoComplete="off"
            name="usermsg"
            type="text"
            id="usermsg"
            placeholder="Type message..."
          />
          <button type="submit" id="submitmsg" class="btn" onclick="chat()">
            Send
          </button>
          <button type="button" class="btn cancel" onclick="closeForm()">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default Main;
