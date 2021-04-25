import {Request, Response} from 'express';
import Room, {IRoom} from '../models/Room';

function getRoomInfo(req: Request<any>, res: Response<any>): void {
    try {
        console.log('Getting room info.');
        const {roomId} = req.body;
        Room.findById(roomId, (err: Error, doc: IRoom) => {
            if (doc==null) {
                res.status(500).send();
                return;
            }

            if (new Date().getTime()>doc.startTime && doc.players.find(x => x.isShark)==null) {
                console.log("No shark yet, creating one now...");
                const targetInd=Math.floor(Math.random()*doc.players.length);
                doc.players[targetInd].isShark=true;
                doc.markModified('players.'+targetInd);
                doc.save((err: Error, newDoc: IRoom) => {
                    if (err!=null) {
                        console.log(err);
                        res.status(500).send();
                        return;
                    }
                    console.log('Saved.');
                    res.status(200).json(newDoc).send();
                });
            }
            else {
                res.status(200).json(doc).send();
            }
        });
    }
    catch(e) {
        console.log(e);
        res.status(500).send();
    }
}

export default getRoomInfo;