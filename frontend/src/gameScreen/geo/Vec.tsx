
class Vec {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x=x;
        this.y=y;
    }

    add(o: Vec): Vec { 
        return new Vec(this.x+o.x, this.y+o.y);
    }
    sub(o: Vec): Vec { 
        return new Vec(this.x-o.x, this.y-o.y);
    }
    scale(s: number): Vec { 
        return new Vec(this.x*s, this.y*s);
    }
    dot(o: Vec): number { 
        return this.x*o.x+this.y*o.y;
    }
    cross(o: Vec): number { 
        return this.x*o.y-this.y*o.x;
    }
}

export default Vec;