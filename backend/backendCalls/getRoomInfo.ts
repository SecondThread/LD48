import {Request, Response} from 'express';

function getRoomInfo(req: Request<any>, res: Response<any>): void {
    const {roomId} = req.body;
    
}

export default getRoomInfo;