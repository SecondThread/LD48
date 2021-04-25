import drawImage, { drawCircle, getCameraPosition, ImageName, setCameraPosition } from "./drawing/ImageLoader";
import GameObject from './GameObject';
import Vec, { lerpV } from './geo/Vec';

const SHARK_WIDTH=2.4;
const SHARK_DRAW_Y_OFFSET=-.6;
const drag=0.99;
class Shark extends GameObject {
    position: Vec;
    angle: number;
    velocity: Vec = new Vec(-0.3, 0);
    facingRight: boolean = true;
    drawImage: ImageName="SHARK_STRAIGHT";

    constructor(position: Vec) {
        super();
        this.position=position;
        this.angle=0;
    }

    update(): void {
        const oldPosition=this.position;
        this.position=this.position.add(this.velocity);
        this.velocity=this.velocity.scale(drag);
        
        let newTargetAngle = this.velocity.add(new Vec(this.facingRight?0.2:-0.2, 0)).unit();
        const curAngleVec=new Vec(1, 0).rotate(this.angle);
        const targetAngleVec=curAngleVec.add(newTargetAngle);
        this.drawImage="SHARK_STRAIGHT";

        this.angle=targetAngleVec.angle();
        this.facingRight=Math.cos(this.angle)>=0;

        //lerp camera position
        const cameraPos=getCameraPosition();
        const targetCameraPosition=this.position.add(new Vec(this.facingRight?5:-5, 0));
        let speed=cameraPos.sub(targetCameraPosition).mag2()/500;
        speed=Math.min(0.1, Math.max(0.01, speed));
        setCameraPosition(lerpV(cameraPos, targetCameraPosition, speed));
    }


    render(): void {
        drawCircle(this.position, SHARK_WIDTH);
        const drawAngle=this.facingRight?this.angle+0.3:Math.PI+this.angle-0.3;
        drawImage(this.drawImage, this.position.add(new Vec(0, SHARK_DRAW_Y_OFFSET)), 12, 12, drawAngle, 1, this.facingRight);
    }

    processClick(mouseClick: Vec): void {
        const dirToMouse = mouseClick.sub(this.position).unit();
        if (Math.abs(dirToMouse.y)>0.7) {
            return;
        }
        this.velocity=this.velocity.add(dirToMouse.scale(0.4));
    }

    
}

export default Shark;