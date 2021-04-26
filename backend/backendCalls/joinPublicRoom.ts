import {Request, Response} from 'express';
import type {IRoom} from '../models/Room';
import Room from '../models/Room';

async function joinPublicRoom(req: Request<any>, res: Response<any>): Promise<void> {
    try {
        const validRooms: any = await Room.find({isPrivate: false});
        const first = validRooms == null ? null : validRooms.find((x: any) => x.players.length<5);
        const SECOND_UNTIL_START=15;
        if (first==null ) {
            const now=new Date().getTime();
            console.log('Creating public room.');
            const created = await Room.create({
                isPrivate: false, 
                frogsWon: false,
                players: [],
                startTime: now+SECOND_UNTIL_START*1000,
                endTime: now+SECOND_UNTIL_START*1000+60*1000,
            });
            console.log('Created public room.');
            const createdId = created._id;
            res.status(200).json(createdId).send();
            return;
        }
        const id=first._id;
        res.status(200).json(id).send();
        return;
    }
    catch(e) {
        console.log(e);
        res.status(500).send(e);
    }
}

export default joinPublicRoom;