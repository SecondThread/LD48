import mongoose, { Schema } from 'mongoose';

type IPlayer = {
    _id?: string,
    timeUpdated: Number,
    lastTimeDied: Number,
    isShark: Boolean,
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
    startTime: Number,
    endTime: Number,
    markModified: any;
};

const Room = mongoose.model('Room', new Schema({
    isPrivate: Boolean,
    players: [{        
        timeUpdated: Number,
        lastTimeDied: Number,
        isShark: Boolean,
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