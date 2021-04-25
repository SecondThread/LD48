import { drawCircle, drawSeg } from "./drawing/ImageLoader";
import GameObject from "./GameObject";
import Vec from "./geo/Vec";

class CollisionSeg extends GameObject {
    from: Vec;
    to: Vec;
    thickness: number;

    constructor(from: Vec, to: Vec, thickness: number) {
        super();
        this.from=from;
        this.to=to;
        this.thickness=thickness;
    }

    render(): void {
        drawCircle(this.from, this.thickness);
        drawCircle(this.to, this.thickness);
        drawSeg(this.from, this.to);
    }
}

export default CollisionSeg;