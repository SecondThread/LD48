import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import reportWebVitals from './reportWebVitals';
import TitleScreen from './titleScreen/TitleScreen';
import RoomScreen from './roomScreen/RoomScreen';
import GameScreen from './gameScreen/GameScreen';
import {Router, Route } from 'react-router';
import { createBrowserHistory } from 'history';

ReactDOM.render(
  <React.StrictMode>
    <Router history={createBrowserHistory({})}>
      <Route exact path="/" component={TitleScreen}/>
      <Route path = "/room/:roomId" component = {RoomScreen} />
      <Route path = "/game/:gameId" component = {GameScreen} />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
