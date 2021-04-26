import { toast } from "react-toastify";
import CollisionSeg from "./CollisionSeg";
import { drawText } from "./drawing/ImageLoader";
import Frog from "./Frog";
import GameObject from "./GameObject";
import Vec from "./geo/Vec";
import Target from "./Target";

class Bank extends GameObject {

    position: Vec;
    showText: boolean = false;
    textCenter: Vec;
    moneySavedCenter: Vec;
    buyRocketCenter: Vec;
    myFrog: Frog | null = null;

    constructor(position: Vec) {
        super();
        this.position=position;
        this.textCenter=position;
        this.moneySavedCenter = position;
        this.buyRocketCenter = position;
    }

    update(collisionSegs: CollisionSeg[], targets: Target[], frogs: Frog[], createObject: (x: GameObject) => void,
        killPlayer: (idToKill: string) => void, myFrog: Frog): void {
        const distToPlayer=myFrog.position.sub(this.position).mag();
        this.showText=distToPlayer<20 && myFrog.onTarget;
        this.textCenter = myFrog.position.x<this.position.x?this.position.add(new Vec(-10, 2.5)): this.position.add(new Vec(10, 2.5));
        this.moneySavedCenter = this.textCenter.add(new Vec(0, -1));
        this.buyRocketCenter = this.textCenter.add(new Vec(0, -3));
        this.myFrog=myFrog;
    }

    render(): void {
        if (this.showText)  {
            drawText("Welcome to the shop!", this.textCenter, "#333333");
            drawText("Your money has been saved.", this.moneySavedCenter, "#333333");
            drawText("Buy Rocket ($200)", this.buyRocketCenter, "#333333");
        }
    }

    processClick(mouseClick: Vec, targets: Target[], roomId: string) {
        if (!this.showText) return;
        const distFromBuyRocket=this.buyRocketCenter.sub(mouseClick).mag();
        if (distFromBuyRocket < 3) {
            if (this.myFrog!.moneyInBank>200) {
            // if (true) {
                toast.success('Congratulations!');
                fetch('/api/markFrogsWon', {
                    method: 'POST',
                    headers: {
                      'Access-Control-Allow-Origin': '*',
                      'Content-Type': 'application/json',
                      'Access-Control-Allow-Credentials': 'true',
                    },
                    body: JSON.stringify({roomId}),
                  }).then(res => res.text().then(data => {
                    console.log('Got response: '+data);
                    const json=JSON.parse(data);
                    console.log(json);
                  }).catch((e) => console.log(e)));
            }
            else {
                toast.warn('Not enough money...');
            }
        }
    }

}

export default Bank;