import { useState, useEffect } from 'react';
import {useLocation, useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

type HasRoomId = {
  roomId: string
}

function RoomScreen() {
  const location=useLocation();
  const search = location.search;  
  const nickname = new URLSearchParams(search).get('nickname');
  const [name, setName] = useState(nickname);
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
    //TODO: return screen asking them to type in their nickname
    return (
      <div>
          

      </div>
    );
  }
  toast.success('Name is '+name);
  return (
    <div>
        Room Screen {name} {roomId} 
    </div>
  );
}

export default RoomScreen;
