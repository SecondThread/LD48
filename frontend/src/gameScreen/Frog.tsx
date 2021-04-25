import CollisionSeg from "./CollisionSeg";
import drawImage, { drawCircle, getCameraPosition, ImageName, setCameraPosition } from "./drawing/ImageLoader";
import GameObject from './GameObject';
import Vec, { lerpV } from './geo/Vec';
import Target from "./Target";

const SHARK_WIDTH=.5;
const SHARK_DRAW_Y_OFFSET=0;
const drag=0.99;
const REACH_DIST=6;

class Shark extends GameObject {
    position: Vec;
    angle: number;
    velocity: Vec = new Vec(0, 0);
    facingRight: boolean = true;
    drawImage: ImageName="FROG2";
    updatesUntilSpring: number = 0;
    onTarget: boolean = false;

    constructor(position: Vec) {
        super();
        this.position=position;
        this.angle=0;
    }

    update(collisionSegs: CollisionSeg[], targets: Target[]): void {
        let nearTarget=targets.filter(x => x.position.sub(this.position).mag()<REACH_DIST && x.isWater != this.onTarget);
        let farTargets=targets.filter(x => nearTarget.indexOf(x)==-1);
        if (nearTarget.length==0) {
            farTargets.map(x => x.isNear=false);
        }
        else {
            nearTarget.map(x => x.isNear=false);
            farTargets.map(x => x.isNear=true);
        }
        
        

        if (this.onTarget) {
            this.velocity=new Vec(0, 0);
            this.angle=this.facingRight?Math.PI*.16:Math.PI-Math.PI*.16;
            this.drawImage="FROG";
        }
        else {
            //position and velocity updates: 
            const oldPosition=this.position;
            this.position=this.position.add(this.velocity);
            this.position.y=Math.min(this.position.y, 10);
            if (this.intersectCollisionSeg(collisionSegs, oldPosition)) {
                this.position=oldPosition;
                this.velocity=this.velocity.scale(0.5);
            }
            this.velocity=this.velocity.scale(drag);

            let newTargetAngle = this.velocity;//this.velocity.add(new Vec(this.facingRight?0.2:-0.2, 0)).unit();
            const curAngleVec=new Vec(1, 0).rotate(this.angle);
            const targetAngleVec=curAngleVec.add(newTargetAngle);
            this.drawImage=this.updatesUntilSpring>0?"FROG2":"FROG";
            this.updatesUntilSpring--;

            this.angle=targetAngleVec.angle();
            this.facingRight=Math.cos(this.angle)>=0;
        }
        
        
        //lerp camera position
        const cameraPos=getCameraPosition();
        const targetCameraPosition=this.position.add(new Vec(this.facingRight?5:-5, 0));
        let speed=cameraPos.sub(targetCameraPosition).mag2()/500;
        speed=Math.min(0.1, Math.max(0.01, speed));
        setCameraPosition(lerpV(cameraPos, targetCameraPosition, speed));
    }


    render(): void {
        drawCircle(this.position, SHARK_WIDTH);
        const drawAngle=this.facingRight?this.angle-0.6:Math.PI+this.angle+0.6;
        drawImage(this.drawImage, this.position.add(new Vec(0, SHARK_DRAW_Y_OFFSET)), 5, 5, drawAngle, 1, !this.facingRight);
    }

    processClick(mouseClick: Vec, targets: Target[]): void {

        //try to put it to a target
        for (const target of targets.filter(x=> x.isNear)) {
            if (target.position.sub(mouseClick).mag()<4) {
                if (target.isWater && !this.onTarget) {
                    //if we are already in the water, ignore this target
                    continue;
                }
                if (target.isWater) {
                    this.angle=target.position.sub(this.position).angle();
                    this.velocity = new Vec(1, 0).rotate(this.angle).scale(0.2);
                    this.facingRight=Math.cos(this.angle)>0;
                    this.position=target.position;
                    this.onTarget=false;
                }
                else {
                    this.angle=target.position.sub(this.position).angle();
                    this.facingRight=Math.cos(this.angle)>0;
                    this.position=target.position;
                    this.onTarget=true;
                    
                }
                return;
            }
        }

        if (this.updatesUntilSpring<=0) {
            this.updatesUntilSpring=80;
            const dirToMouse = mouseClick.sub(this.position).unit();
            this.velocity=this.velocity.add(dirToMouse.scale(0.3));
        }
    }

    intersectCollisionSeg(collisionSegs: CollisionSeg[], oldPosition: Vec): boolean {
        for (const seg of collisionSegs) {
            if (seg.intersectCircle(this.position, SHARK_WIDTH)) {
                const closestPoint = seg.closestTo(oldPosition);
                const legalVelocity=closestPoint.sub(oldPosition).rot90().unit();
                this.velocity=legalVelocity.scale(legalVelocity.dot(this.velocity));
                return true;
            }
        }
        return false;
    }
    
}

export default Shark;