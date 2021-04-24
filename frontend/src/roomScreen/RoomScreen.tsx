import { json } from 'express';
import { useState, useEffect } from 'react';

type Props= {
    roomId: string,
    username: string
};

const requestOptions = {
    method: 'POST',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Credentials': 'true',
    }
  };

function RoomScreen(props: Props) {
    const [myId, setMyId] = useState(null);
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
      }));
    }, []);
    return <div>
        <h1 className="">Lobby</h1>
    </div>;
}

export default RoomScreen;