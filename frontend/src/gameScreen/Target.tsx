import drawImage from "./drawing/ImageLoader";
import GameObject from "./GameObject";
import Vec from "./geo/Vec";

const TARGET_WIDTH=5;

class Target extends GameObject {
    position: Vec;

    constructor(position: Vec) {
        super();
        this.position=position;
    }

    render(): void {
        drawImage("TARGET", this.position, TARGET_WIDTH, TARGET_WIDTH);
    }
}

export default Target;