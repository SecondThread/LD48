import React, { useState, useEffect } from 'react';
import {useLocation, useHistory} from 'react-router-dom';
import {toast} from 'react-toastify';
import './TitleScreen.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function onClickJoinPublicRoom(name: string): void {
  //TODO: get public room
  console.log('Getting public room for '+name);

}

function onClickCreatePrivateRoom(name: string): void {
  //TODO: get private room
  console.log('Getting private room for '+name);

}

function TitleScreen() {
  const [name, setName] = useState('');
  const search = useLocation().search;
  
  const full = new URLSearchParams(search).get('lobbyFull');
  const history = useHistory();
  
  useEffect(() => {
    if (full != null) {
      //TODO toast!
      toast.error('Match is full');
      const searchParams = new URLSearchParams(search);
      searchParams.delete('lobbyFull');
      history.push(searchParams.toString());
    }
  }, [full, history, search]);

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
            <button type="button" className="normalMargin btn btn-dark" onClick={() => onClickJoinPublicRoom(name)}>
              Join Public Room
            </button>
            <button type="button" className="normalMargin btn btn-dark" onClick={() => onClickCreatePrivateRoom(name)}>
              Create Private Room
            </button>
        </div>
      </div>
    </div>
  );
}

export default TitleScreen;
