import { useState, useEffect } from 'react';
import {useLocation, useHistory } from 'react-router-dom';
import {toast} from 'react-toastify';
import './TitleScreen.css';

const requestOptions = {
  method: 'POST',
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Credentials': 'true',
  }
};

function onClickJoinPublicRoom(name: string, historyPush: (goTo: string) => void): void {
  console.log('Getting public room for '+name);
  fetch('api/joinPublicRoom', requestOptions).then(res => {
    console.log(res);
    res.json().then(data => {
      historyPush('/room/'+data+'?nickname='+name);
    }).catch((err) => res.text().then(x =>console.log(x)));
  });
}

function onClickCreatePrivateRoom(name: string, historyPush: (goTo: string) => void): void {
  console.log('Getting private room for '+name);
  fetch('api/createPrivateRoom', requestOptions).then(res => {
    console.log(res);
    res.json().then(data => {
      historyPush('/room/'+data+'?nickname='+name);
    }).catch((err) => res.text().then(x =>console.log(x)));
  });
}

function TitleScreen() {
  const [name, setName] = useState('');
  const location = useLocation();
  const search = location.search;
  
  const full = new URLSearchParams(search).get('lobbyFull');
  const history = useHistory();
  
  useEffect(() => {
    if (full != null) {
      //TODO toast!
      toast.error('Match is full');
      const searchParams = new URLSearchParams(search);
      searchParams.delete('lobbyFull');
      history.replace(location.pathname+searchParams.toString());
    }
  }, [full, history, search, location]);

  return (
    <div>
      <div className="container">
        <div className="row justify-content-center">
          <h1 className="headingWithLotsOfSpaceBelow">Under</h1>
        </div>
        <div className="row justify-content-center">
          <div className="col-5">
            <div className="form-group nicknameField">
              <input type="text" className="form-control" id="usr" placeholder="Nickname" 
                value={name} 
                onChange={e=>setName(e.target.value)}/>
            </div>
          </div>
        </div>
        <div className="row justify-content-center">
            <button type="button" className="normalMargin btn btn-dark" 
              onClick={() => onClickJoinPublicRoom(name, x=>history.push(x))}
            >
              Join Public Room
            </button>
            <button type="button" className="normalMargin btn btn-dark" 
              onClick={() => onClickCreatePrivateRoom(name, x=>history.push(x))}
            >
              Create Private Room
            </button>
        </div>
      </div>
    </div>
  );
}

export default TitleScreen;
