import CollisionSeg from "./CollisionSeg";
import Frog from "./Frog";
import Vec from "./geo/Vec";
import Target from "./Target";


class GameObject {
    
    update(collisionSegs: CollisionSeg[], targets: Target[], frogs: Frog[], createObject: (x: GameObject) => void,
        killPlayer: (idToKill: string) => void): void {
            
    }

    render(): void {

    }
    processClick(mouseClick: Vec, targets: Target[]) {

    }

}

export default GameObject;