import {Request, Response} from 'express';
import Room from '../models/Room';

function killPlayer(req: Request<any>, res: Response<any>): void {
    try {
        console.log('Updating player location');
        const {userId, roomId} = req.body;
        Room.updateOne({ _id: roomId, "players._id": userId },  {
            $set: {
                "players.$.lastTimeDied": new Date().getTime(),
            },
        },
        {},
        (err, doc) => {
            if (err != null) {
                res.status(500).send();
                return;
            }
            res.status(200).json({okay: "Okay"}).send();
        });
    }
    catch(e) {
        console.log(e);
        res.status(500).send();
    }
}

export default killPlayer;