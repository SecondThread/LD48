import Vec from "../geo/Vec";

type ImageName = 
    "COIN" | 
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
    "TREASURE";
let ctx: CanvasRenderingContext2D | null = null;

const images = {
    COIN: new Image(),
    BOARDER: new Image(),
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
};

images.COIN.src="/Coin.png";
images.BOARDER.src="/Boarder.png";
images.FROG.src="/Frog.png";
images.FROG2.src="/Frog2.png";
images.ISLAND1.src="/Island1.png";
images.ISLAND2.src="/Shark.png";
images.OCEAN.src="/OceanBackground.png";
images.ROCK_ISLAND1.src="/RockIsland1.png";
images.ROCK_ISLAND2.src="/RockIsland2.png";
images.SEA_GRASS.src="/SeaGrass.png";
images.SHARK.src="/Shark.png";
images.SHARK_STRAIGHT.src="/SharkStraight.png";
images.SHARK_UP.src="/SharkUp.png";
images.SKY.src="/Sky.png";
images.TREASURE.src="/Treasure.png";

function setCTX(context: CanvasRenderingContext2D) {
    ctx=context;
}

const CAMERA_WIDTH=200;
let cameraPosition = new Vec(0, 0);

function setCameraPosition(newCameraPos: Vec): void {
    cameraPosition=newCameraPos;
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

function drawImage(imageName: ImageName, x: number, y: number, w: number, h:number, angle: number=0, alpha: number=1, flippedHorizontally: boolean = false): void {
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

export default drawImage;
export {setCTX, getCameraPosition, setCameraPosition};
export type {ImageName};