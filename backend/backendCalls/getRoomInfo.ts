import {Request, Response} from 'express';
import Room, {IRoom} from '../models/Room';

function getRoomInfo(req: Request<any>, res: Response<any>): void {
    try {
        console.log('Getting room info.');
        const {roomId} = req.body;
        Room.findById(roomId, (err: Error, doc: IRoom) => {
            return res.status(200).json(doc);
        });
    }
    catch(e) {
        console.log(e);
        res.status(500);
    }
}

export default getRoomInfo;