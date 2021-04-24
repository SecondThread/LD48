import {Request, Response} from 'express';
import type {IRoom} from '../models/Room';
import Room from '../models/Room';


async function joinPublicRoom(req: Request<any>, res: Response<any>): Promise<void> {
    try {
        const validRooms: any = await Room.find({isPrivate: false});
        const first =validRooms==null? null: validRooms.find((x: any) => x.players.length<5);
        if (first==null ) {
            const now=new Date().getTime();
            const created = await Room.create({
                isPrivate: false, 
                players: [],
                startTime: now+30*1000,
                endTime: now+30*1000+60*1000,
            });
            const createdId = created._id;
            res.status(200).json(createdId);
            return;
        }
        const id=first._id;
        res.status(200).json(id);
        return;
    }
    catch(e) {
        console.log(e);
        res.status(500);
    }
}

export default joinPublicRoom;