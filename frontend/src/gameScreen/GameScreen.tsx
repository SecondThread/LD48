import {useEffect, useRef} from 'react';

import "./GameScreen.css"

type Props = {
  roomId: string,
  playerId: string
}

function GameScreen(props: Props) {
  const canvas = useRef(null);
  useEffect(() => {
    // dynamically assign the width and height to canvas
    const canvasEle = canvas.current! as HTMLCanvasElement;
    canvasEle.width = canvasEle.clientWidth;
    canvasEle.height = canvasEle.clientHeight;
 
    // get context of the canvas
    const ctx = canvasEle.getContext("2d")!;
    ctx.fillRect(40, 40, 100, 100);
  }, []);
  return (
    <div className="App">
        <canvas ref={canvas} className="mainCanvas">
        </canvas>
    </div>
  );
}

export default GameScreen;
