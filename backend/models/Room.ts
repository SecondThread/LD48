import mongoose, { Schema } from 'mongoose';

type IPlayer = {
    _id?: String,
    username: String,
    x: Number,
    y: Number,
    xVel: Number,
    yVel: Number,
}

type IRoom = {
    _id?: String,
    isPrivate: Boolean,
    players: [IPlayer],
    save: any,
};

const Room = mongoose.model('Room', new Schema({
    isPrivate: Boolean,
    players: [{        
        username: String,
        x: Number,
        y: Number,
        xVel: Number,
        yVel: Number,
    }],
    startTime: Number,
    endTime: Number,
}));

export type {IRoom};

export default Room;