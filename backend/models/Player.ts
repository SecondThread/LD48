import mongoose, { Schema } from 'mongoose';

const Player = mongoose.model('Player', new Schema({
    name: String
}));

export default Player;