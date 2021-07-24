import "./App.scss";
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Homepage from "./main/homepage";
import Lobby from "./main/lobby";
import Main from "./main/main";
import { MainProvider } from "./mainContext";
import { PlayersProvider } from "./playersContext";

function App(props) {
  return (
    <MainProvider>
      <PlayersProvider>
        <Router>
          <Switch>
            {/* <Route component={Default} /> */}
            <Route path="/" exact>
              <Homepage socket={props.socket} />
            </Route>
            <Route path="/lobby/:room">
              <Lobby socket={props.socket} />
            </Route>
            <Route path="/play">
              <Main socket={props.socket} />
            </Route>
          </Switch>
        </Router>
      </PlayersProvider>
    </MainProvider>
  );
}
export default App;

// function Default() {
//   return <Redirect to="/" />;
// }

// function Lobby({ socket }) {
//   const params = useLocation();
//   const [display, setDisplay] = useState({ display: "none" });
//   const [owner, setOwner] = useState(false);
//   // const [players, setPlayer] = useState([]);

//   useEffect(() => {
//     socket.on("updateUser", (data) => {
//       console.log(data);
//       // let p = [];
//       // data.forEach((pName) => {
//       //   p.push(pName);
//       // });
//       // setPlayer(p);
//     });

//     if (params.state) {
//       setOwner(params.state.owner);
//     }

//     if (owner) {
//       setDisplay({ display: "block" });
//     }
//   }, [owner, params, socket]);

//   if (params.state) {
//     return (
//       <div id="room" className="container mt-5">
//         <h1 id="room-name" owner="false">
//           Room - {params.state.room}
//         </h1>
//         <ul className="list-group" id="player-list">
//           {/* {players.map((player) => {
//             return (
//               <li className="list-group-item" key="tes">
//                 {player}
//               </li>
//             );
//           })} */}
//         </ul>
//         <button
//           id="start-game"
//           className="btn btn-light mt-3 w-100"
//           style={display}
//         >
//           Mulai
//         </button>
//       </div>
//     );
//   } else {
//     return <Redirect push to="/" />;
//   }
// }
// function Homepage({ socket }) {
//   const [room, setRoom] = useState("");
//   const [name, setName] = useState("");

//   useEffect(() => {
//     MySwal.fire({
//       title: "Masukan Nama Anda",
//       input: "text",
//       inputAttributes: {
//         style: "color: grey",
//       },
//       confirmButtonText: "Masuk",
//       inputValidator: (value) => {
//         if (!value) {
//           return "You need to write something!";
//         }
//       },
//     }).then((data) => {
//       setName(data.value);
//       socket.emit("username", data.value);
//       MySwal.close();
//     });
//   }, [socket]);

//   const history = useHistory();

//   const CreateRoom = () => {
//     const ranRoom = (min, max) => {
//       return Math.floor(Math.random() * (max - min + 1) + min);
//     };
//     const room = ranRoom(1000, 9999);
//     socket.emit("createRoom", room);
//     socket.on("joinedRoom", () => {
//       return history.push({
//         pathname: `/lobby/${room}`,
//         state: {
//           name: name,
//           owner: true,
//           room: room,
//         },
//       });
//     });
//   };

//   const joinRoom = () => {
//     socket.emit("joinRoom", room);
//     socket.on("joinedRoom", () => {
//       return history.push({
//         pathname: `/lobby/${room}`,
//         state: {
//           name: name,
//           owner: false,
//           room: room,
//         },
//       });
//     });
//     socket.on("joinError", (data) => {
//       MySwal.fire({
//         title: "Tidak bisa join room",
//         text: data,
//       }).then(setRoom(""));
//     });
//   };

//   return (
//     <div id="start" className="container mt-5">
//       <h1>Uno Game</h1>
//       <a href="carabermain.txt" target="_blank" className="btn btn-light">
//         Cara Bermain
//       </a>
//       <div className="row mt-2">
//         <div className="col-lg-12">
//           <button
//             id="create-room"
//             onClick={CreateRoom}
//             className="form-control"
//           >
//             Create Room
//           </button>
//         </div>
//       </div>
//       <div className="row mt-2">
//         <div className="col-lg-10">
//           <input
//             autoComplete="off"
//             type="text"
//             id="room-name-input"
//             className="form-control"
//             placeholder="Nama Room"
//             value={room}
//             onChange={(e) => setRoom(e.target.value)}
//           />
//         </div>
//         <div className="col-lg-2">
//           <button id="join-room" className="form-control" onClick={joinRoom}>
//             Masuk Room
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// function Lobby(props) {
//   if (name) {
//     return (
//       <div id="room" className="container mt-5">
//         <h1 id="room-name" owner="false">
//           Room - {props.match.params.room}
//         </h1>
//         <ul className="list-group" id="player-list"></ul>
//         <button id="start-game" className="btn btn-light mt-3 w-100">
//           Mulai
//         </button>
//       </div>
//     );
//   } else {
//     return <Redirect push to="/" />;
//   }
// }

// function Homepage() {
//   const [room, setRoom] = useState("");
//   useEffect(() => {
//     MySwal.fire({
//       title: "Masukan Nama Anda",
//       input: "text",
//       inputAttributes: {
//         style: "color: grey",
//       },
//       confirmButtonText: "Masuk",
//       inputValidator: (value) => {
//         if (!value) {
//           return "You need to write something!";
//         }
//       },
//     }).then((data) => {
//       name = data;
//       socket.emit("username", data.value);
//       MySwal.close();
//     });

//     socket.on("joinError", (data) => {
//       console.log(data);
//       MySwal.fire({ title: "Tidak bisa join room", text: data });
//     });

//     const ranRoom = (min, max) => {
//       return Math.floor(Math.random() * (max - min + 1) + min);
//     };
//     setRoom(ranRoom(1000, 9999));
//   }, []);

//   const CreateRoom = () => {
//     socket.emit("createRoom", room);
//   };

//   const joinRoom = () => {
//     socket.emit("joinRoom", room);
//   };

//   return (
//     <div id="start" className="container mt-5">
//       <h1>Uno Game</h1>
//       <a href="carabermain.txt" target="_blank" className="btn btn-light">
//         Cara Bermain
//       </a>
//       <div className="row mt-2">
//         <div className="col-lg-12">
//           <Link to={`/lobby/${room}`}>
//             <button
//               id="create-room"
//               onClick={CreateRoom}
//               className="form-control"
//             >
//               Create Room
//             </button>
//           </Link>
//         </div>
//       </div>
//       <div className="row mt-2">
//         <div className="col-lg-10">
//           <input
//             autoComplete="off"
//             type="text"
//             id="room-name-input"
//             className="form-control"
//             placeholder="Nama Room"
//             onChange={(e) => setRoom(e.target.value)}
//           />
//         </div>
//         <div className="col-lg-2">
//           <button id="join-room" className="form-control" onClick={joinRoom}>
//             Masuk Room
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
