import {Request, Response} from 'express';
import Room from '../models/Room';
import type {IRoom} from '../models/Room';

async function addPlayerToRoom(req: Request<any>, res: Response<any>): Promise<void> {
    try {
        const {username, roomId} = req.body;
        Room.findById(roomId, (err: Error, doc: IRoom) => {
            if (err) {
                console.log(err);
                return;
            }
            doc.players.push({
                username: username,
                x: 0,
                y: 0,
                xVel: 0,
                yVel: 0,
            });
            doc.save();
            res.status(200).send(doc.players[doc.players.length-1]._id);
        });
    }
    catch(e) {
        console.log(e);
        res.status(500);
    }
}

export default addPlayerToRoom;