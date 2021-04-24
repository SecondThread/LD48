import {Request, Response} from 'express';
import Room from '../models/Room';

async function createPrivateRoom(req: Request<any>, res: Response<any>): Promise<void> {
    const created = await Room.create({isPrivate: true, players: []});
    const createdId = created._id;
    res.status(200).send(createdId);
}

export default createPrivateRoom;