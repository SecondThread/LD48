import CollisionSeg from "./CollisionSeg";
import Frog from "./Frog";
import Vec from "./geo/Vec";
import Target from "./Target";


class GameObject {
    
    update(collisionSegs: CollisionSeg[], targets: Target[], frogs: Frog[], createObject: (x: GameObject) => void,
        killPlayer: (idToKill: string) => void, myFrog: Frog): void {
            
    }

    render(): void {

    }
    processClick(mouseClick: Vec, targets: Target[], roomId: string) {

    }

}

export default GameObject;