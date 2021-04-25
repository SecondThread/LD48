import drawImage, { ImageName } from "./drawing/ImageLoader";
import GameObject from "./GameObject";
import Vec from "./geo/Vec";

class Island extends GameObject {
    imageName: ImageName;
    position: Vec;
    width: number;
    height: number;
    flipped: boolean;

    constructor(imageName: ImageName, position: Vec, width: number, height: number, flippedHorizontally: boolean) {
        super();
        this.imageName=imageName;
        this.position=position;
        this.width=width;
        this.height=height;
        this.flipped=flippedHorizontally;
    }

    render(): void {
        drawImage(this.imageName, this.position, this.width, this.height, 0, 1, this.flipped);
    }
}

export default Island;