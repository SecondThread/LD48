import CollisionSeg from "./CollisionSeg";
import drawImage from "./drawing/ImageLoader";
import GameObject from "./GameObject";
import Vec, { lerp } from "./geo/Vec";
import Target from "./Target";

const START_WIDTH=5, END_WIDTH=14;
const LIFETIME=90;

class Blood extends GameObject {

    position: Vec;
    angle: number;
    lifetimeCounter: number = 0;
    flipped: boolean;

    constructor(position: Vec) {
        super();
        this.angle=Math.random()*2*Math.PI;
        this.position=position;
        this.flipped=Math.random()>0.5;
    }

    update(collisionSegs: CollisionSeg[], targets: Target[]): void {
        if (this.lifetimeCounter>LIFETIME) return;
        this.lifetimeCounter++;
    }

    render(): void {
        if (this.lifetimeCounter>LIFETIME) return;

        const time=this.lifetimeCounter/LIFETIME;
        const width=lerp(START_WIDTH, END_WIDTH, Math.sqrt(time));
        const alpha=lerp(1, 0, time*time);
        drawImage("BLOOD", this.position, width, width, this.angle, alpha, this.flipped);
    }

}

export default Blood;