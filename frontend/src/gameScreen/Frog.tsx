import Blood from "./Blood";
import CollisionSeg from "./CollisionSeg";
import drawImage, { drawCircle, drawText, getCameraPosition, getCameraWidth, ImageName, setCameraPosition, setCameraWidth} from "./drawing/ImageLoader";
import GameObject from './GameObject';
import Vec, { lerpV } from './geo/Vec';
import Target from "./Target";
import Bubble from './Bubble';

const FROG_WIDTH=.5;
const FROG_DRAW_Y_OFFSET=0;
const drag=0.99;
const REACH_DIST=6;
const SHARK_WIDTH=2.4;
const SHARK_DRAW_Y_OFFSET=-.6;
const FROG_DRAW_HEIGHT=5;
const SHARK_DRAW_HEIGHT=12;
const FROG_ANGLE_OFFSET=0.6;
const SHARK_ANGLE_OFFSET=-0.3;

class Frog extends GameObject {
    position: Vec;
    drawPosition: Vec;
    angle: number;
    velocity: Vec;
    facingRight: boolean = true;
    drawImage: ImageName="FROG2";
    updatesUntilSpring: number = 0;
    onTarget: boolean = false;
    isMe: boolean;
    _id: string;
    lastTimeUpdated: number;
    lastTimeDied: number = 0;
    isShark: boolean;
    name: string;
    money: number = 0;
    moneyInBank: number = 0;

    constructor(position: Vec, velocity: Vec, isMe: boolean, _id: string, lastTimeUpdated: number, isShark: boolean, name: string) {
        super();
        this.position=position;
        this.drawPosition=position;
        this.velocity=velocity;
        this.angle=0;
        this.isMe=isMe;
        this._id = _id;
        this.lastTimeUpdated=lastTimeUpdated;
        this.isShark = isShark;
        this.drawImage=isShark?"SHARK_STRAIGHT":"FROG2";
        this.name=name;
    }

    update(collisionSegs: CollisionSeg[], targets: Target[], frogs: Frog[], createObject: (x: GameObject) => void,
            killPlayer: (idToKill: string) => void): void {
        if (this.isMe) {
            setCameraWidth(this.isShark?60:40);
            //setCameraWidth(200);
        }
        if (this.isShark) {
            this.onTarget=false;
            this.drawImage="SHARK_STRAIGHT";
            if (this.isMe) {
                //try to eat other frogs
                const mouthLocation=this.position.add(new Vec(this.facingRight?1:-1, 0));
                const myRadius=2;
                for (const frog of frogs) {
                    const drawLocation=frog.drawPosition;
                    if (mouthLocation.sub(drawLocation).mag()<myRadius) {
                        frog.position=new Vec(0, 100);
                        frog.drawPosition=new Vec(0, 100);
                        const blood=new Blood(drawLocation);
                        createObject(blood);
                        killPlayer(frog._id);
                    }
                }
            }
        }

        if (this.velocity.mag()>0.1) {
            if (Math.random()*1.6<this.velocity.mag2()) {
                createObject(new Bubble(this.position.sub(this.velocity.unit().scale(this.isShark?4:1))));
            }
        }

        this.drawPosition=lerpV(this.drawPosition, this.position, 0.1);

        if (this.isMe) {
            let nearTarget=targets.filter(x => x.position.sub(this.position).mag()<REACH_DIST && x.isWater !== this.onTarget && !this.isShark   );
            let farTargets=targets.filter(x => nearTarget.indexOf(x)===-1);
            if (nearTarget.length===0) {
                farTargets.map(x => x.isNear=false);
            }
            else {
                nearTarget.map(x => x.isNear=false);
                farTargets.map(x => x.isNear=true);
            }
        }
        else {
            //if not me, guess whether I am on a target by position
            this.onTarget = this.position.y > 10;
            if (this.onTarget) {
                if (Math.abs(this.position.sub(this.drawPosition).x)>1) {
                    this.facingRight=this.position.x>this.drawPosition.x;
                }
            }
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

            let newTargetAngle = null;
            let curAngleVec = null;
            if (this.isShark) {
                newTargetAngle = this.velocity.add(new Vec(this.facingRight?0.2:-0.2, 0)).unit();
                curAngleVec=new Vec(1, 0).rotate(this.angle);
            }
            else {
                newTargetAngle = this.velocity;
                curAngleVec=new Vec(1, 0).rotate(this.angle);
            }
            const targetAngleVec=curAngleVec.add(newTargetAngle);
            

            if (!this.isShark) {
                if (this.isMe) {
                    this.drawImage=this.updatesUntilSpring>0?"FROG2":"FROG";
                    this.updatesUntilSpring--;
                }
                else {
                    this.drawImage=this.velocity.mag()>0.1?"FROG2":"FROG";
                }
            }

            this.angle=targetAngleVec.angle();
            this.facingRight=Math.cos(this.angle)>=0;
        }
        
        
        //lerp camera position
        if (this.isMe) {
            const cameraPos=getCameraPosition();
            const targetCameraPosition=this.position.add(new Vec(this.facingRight?5:-5, 0));
            let speed=cameraPos.sub(targetCameraPosition).mag2()/500;
            speed=Math.min(0.1, Math.max(0.01, speed));
            setCameraPosition(lerpV(cameraPos, targetCameraPosition, speed));
        }
    }


    render(): void {
        drawCircle(this.position, FROG_WIDTH);
        const angleOffset=this.isShark?SHARK_ANGLE_OFFSET:FROG_ANGLE_OFFSET;
        const drawAngle=this.facingRight?this.angle-angleOffset:Math.PI+this.angle+angleOffset;
        const myDrawPosition=this.isMe?this.position:this.drawPosition;
        const myOffset=this.isShark?SHARK_DRAW_Y_OFFSET:FROG_DRAW_Y_OFFSET;
        const drawHeight=this.isShark?SHARK_DRAW_HEIGHT:FROG_DRAW_HEIGHT;
        const drawFacingRight = this.isShark?this.facingRight:!this.facingRight;
        drawImage(this.drawImage, myDrawPosition.add(new Vec(0, myOffset)), drawHeight, drawHeight, drawAngle, 1, drawFacingRight);

        const yAdd=new Vec(0, drawHeight/4);
        if (this.isShark) {
            yAdd.x=this.facingRight?1:-1;
        }

        const color=this.isShark?"#333333":"#33ee33"
        drawText(this.name, this.position.add(yAdd), color);

        if (this.isMe && !this.isShark) {
            drawText("$"+this.money, getCameraPosition().add(new Vec(getCameraWidth()*.4, getCameraWidth()*.15)), "#eeee00", "50");
            drawText("$"+this.moneyInBank+" in bank", getCameraPosition().add(new Vec(getCameraWidth()*.4, getCameraWidth()*.13)), "#eeee00", "30");
        }
    }

    processClick(mouseClick: Vec, targets: Target[]): void {
        if (!this.isMe) {
            return;
        }

        if (this.isShark) {
            const dirToMouse = mouseClick.sub(this.position).unit();
            if (Math.abs(dirToMouse.y)>0.5) {
                dirToMouse.y=0.5*Math.sign(dirToMouse.y);
            }
            this.velocity=this.velocity.add(dirToMouse.scale(0.4));
            return;
        }
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
            const myWidth=this.isShark?SHARK_WIDTH:FROG_WIDTH;
            if (seg.intersectCircle(this.position, myWidth)) {
                const closestPoint = seg.closestTo(oldPosition);
                const legalVelocity=closestPoint.sub(oldPosition).rot90().unit();
                this.velocity=legalVelocity.scale(legalVelocity.dot(this.velocity));
                return true;
            }
        }
        return false;
    }
    
}

export default Frog;