import Vec from "../geo/Vec";

type ImageName = 
    "COIN" | 
    "BLOOD" | 
    "BOARDER" | 
    "FROG" | 
    "FROG2" | 
    "ISLAND1" | 
    "ISLAND2" | 
    "OCEAN" |
    "ROCK_ISLAND1" | 
    "ROCK_ISLAND2" | 
    "SEA_GRASS" | 
    "SHARK" | 
    "SHARK_STRAIGHT" | 
    "SHARK_UP" | 
    "SKY" | 
    "TREASURE" | 
    "SHARK_WINS" | 
    "FROGS_WIN" | 
    "TARGET";

let ctx: CanvasRenderingContext2D | null = null;

const images = {
    COIN: new Image(),
    BOARDER: new Image(),
    BLOOD: new Image(),
    FROG: new Image(),
    FROG2: new Image(),
    ISLAND1: new Image(),
    ISLAND2: new Image(),
    OCEAN: new Image(),
    ROCK_ISLAND1: new Image(),
    ROCK_ISLAND2: new Image(),
    SEA_GRASS: new Image(),
    SHARK: new Image(),
    SHARK_STRAIGHT: new Image(),
    SHARK_UP: new Image(),
    SKY: new Image(),
    TREASURE: new Image(),
    SHARK_WINS: new Image(),
    FROGS_WIN: new Image(),
    TARGET: new Image(),
};

images.COIN.src="/Coin.png";
images.BLOOD.src="/Blood1.png";
images.BOARDER.src="/Boarder.png";
images.FROG.src="/Frog.png";
images.FROG2.src="/Frog2.png";
images.ISLAND1.src="/Island1.png";
images.ISLAND2.src="/Island2.png";
images.OCEAN.src="/OceanBackground.png";
images.ROCK_ISLAND1.src="/RockIsland1.png";
images.ROCK_ISLAND2.src="/RockIsland2.png";
images.SEA_GRASS.src="/SeaGrass.png";
images.SHARK.src="/Shark.png";
images.SHARK_STRAIGHT.src="/SharkStraight.png";
images.SHARK_UP.src="/SharkUp.png";
images.SKY.src="/Sky.png";
images.TREASURE.src="/Treasure.png";
images.SHARK_WINS.src="/Target.png";
images.FROGS_WIN.src="/Target.png";
images.TARGET.src="/Target.png";

function setCTX(context: CanvasRenderingContext2D) {
    ctx=context;
}

let CAMERA_WIDTH=40;
let cameraPosition = new Vec(0, -10);

function setCameraWidth(cameraWidth: number) {
    CAMERA_WIDTH=cameraWidth;
}

function getCameraWidth(): number {
    return CAMERA_WIDTH;
}

function setCameraPosition(newCameraPos: Vec): void {
    cameraPosition=new Vec(newCameraPos.x, newCameraPos.y);
    cameraPosition.x=Math.max(cameraPosition.x, -100+CAMERA_WIDTH/2);
    cameraPosition.x=Math.min(cameraPosition.x, 100-CAMERA_WIDTH/2);
    cameraPosition.y=Math.max(cameraPosition.y, -50+CAMERA_WIDTH/4);
}
function getCameraPosition(): Vec {
    return cameraPosition;
}

function worldDimToScreenDim(worldDimension: number): number {
    if (ctx==null) return 1;
    const screenWidth=ctx.canvas.width;
    return worldDimension*screenWidth/CAMERA_WIDTH;
}

function worldPointToScreenPoint(worldX: number, worldY: number): Vec {
    let x=worldX-cameraPosition.x;
    //invert y so up is positive
    let y=cameraPosition.y-worldY;

    x=worldDimToScreenDim(x);
    y=worldDimToScreenDim(y);

    //we just calculated everything assuming 0, 0 was the center of our screen, but it is actually the top right
    //so now we need to add to both coordinates to get 0, 0 to the center
    const screenWidth = ctx?.canvas.width ?? 0;
    return new Vec(x + screenWidth/2, y+screenWidth/4);
}

function screenDimToWorldDim(screenDimention: number): number {
    if (ctx==null) return 1;
    const screenWidth=ctx.canvas.width;
    return screenDimention*CAMERA_WIDTH/screenWidth;
}

function screenPointToWorldPoint(screenPosition: Vec): Vec {
    const screenWidth = ctx?.canvas.width ?? 0;
    const zeroized=screenPosition.sub(new Vec(screenWidth/2, screenWidth/4));
    let x=screenDimToWorldDim(zeroized.x);
    let y=screenDimToWorldDim(zeroized.y);
    x=x+cameraPosition.x;
    y=cameraPosition.y-y;
    return new Vec(x, y);
}

function drawImage(imageName: ImageName, position: Vec, w: number, h:number, angle: number=0, alpha: number=1, flippedHorizontally: boolean = false): void {
    const x=position.x;
    const y=position.y;
    const toDraw: HTMLImageElement=getImage(imageName);
    
    if (toDraw!=null && ctx!=null && toDraw!.complete) {
        const realW=worldDimToScreenDim(w), realH=worldDimToScreenDim(h);
        //ctx.drawImage(toDraw, screenPos.x-realW/2, screenPos.y-realH/2, realW, realH);

        const screenPos=worldPointToScreenPoint(x, y);
        const drawX=screenPos.x;
        const drawY=screenPos.y;
        const previousAlpha=ctx.globalAlpha;
        ctx.globalAlpha=alpha;
        ctx.translate(drawX, drawY);
        ctx.rotate(-angle);
        if (flippedHorizontally) {
            ctx.scale(-1, 1);
        }
        ctx.drawImage(toDraw, -realW/2, -realH/2, realW, realH);
        if (flippedHorizontally) {
            ctx.scale(-1, 1);
        }
        ctx.rotate(angle);
        ctx.translate(-drawX, -drawY);
        ctx.globalAlpha=previousAlpha
    }
}

function getImage(imageName: ImageName) {
    return images[imageName];
}

function drawCircle(center: Vec, r: number) {
    if (ctx==null) return;
    const centerScreen=worldPointToScreenPoint(center.x, center.y);
    const screenR=worldDimToScreenDim(r);
    ctx!.beginPath();
    ctx!.ellipse(centerScreen.x, centerScreen.y, screenR, screenR, 0, 0, 2*Math.PI);
    ctx!.stroke();
}

function drawSeg(from: Vec, to: Vec) {
    if (ctx==null) return;
    const fromScreen=worldPointToScreenPoint(from.x, from.y);
    const toScreen=worldPointToScreenPoint(to.x, to.y);
    ctx?.beginPath();
    ctx?.moveTo(fromScreen.x, fromScreen.y);
    ctx?.lineTo(toScreen.x, toScreen.y);
    ctx?.stroke();
}

function drawText(text: string, worldSpace: Vec, color: string, size: string="30"): void {
    if (ctx==null) return;
    const screenSpace=worldPointToScreenPoint(worldSpace.x, worldSpace.y);
    ctx.fillStyle=color;
    ctx.font = size+'px georgia';
    ctx.textAlign="center";
    ctx.fillText(text, screenSpace.x, screenSpace.y)
}

export default drawImage;
export {setCTX, getCameraPosition, setCameraPosition, screenPointToWorldPoint, drawSeg, drawCircle, setCameraWidth, getCameraWidth, drawText};
export type {ImageName};