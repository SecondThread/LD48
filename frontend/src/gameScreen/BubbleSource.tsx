import Bubble from "./Bubble";
import CollisionSeg from "./CollisionSeg";
import Frog from "./Frog";
import GameObject from "./GameObject";
import Vec from "./geo/Vec";
import Target from "./Target";

class BubbleSource extends GameObject {

    position: Vec;
    constructor(position: Vec) {
        super();
        this.position=position;
    }

    update(collisionSegs: CollisionSeg[], targets: Target[], frogs: Frog[], createObject: (x: GameObject) => void,
        killPlayer: (idToKill: string) => void): void {
        if (Math.random()<1/20.0) {
            const angle=Math.random()*Math.PI*2;
            const r=Math.random()*4;
            createObject(new Bubble(this.position.add(new Vec(r, 0).rotate(angle)), true));
        }          
    }

}

export default BubbleSource;