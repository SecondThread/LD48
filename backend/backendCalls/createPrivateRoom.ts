import {Request, Response} from 'express';
import Room from '../models/Room';

async function createRoom(req: Request<any>, res: Response<any>): Promise<void> {
    try {
        console.log('Resetting room');
        const now=new Date().getTime();
        const created = await Room.create({
            isPrivate: true, 
            frogsWon: false,
            players: [],
            startTime: now+30*1000,
            endTime: now+30*1000+100*1000,
        });
        const createdId = created._id;
        console.log('Creating private room with id: '+createdId);
        res.status(200).send(createdId);
    }
    catch(e) {
        console.log(e);
        res.status(500).send();
    }
}

export default createRoom;