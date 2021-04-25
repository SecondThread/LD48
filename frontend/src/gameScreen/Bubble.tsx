import { METHODS } from "node:http";
import { textSpanIntersectsWithPosition } from "typescript";
import CollisionSeg from "./CollisionSeg";
import drawImage from "./drawing/ImageLoader";
import GameObject from "./GameObject";
import Vec, { lerp } from "./geo/Vec";
import Target from "./Target";

class Bubble extends GameObject {

    position: Vec;
    lifetimeCounter: number = 0;
    width: number;
    lifetime: number;
    rising: boolean;

    constructor(position: Vec, rising: boolean = false) {
        super();
        this.position=position.add(new Vec(Math.random()*2-1, Math.random()*2-1));
        this.width=Math.random()+1;
        this.lifetime= Math.round(Math.random()*120)+30;
        if (rising) {
            this.lifetime+=50;
            this.lifetime+=Math.random()*260;
        }
        this.rising=rising;
    }

    update(collisionSegs: CollisionSeg[], targets: Target[]): void {
        if (this.lifetimeCounter>this.lifetime) return;
        this.lifetimeCounter++;
        if (this.rising) {
            this.position=this.position.add(new Vec(0, 0.08));
        }
    }

    render(): void {
        if (this.lifetimeCounter>this.lifetime) return;

        const time=this.lifetimeCounter/this.lifetime;
        const width=lerp(this.width, this.width*1.2, time);
        drawImage("BUBBLE", this.position, width, width, 0, 1, false);
    }

}

export default Bubble;