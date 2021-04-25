
import type {Room} from './Room';

function getRoomInfo(roomId: String, onRoomLoads: (room: Room) => void) {
  console.log('Getting info for room '+roomId);
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
      const room: Room = data;
      console.log('Leading room...')
      onRoomLoads(room);
    }).catch(e => console.log(e)));
}

export default getRoomInfo;