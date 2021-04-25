import {Request, Response} from 'express';
import Room from '../models/Room';

async function updatePlayerLocation(req: Request<any>, res: Response<any>): Promise<void> {
    try {
        console.log('Updating player location');
        const {userId, roomId, x, xVel, y, yVel} = req.body;
        await Room.updateOne({ _id: roomId, "players._id": userId },  {
            $set: {
                "players.$.timeUpdated": new Date().getTime(),
                "players.$.x": x,
                "players.$.xVel": xVel,
                "players.$.y": y,
                "players.$.yVel": yVel,
            },
        },
        {});
        res.status(200).json({okay: "Okay"}).send();
    }
    catch(e) {
        console.log(e);
        res.status(500).send();
    }
}

export default updatePlayerLocation;