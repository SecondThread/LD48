import {useEffect, useRef} from 'react';
import drawImage, { screenPointToWorldPoint, setCTX } from './drawing/ImageLoader';
import GameObject from './GameObject';
import Island from './Island';
import "./GameScreen.css"
import Vec from './geo/Vec';
import { useInterval } from './useInterval';
import Target from './Target';

type Props = {
  roomId: string,
  playerId: string
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
  console.log(x, y);
  const worldPoint=screenPointToWorldPoint(new Vec(x, y));
  //TODO: use this for movement I guess  
}


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
      new Target(new Vec(-87, 6)),
      new Target(new Vec(-55, 6)),
      new Target(new Vec(-55, 6)),
      new Target(new Vec(-16, 6)),
      new Target(new Vec(18, 6)),
      new Target(new Vec(64, 6)),
      new Target(new Vec(93, 6)),
    ];
    for (const gameObject of gameObjects) {
      gameObject.update();
    }

    for (const gameObject of gameObjects) {
      gameObject.render();
    }
    
  }, 1000);
  return (
    <div className="App">
        <canvas ref={canvas} className="mainCanvas" onClick={e => handleClick(e.clientX, e.clientY)}>
        </canvas>
    </div>
  );
}

export default GameScreen;
