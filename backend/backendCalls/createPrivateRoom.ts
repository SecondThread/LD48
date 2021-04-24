import {Request, Response} from 'express';
import Room from '../models/Room';

async function createPrivateRoom(req: Request<any>, res: Response<any>): Promise<void> {
    try {
        const now=new Date().getTime();
        const created = await Room.create({
            isPrivate: true, 
            players: [],
            startTime: now+30*1000,
            endTime: now+30*1000+60*1000,
        });
        const createdId = created._id;
        res.status(200).send(createdId);
    }
    catch(e) {
        console.log(e);
        res.status(500);
    }
}

export default createPrivateRoom;