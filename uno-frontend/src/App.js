import "./App.scss";
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Homepage from "./main/homepage";
import Lobby from "./main/lobby";
import Main from "./main/main";
import { MainProvider } from "./mainContext";
import { PlayersProvider } from "./playersContext";
import { SocketProvider } from "./socket";

function App() {
  return (
    <SocketProvider>
      <MainProvider>
        <PlayersProvider>
          <Router>
            <Switch>
              {/* <Route component={Default} /> */}
              <Route path="/" exact>
                <Homepage />
              </Route>
              <Route path="/lobby/:room">
                <Lobby />
              </Route>
              <Route path="/play">
                <Main />
              </Route>
            </Switch>
          </Router>
        </PlayersProvider>
      </MainProvider>
    </SocketProvider>
  );
}
export default App;
