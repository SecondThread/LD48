
import { useState, useEffect } from 'react';
import {useLocation, useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import RoomScreen from './RoomScreen';

type HasRoomId = {
  roomId: string
}

function RoomScreenEntry() {
  const location=useLocation();
  const search = location.search;  
  const nickname = new URLSearchParams(search).get('nickname');
  const [name, setName] = useState(nickname);
  const [nameToSet, setNameToSet] = useState('');
  const history=useHistory();
  const {roomId} = useParams<HasRoomId>();
  

  //remove nickname from the url after we have it
  useEffect(() => {
    if (nickname != null) {
      // then we need to remove it from the url
      const searchParams = new URLSearchParams(search);
      searchParams.delete('nickname');
      history.replace(location.pathname+searchParams.toString());
    }
  }, [search, nickname, history, location]);

  if (name==null) {  
    return (
      <div className="container">
          <div className="row justify-content-center">
            <h1 className="headingWithLotsOfSpaceBelow">Join Room {"..."+roomId.substr(roomId.length-5, roomId.length)}</h1>
          </div>
          <div className="row justify-content-center">
          <div className="col-5">
              <div className="form-group nicknameField">
              <input type="text" className="form-control" id="usr" placeholder="Nickname" 
                  value={nameToSet} 
                  onChange={e=>setNameToSet(e.target.value)}/>
              </div>
          </div>
          </div>
          <div className="row justify-content-center">
          <button className="normalMargin btn btn-dark"  onClick={() => setName(nameToSet)}>
              Join Room
          </button>
          </div>
      </div>
    );
  }
  toast.success('Name is '+name);
  return (
    <div>
        <RoomScreen username={name} roomId={roomId} />
    </div>
  );
}

export default RoomScreenEntry;
