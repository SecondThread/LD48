import {Request, Response} from 'express';
import Room from '../models/Room';
import type {IRoom} from '../models/Room';

function addPlayerToRoom(req: Request<any>, res: Response<any>): void {
    console.log('Adding player to room!');
    const {username, roomId} = req.body;
    Room.findById(roomId, (err: Error, doc: IRoom) => {
        if (err) {
            console.log(err);
            return;
        }
        doc.players.push({
            timeUpdated: new Date().getTime(),
            isShark: false,
            username: username,
            x: 0,
            y: 0,
            xVel: 0,
            yVel: 0,
        });
        doc.save((err:any, result:any) => {
            if (err!=null) {
                console.log(err);
            }
            res.status(201).send(doc.players[doc.players.length-1]._id);
        });
    });
}

export default addPlayerToRoom;