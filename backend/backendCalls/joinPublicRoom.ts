import {Request, Response} from 'express';
import Room from '../models/Room';

const MAX_PLAYERS_IN_ROOM=10;

async function joinPublicRoom(req: Request<any>, res: Response<any>): Promise<void> {
    const validRooms = await Room.find({isPrivate: false});
    if (validRooms!=null && validRooms.length>0) {
        const id=validRooms[0]._id;
        res.status(200).json(id);
        return;
    }
    const created = await Room.create({isPrivate: false});
    const createdId = created._id;
    res.status(200).json(createdId);
}

export default joinPublicRoom;