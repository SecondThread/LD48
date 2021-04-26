import CollisionSeg from "./CollisionSeg";
import drawImage, { drawRect, drawText, ImageName } from "./drawing/ImageLoader";
import Frog from "./Frog";
import GameObject from "./GameObject";
import Vec from "./geo/Vec";
import Target from "./Target";

class Treasure extends GameObject {

    image: ImageName;
    position: Vec;
    width: number;
    flipped: boolean;
    percentCaptured: number = 0;

    showRenderText: boolean=false;
    onCooldown: boolean = false;
    cooldownCounter=0;
    drawText: string = "";

    constructor(image: ImageName, position: Vec, w: number, flipped: boolean) {
        super();
        this.image=image;
        this.position=position;
        this.width=w;
        this.flipped=flipped;
    }

    update(collisionSegs: CollisionSeg[], targets: Target[], frogs: Frog[], createObject: (x: GameObject) => void,
        killPlayer: (idToKill: string) => void, myFrog: Frog) {
        const distanceToPlayer=myFrog.position.sub(this.position).mag();
        this.showRenderText=distanceToPlayer<7;
        const canCapture = !myFrog.isShark;
        this.cooldownCounter++;
        if (this.cooldownCounter===60) {
            this.cooldownCounter=0;
        }
        
        this.drawText=myFrog.isShark?"Stop the frogs!":"CAPTURING...";

        if (!this.onCooldown && this.showRenderText && canCapture) {
            this.percentCaptured+=this.image==="TREASURE"?0.003:0.01;
        }
        else {
            this.percentCaptured-=this.image==="TREASURE"?0.0006:0.002;
        }
        this.percentCaptured=Math.min(1, Math.max(this.percentCaptured, 0));
        if (this.percentCaptured>=1) {
            this.onCooldown=true;
            //TODO: actually capture it
            myFrog.money += this.image==="TREASURE"?100:20;
        }
        if (this.percentCaptured<=0) {
            this.onCooldown=false;
        }
    }

    render(): void {
        const alpha=this.onCooldown?0.2:1;
        drawImage(this.image, this.position, this.width, this.width, 0, alpha, this.flipped);

        if (this.showRenderText) {
            drawText(this.drawText, this.position.add(new Vec(0, -2)), "#eeee00", "30", alpha);
            drawRect(this.position.add(new Vec(-3, 2)), this.position.add(new Vec(3, 1)), "#000000", alpha);
            drawRect(this.position.add(new Vec(-3, 2)), this.position.add(new Vec(-3 + this.percentCaptured*6, 1)), "#eeee00", alpha);
        }
    }

}

export default Treasure;