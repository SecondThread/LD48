import React, { useState } from 'react';
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
