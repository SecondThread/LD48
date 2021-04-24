import mongoose, { Schema } from 'mongoose';
import Player from './Player';

const Room = mongoose.model('Room', new Schema({
    isPrivate: Boolean,
    players: [Player]
}));

export default Room;