import {Request, Response} from 'express';
import Room from '../models/Room';

async function updatePlayerLocation(req: Request<any>, res: Response<any>): Promise<void> {
    try {
        console.log('Here!');
        const {userId, roomId, x, xVel, y, yVel} = req.body;
        console.log('Updating player location with '+x+" "+y);
        Room.updateOne({ _id: roomId, "players._id": userId },  {
            $set: {
                "players.$.x": x,
                "players.$.xVel": xVel,
                "players.$.y": y,
                "players.$.yVel": yVel,
             }
        });
        res.status(200);
    }
    catch(e) {
        console.log(e);
        res.status(500);
    }
}

export default updatePlayerLocation;