import mongoose, { Schema } from 'mongoose';

type IPlayer = {
    _id?: String,
    username: String,
}

type IRoom = {
    _id?: String,
    isPrivate: Boolean,
    players: [IPlayer],
    save: () => Promise<void>,
};

const Room = mongoose.model('Room', new Schema({
    isPrivate: Boolean,
    players: [{        
        username: String,
    }],
    startTime: Number,
    endTime: Number,
}));

export type {IRoom};

export default Room;