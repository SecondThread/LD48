
import { useState, useEffect } from 'react';
import getRoomInfo from '../gameScreen/getRoomInfo';
import { useInterval } from '../gameScreen/useInterval';
import type {Player} from '../gameScreen/Player';
import './RoomScreen.css';
import {CopyToClipboard} from 'react-copy-to-clipboard';

type Props= {
    roomId: string,
    username: string
};

function RoomScreen(props: Props) {
    const [myId, setMyId] = useState(null);
    const [players, setPlayers] = useState(Array<Player>());
    const [started, setStarted] = useState(false);
    const [secondUntilStart, setSecondUntilStart] = useState(60);

    useEffect(() => {
      fetch('/api/addPlayerToRoom', {
        method: 'POST',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Credentials': 'true',
        },
        body: JSON.stringify({
          username: props.username,
          roomId: props.roomId,
        }),
      }).then(res => res.json().then(data => {
        console.log('Added myself to room! '+data);
        setMyId(data);
      }));
    }, [props.username, props.roomId]);

    const linkToCopy='deeperunder.com/room/'+props.roomId;

    useInterval(()=> getRoomInfo(props.roomId, match => {
      setPlayers(match.players);
      const currentTime=new Date().getTime();
      const started=currentTime>match.startTime;
      setStarted(started);
      setSecondUntilStart(Math.round((match.startTime-currentTime)/1000));
    }), 1000);

    return <div className = "centerContent">
        <h1 className="centerText">Lobby</h1>
        <div className="tableWidth automargin">
          Invite Friends: 
          <CopyToClipboard text={linkToCopy} >
            <button type="button" className="normalMargin btn btn-dark normal" >Copy Shareable Link</button>
          </CopyToClipboard>
        </div>
        <div className="tableWidth centerText automargin ">
          <div className="normalMargin">
            Match starting in {secondUntilStart}...
          </div>
        </div>
        <table className="table tableWidth automargin">
          <thead>
            <tr>
              <th scope="col" className="smallWidth"></th>
              <th scope="col">Name</th>
            </tr>
            {players.map((player, id) =>
              <tr key={id}>
                <td className="smallWidth">{player._id===myId?"You ->":""}</td>
                <td>{player.username}</td>
              </tr>
            )}
          </thead>
        </table>
    </div>;
}

export default RoomScreen;