import {Request, Response} from 'express';
import Room from '../models/Room';
import type {IRoom} from '../models/Room';

async function addPlayerToRoom(req: Request<any>, res: Response<any>): Promise<void> {
    const {username, roomId} = req.body;
    Room.findById(roomId, (err: Error, doc: IRoom) => {
        doc.players.push({
            username: username
        });
        doc.save();
        res.status(200).send(doc.players[doc.players.length-1]._id);
    });
}

export default addPlayerToRoom;