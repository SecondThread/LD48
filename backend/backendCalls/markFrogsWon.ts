import {Request, Response} from 'express';
import Room, { IRoom } from '../models/Room';

async function markFrogsWon(req: Request<any>, res: Response<any>): Promise<void> {
    try {
        console.log('Marking frogs won.');
        const {roomId} = req.body;
        Room.findById(roomId, (err: Error, doc: IRoom) => {
            if (err) {
                console.log(err);
                return;
            }
            // if (doc.endTime>new Date().getTime()) {
            //     res.status(200).send(doc._id);
            //     //then we already have reset this room, ignore this request, but consider it a success
            //     return;
            // }

            doc.frogsWon = true;
            doc.endTime = new Date().getTime();
            doc.save((err:any, result:any) => {
                if (err!=null) {
                    console.log(err);
                }
                res.status(201).send(doc._id);
            });
        });
    }
    catch(e) {
        console.log(e);
        res.status(500).send();
    }
}

export default markFrogsWon;