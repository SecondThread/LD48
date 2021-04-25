import { drawCircle, drawSeg } from "./drawing/ImageLoader";
import GameObject from "./GameObject";
import Vec from "./geo/Vec";

class CollisionSeg extends GameObject {
    from: Vec;
    to: Vec;
    dir: Vec;
    thickness: number;

    constructor(from: Vec, to: Vec, thickness: number) {
        super();
        this.from=from;
        this.to=to;
        this.dir=to.sub(from);
        this.thickness=thickness;
    }

    render(): void {
        drawCircle(this.from, this.thickness);
        drawCircle(this.to, this.thickness);
        drawSeg(this.from, this.to);
    }

    closestTo(o: Vec): Vec {
        const percentThere = o.sub(this.from).dot(this.dir)/this.dir.mag2();
        return this.from.add(this.dir.scale(Math.max(0, Math.min(1, percentThere))));
    }

    intersectCircle(center: Vec, oR: number): boolean {
        const dist=center.sub(this.closestTo(center)).mag();
        return dist<this.thickness+oR;
    }
}

export default CollisionSeg;