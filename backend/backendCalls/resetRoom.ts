import {Request, Response} from 'express';
import Room, { IRoom } from '../models/Room';

async function resetRoom(req: Request<any>, res: Response<any>): Promise<void> {
    try {
        console.log('Resetting room.');
        const {roomId} = req.body;
        Room.findById(roomId, (err: Error, doc: IRoom) => {
            if (err) {
                console.log(err);
                return;
            }
            if (doc==null) {
                res.status(500).send();
                return;
            }
            if (doc.endTime>new Date().getTime()) {
                res.status(200).send(doc._id);
                //then we already have reset this room, ignore this request, but consider it a success
                return;
            }

            doc.players=[];
            const now=new Date().getTime();
            const secondsUntilStart=15;
            doc.startTime = now+secondsUntilStart*1000;
            doc.endTime = now+secondsUntilStart*1000 + 60 * 1000;
            doc.frogsWon = false;
            doc.save((err:any, result:any) => {
                if (err!=null) {
                    console.log(err);
                    res.status(500).send();
                    return;
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

export default resetRoom;