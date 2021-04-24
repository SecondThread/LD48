import mongoose, { Schema } from 'mongoose';

type IRoom = {
    _id: String,
    isPrivate: Boolean,
    players: [{        
        _id?: String,
        username: String,
    }],
    save: () => Promise<void>,
};

const Room = mongoose.model('Room', new Schema({
    isPrivate: Boolean,
    players: [{        
        username: String,
    }]
}));

export type {IRoom};

export default Room;