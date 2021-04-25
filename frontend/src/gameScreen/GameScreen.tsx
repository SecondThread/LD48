import {useEffect, useRef} from 'react';
import drawImage, { screenPointToWorldPoint, setCTX } from './drawing/ImageLoader';
import GameObject from './GameObject';
import Island from './Island';
import "./GameScreen.css"
import Vec from './geo/Vec';
import { useInterval } from './useInterval';
import Target from './Target';
import CollisionSeg from './CollisionSeg';
import Frog from './Frog';
import getRoomInfo from './getRoomInfo';

type Props = {
  roomId: string,
  playerId: string
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
  new Target(new Vec(25, 12)),
  new Target(new Vec(55, 12)),
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

const myFrog=new Frog(new Vec(10, -10), new Vec(0, 0), true);
let otherPlayers: Array<Frog> = [];

const gameObjects: Array<GameObject> = [
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

  //new Shark(new Vec(10, -10)),
  myFrog,
];

function sendInfoToServer(roomId: string, userId: string): void {
  console.log('Sending data to server'+ myFrog.position.x+" "+myFrog.position.y);
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
  }).then(res => res.json().then(data => {
    console.log('Got response: ');
    console.log(data);
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

function handleClick(x: number, y: number): void {
  const worldPoint=screenPointToWorldPoint(new Vec(x, y));
  console.log("Clicked "+worldPoint.x+" "+worldPoint.y);
  
  //TODO: use this for movement or something
  for (const gameObject of gameObjects) {
    gameObject.processClick(worldPoint, targets);
  }
}


let resendInfoToServerCounter=0;
let getInfoFromServerCounter=59;

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

    
    //DRAW BACKGROUND
    drawImage("SKY", new Vec(0, 30), 200, 40, 0, 1);
    drawImage("OCEAN", new Vec(0, -20), 200, 60, Math.PI, 1);
    drawImage("BOARDER", new Vec(50, 0), 100, 100, 0, 1, true);
    drawImage("BOARDER", new Vec(-50, 0), 100, 100, 0, 1, false);

    for (const gameObject of gameObjects) {
      gameObject.update(collisionSegs, targets);
    }
    for (const gameObject of targets) {
      //we don't want other players messing with our targets
      gameObject.update(collisionSegs, []);
    }
    for (const gameObject of otherPlayers) {
      gameObject.update(collisionSegs, targets);
    }

    for (const gameObject of gameObjects) {
      gameObject.render();
    }
    for (const gameObject of otherPlayers) {
      gameObject.render();
    }
    for (const gameObject of targets) {
      gameObject.render();
    }
    
    resendInfoToServerCounter++;
    if (resendInfoToServerCounter === 60) {
      resendInfoToServerCounter=0;
      sendInfoToServer(props.roomId, props.playerId);
    }
    getInfoFromServerCounter++;
    if (getInfoFromServerCounter === 60) {
      getInfoFromServerCounter=0;
      getRoomInfo(props.roomId, room => {
        otherPlayers = room.players.filter(x => x._id !== props.playerId).map(player => 
          new Frog(new Vec(player.x, player.y), new Vec(player.xVel, player.yVel), false));
          console.log('Got other players: ');
          console.log(otherPlayers);
      });
    }

  }, 1000/60);
  return (
    <div className="App">
        <canvas ref={canvas} className="mainCanvas" onClick={e => handleClick(e.clientX, e.clientY)}>
        </canvas>
    </div>
  );
}

export default GameScreen;
