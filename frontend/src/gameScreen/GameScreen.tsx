import {useEffect, useRef} from 'react';
import drawImage, { setCTX } from './drawing/ImageLoader';
import "./GameScreen.css"
import { useInterval } from './useInterval';

type Props = {
  roomId: string,
  playerId: string
}

function _resizeCanvas(canvas: HTMLCanvasElement): void {
  const targetWidth=canvas.clientWidth;
  const targetHeight=targetWidth/200*100;
  if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
    canvas.width = targetWidth;
    canvas.height = targetHeight;
  }
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
    drawImage("SKY", 0, 30, 200, 40, 0, 1);
    drawImage("OCEAN", 0, -20, 200, 60, Math.PI, 1);
    drawImage("BOARDER", 50, 0, 100, 100, 0, 1, true);
    drawImage("BOARDER", -50, 0, 100, 100, 0, 1, false);

    
  }, 1000);
  return (
    <div className="App">
        <canvas ref={canvas} className="mainCanvas">
        </canvas>
    </div>
  );
}

export default GameScreen;
