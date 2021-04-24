
import type {Room} from './Room';

function getRoomInfo(roomId: String, onRoomLoads: (room: Room) => void) {
    fetch('/api/getRoomInfo', {
        method: 'POST',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Credentials': 'true',
        },
        body: JSON.stringify({roomId}),
      }).then(res => res.json().then(data => {
        if (data==null) {
          console.log("Error!");
          console.log(res);
          return;
        }
        console.log("Just got info about room");
        console.log(data);
        const room: Room = data;
        onRoomLoads(room);
      }));
}

export default getRoomInfo;