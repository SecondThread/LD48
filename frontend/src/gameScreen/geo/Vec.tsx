
function lerp(a: number, b: number, t: number): number {
    return a*(1-t)+(b*t);
}

function lerpV(a: Vec, b: Vec, t: number): Vec {
    return new Vec(lerp(a.x, b.x, t), lerp(a.y, b.y, t));
}

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
    mag2(): number {
        return this.dot(this);
    }
    mag(): number {
        return Math.sqrt(this.mag2());
    }
    unit(): Vec {
        return this.scale(1/this.mag());
    }
    //between 0 and 2*PI
    angle(): number {
        return (Math.atan2(this.y, this.x)+2*Math.PI)%(2*Math.PI);
    }

    rotate(theta: number): Vec {
        const PI=Math.PI;
        const newX=this.x*Math.cos(theta)+this.y*Math.cos(PI/2+theta);
        const newY=this.x*Math.sin(theta)+this.y*Math.sin(PI/2+theta);
        return new Vec(newX, newY);
    }

    rot90(): Vec {
        return new Vec(-this.y, this.x);
    }
    rot270(): Vec {
        return new Vec(this.y, -this.x);
    }
}

export default Vec;

export {lerp, lerpV};