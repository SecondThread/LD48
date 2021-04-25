import drawImage from "./drawing/ImageLoader";
import GameObject from "./GameObject";
import Vec from "./geo/Vec";

const TARGET_WIDTH=5;

class Target extends GameObject {
    position: Vec;
    isWater: boolean;
    isNear: boolean = false;

    constructor(position: Vec, isWater: boolean = false) {
        super();
        this.position=position;
        this.isWater=isWater;
    }

    render(): void {
        drawImage("TARGET", this.position, TARGET_WIDTH, TARGET_WIDTH, 0, this.isNear?1:0.2);
    }
}

export default Target;