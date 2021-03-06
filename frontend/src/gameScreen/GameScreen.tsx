import drawImage, { drawText, getCameraPosition, screenPointToWorldPoint, setCTX, getCameraWidth } from './drawing/ImageLoader';
import GameObject from './GameObject';
import BubbleSource from './BubbleSource';
import Island from './Island';
import "./GameScreen.css"
import Vec from './geo/Vec';
import { useInterval } from './useInterval';
import Target from './Target';
import CollisionSeg from './CollisionSeg';
import Frog from './Frog';
import getRoomInfo from './getRoomInfo';
import Blood from './Blood';
import Treasure from './Treasure';
import Bank from './Bank';
import { useRef, useEffect } from 'react';

type Props = {
  roomId: string,
  playerId: string,
  roomEndTime: number,
  nickname: string,
}

const collisionSegs: Array<CollisionSeg> = [
  //collision segs for grass islands
  new CollisionSeg(new Vec(-80, 10), new Vec(-60, 10), 2),
  new CollisionSeg(new Vec(-45, 10), new Vec(-25, 10), 3),
  new CollisionSeg(new Vec(-10, 10), new Vec(10, 10), 2),
  new CollisionSeg(new Vec(24, 10), new Vec(57, 10), 2),
  new CollisionSeg(new Vec(75, 10), new Vec(85, 10), 2),

  //collision segs for rock islands
  new CollisionSeg(new Vec(75, -18), new Vec(83, -19), 2),
  new CollisionSeg(new Vec(24, -7), new Vec(35, -8), 2),
  new CollisionSeg(new Vec(-2, -33.5), new Vec(20, -34), 1.5),
  new CollisionSeg(new Vec(-53, -28.5), new Vec(-45.5, -27.8), 2),
  new CollisionSeg(new Vec(-76, -18), new Vec(-86, -17), 2),


  //Collision segs for the boarder walls
  new CollisionSeg(new Vec(-100, -50), new Vec(100, -50), 3),
  new CollisionSeg(new Vec(-100, 50), new Vec(-100, -50), 1.5),
  new CollisionSeg(new Vec(100, 50), new Vec(100, -50), 1.5),
];

const targets: Array<Target> = [
  //targets
  new Target(new Vec(-77, 12.7)),
  new Target(new Vec(-63, 13.3)),
  new Target(new Vec(-45, 12.3)),
  new Target(new Vec(-35, 13)),
  new Target(new Vec(-26, 13)),
  new Target(new Vec(-8, 12)),
  new Target(new Vec(8, 12)),
  new Target(new Vec(25, 12), false, true),
  new Target(new Vec(55, 12), false, true),
  new Target(new Vec(75, 12.4)),
  new Target(new Vec(85, 12)),

  //Water targets
  new Target(new Vec(-87, 6), true),
  new Target(new Vec(-55, 6), true),
  new Target(new Vec(-55, 6), true),
  new Target(new Vec(-16, 6), true),
  new Target(new Vec(18, 6), true),
  new Target(new Vec(64, 6), true),
  new Target(new Vec(93, 6), true),
]

const myFrog=new Frog(new Vec(10, -10), new Vec(0, 0), true, "", new Date().getTime(), false, "");
let otherPlayers: Array<Frog> = [];

const gameObjects: Array<GameObject> = [

  new Treasure("COIN", new Vec(-40, 5), 3, false),
  new Treasure("COIN", new Vec(-80, -14), 3, false),  
  new Treasure("COIN", new Vec(84, 5), 3, false),
  new Treasure("COIN", new Vec(0, 5), 3, false),
  new Treasure("COIN", new Vec(-75, 5), 3, false),

  new Treasure("TREASURE", new Vec(-55, -45), 8, false),
  new Treasure("TREASURE", new Vec(22, -45), 8, false),
  new Treasure("TREASURE", new Vec(4, -30), 8, true),
  new Treasure("TREASURE", new Vec(75, -45), 8, false),
  

  //islands
  new Island("ISLAND2", new Vec(-70, 9.5), 30, 40, true),
  new Island("ISLAND1", new Vec(-35, 10), 35, 30, false),
  new Island("ISLAND1", new Vec(0, 10), 30, 20, true),
  new Island("ISLAND2", new Vec(40, 9.5), 50, 30, false),
  new Island("ISLAND2", new Vec(80, 9.5), 20, 30, true),

  //rock islands
  new Island("ROCK_ISLAND1", new Vec(80, -20), 20, 30, true),
  new Island("ROCK_ISLAND2", new Vec(-80, -20), 20, 30, true),
  new Island("ROCK_ISLAND1", new Vec(-50, -30), 20, 30, false),
  new Island("ROCK_ISLAND2", new Vec(30, -10), 20, 30, true),
  new Island("ROCK_ISLAND1", new Vec(10, -36), 40, 30, true),

  myFrog,

  new Island("SEA_GRASS", new Vec(10, -28), 3, 15, true),
  new Island("SEA_GRASS", new Vec(13, -27), 3, 18, false),  
  new Island("SEA_GRASS", new Vec(18, -28), 3, 15, true),

  new Island("SEA_GRASS", new Vec(-10, -40), 5, 21, true),
  new Island("SEA_GRASS", new Vec(-15, -36), 6, 30, false),
  new Island("SEA_GRASS", new Vec(-19, -38), 4, 25, true),

  new Island("SEA_GRASS", new Vec(-44, -40), 5, 21, false),
  new Island("SEA_GRASS", new Vec(-49, -42), 4, 15, true),

  new Island("SEA_GRASS", new Vec(44, -40), 5, 21, true),
  new Island("SEA_GRASS", new Vec(49, -42), 4, 15, false),

  new Island("SEA_GRASS", new Vec(-84, -15), 2, 5, true),
  new Island("SEA_GRASS", new Vec(-81, -15), 1.5, 4, true),
  new Island("SEA_GRASS", new Vec(-77, -15), 2, 6, false),
  new Island("SEA_GRASS", new Vec(-75, -15), 2, 5, false),

  new Island("THE_SHOP", new Vec(40, 15), 30, 25, false),
  new Bank(new Vec(40, 15)),

  new BubbleSource(new Vec(-30, -45)),
  new BubbleSource(new Vec(0, -30)),
  new BubbleSource(new Vec(50, -45)),
  new BubbleSource(new Vec(90, -45)),
  new BubbleSource(new Vec(-93, -45)),
  
];

function sendInfoToServer(roomId: string, userId: string): void {
  fetch('/api/updatePlayerLocation', {
    method: 'POST',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Credentials': 'true',
    },
    body: JSON.stringify({
      userId,
      roomId,
      x: myFrog.position.x,
      y: myFrog.position.y,
      xVel: myFrog.velocity.x,
      yVel: myFrog.velocity.y,
    }),
  }).then(res => res.text().then(data => {
    //console.log('Got response: '+data);
    //const json=JSON.parse(data);
    //console.log(json);
  }).catch((e) => console.log(e)));
}

function killPlayer(roomId: string, userId: string): void {
  fetch('/api/killPlayer', {
    method: 'POST',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Credentials': 'true',
    },
    body: JSON.stringify({
      userId,
      roomId
    }),
  }).then(res => res.text().then(data => {
    console.log('Got response: '+data);
    const json=JSON.parse(data);
    console.log(json);
  }).catch((e) => console.log(e)));
}

function _resizeCanvas(canvas: HTMLCanvasElement): void {
  const targetWidth=Math.min(canvas.clientWidth, canvas.clientHeight*2);
  const targetHeight=targetWidth/200*100;
  if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
    canvas.width = targetWidth;
    canvas.height = targetHeight;
  }
}

function handleClick(x: number, y: number, roomId: string): void {
  const worldPoint=screenPointToWorldPoint(new Vec(x, y));
  //console.log("Clicked "+worldPoint.x+" "+worldPoint.y);
  
  for (const gameObject of gameObjects) {
    gameObject.processClick(worldPoint, targets, roomId);
  }
}

function renderTimeLeft(endTime: number) {
  const currentTime=new Date().getTime();
  const timeLeft=endTime-currentTime;
  const secondsLeft=Math.round(timeLeft/1000);
  drawText("Time Left: "+secondsLeft, getCameraPosition().add(new Vec(getCameraWidth()*.4, getCameraWidth()*.2)), "#333333", "50");
}

let calledResetRoom=false;
function resetRoom(roomId: string, nickname: string) {
  if (calledResetRoom) return;
  calledResetRoom=true;
  fetch('/api/resetRoom', {
    method: 'POST',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Credentials': 'true',
    },
    body: JSON.stringify({roomId}),
  }).then(res => res.text().then(data => {
    console.log('Got response: '+data);
    const json=JSON.parse(data);
    console.log(json);
    window.location.href="https://deeperunder.com/room/"+roomId+"?nickname="+nickname;
  }).catch((e) => console.log(e)));
}

let resendInfoToServerCounter=0;
let getInfoFromServerCounter=0;
let frogsWon: boolean = false;
let endRoomTime: number = 0;


function GameScreen(props: Props) {
  const canvas = useRef(null);

  useEffect(() => {
    // dynamically assign the width and height to canvas
    const canvasEle = canvas.current! as HTMLCanvasElement;

    // get context of the canvas
    const ctx = canvasEle.getContext("2d")!;
    setCTX(ctx);
  }, []);

  useInterval(() => {
    // dynamically assign the width and height to canvas
    const canvasEle = canvas.current! as HTMLCanvasElement;
    _resizeCanvas(canvasEle);

    //TODO: check if frogs win
    
    if (frogsWon) {
      drawImage("FROGS_WIN", getCameraPosition(), getCameraWidth(), getCameraWidth()/2, 0, 1, false);  
      const center=getCameraPosition().add(new Vec(0, -getCameraWidth()*0.22));
      drawText("Frogs win!", center, "#ffcccc", "100");
      
      if (new Date().getTime()>endRoomTime+5000) {
        resetRoom(props.roomId, props.nickname);
        return;
      }

      return;
    }

    if (new Date().getTime()>props.roomEndTime) {
      if (new Date().getTime()>props.roomEndTime+5000) {
        resetRoom(props.roomId, props.nickname);
        return;
      }
      drawImage("SHARK_WINS", getCameraPosition(), getCameraWidth(), getCameraWidth()/2, 0, 1, false);  
      const center=getCameraPosition().add(new Vec(0, -getCameraWidth()*0.22));
      drawText("Time's up!", center, "#ffcccc", "100");
      return;

    }

    
    //DRAW BACKGROUND
    drawImage("SKY", new Vec(0, 30), 200, 40, 0, 1);
    drawImage("OCEAN", new Vec(0, -20), 200, 60, Math.PI, 1);
    drawImage("BOARDER", new Vec(50, 0), 100, 100, 0, 1, true);
    drawImage("BOARDER", new Vec(-50, 0), 100, 100, 0, 1, false);

    const toAdd=Array<GameObject>();
    for (const gameObject of gameObjects) {
      gameObject.update(collisionSegs, targets, otherPlayers, x => toAdd.push(x), x => killPlayer(props.roomId, x), myFrog);
    }
    for (const gameObject of targets) {
      //we don't want other players messing with our targets
      gameObject.update(collisionSegs, [], otherPlayers, x => toAdd.push(x), x => killPlayer(props.roomId, x), myFrog);
    }
    for (const gameObject of otherPlayers) {
      gameObject.update(collisionSegs, targets, otherPlayers, x => toAdd.push(x), x => killPlayer(props.roomId, x));
    }

    
    for (const gameObject of otherPlayers) {
      gameObject.render();
    }

    for (const gameObject of gameObjects) {
      gameObject.render();
    }
    
    for (const gameObject of targets) {
      gameObject.render();
    }
    gameObjects.push(...toAdd);
    renderTimeLeft(props.roomEndTime);


    resendInfoToServerCounter++;
    if (resendInfoToServerCounter === 20) {
      resendInfoToServerCounter=0;
      sendInfoToServer(props.roomId, props.playerId);
    }

    getInfoFromServerCounter++;
    if (getInfoFromServerCounter === 20) {
      getInfoFromServerCounter=0;
      getRoomInfo(props.roomId, room => {
        const me=room.players.find(x => x._id===props.playerId);
        if (room.frogsWon) {
          frogsWon=true;
          endRoomTime=new Date().getTime();
        }
        if (me!=null) {
          myFrog.isShark=me.isShark;
          myFrog._id=me._id;
          myFrog.name=me.username;
          if (!myFrog.isShark && myFrog.lastTimeDied<me.lastTimeDied) {
            console.log("Looks like I died, respawning.");
            myFrog.lastTimeDied=me.lastTimeDied;
            myFrog.money=0;
            gameObjects.push(new Blood(myFrog.position));
            const targetIndex=Math.floor(Math.random()*11);
            myFrog.position=targets[targetIndex].position;
            myFrog.velocity=new Vec(0, 0);
            myFrog.onTarget=true;
            sendInfoToServer(props.roomId, props.playerId);
          }
        }

        const othersInRoom = room.players.filter(x => x._id !== props.playerId);
        for (const player of othersInRoom) {
            const matching=otherPlayers.find(x => x._id===player._id);
            if (matching==null) {
              otherPlayers.push(new Frog(new Vec(player.x, player.y), new Vec(player.xVel, player.yVel), false, player._id, player.timeUpdated, player.isShark, player.username));
            }
            else {
              if (matching.lastTimeUpdated < player.timeUpdated) {
                matching.lastTimeUpdated = player.timeUpdated;
                matching.position=new Vec(player.x, player.y);
                matching.velocity=new Vec(player.xVel, player.yVel);
              }
              if (!myFrog.isShark) {
                if (matching.lastTimeDied < player.lastTimeDied) {
                  gameObjects.push(new Blood(matching.position));
                  matching.position=new Vec(0, 100);
                  matching.drawPosition=matching.position;  
                }
                matching.lastTimeDied=player.lastTimeDied;
              }
            }
            
          }
      });
    }

  }, 1000/60);
  return (
    <div className="App">
        <canvas ref={canvas} className="mainCanvas" onClick={e => handleClick(e.clientX, e.clientY, props.roomId)}>
        </canvas>
    </div>
  );
}

export default GameScreen;
