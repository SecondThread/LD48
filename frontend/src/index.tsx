import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import TitleScreen from './titleScreen/TitleScreen';
import RoomScreen from './roomScreen/RoomScreenEntry';
import GameScreen from './gameScreen/GameScreen';
import { Router, Route} from 'react-router';
import { createBrowserHistory } from 'history';
import { ToastContainer } from 'react-toastify';
import {Switch} from 'react-router-dom';

ReactDOM.render(
  <div>
    <Router history={createBrowserHistory({})}>
      <Switch>
        <Route exact path = "/" component={TitleScreen}/>
        <Route exact path = "/asdf" component = {TitleScreen} />
        <Route path = "/room/:roomId" component = {RoomScreen} />
        <Route path = "/game/:gameId" component = {GameScreen} />
      </Switch>
    </Router>
    <ToastContainer/>
  </div>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
