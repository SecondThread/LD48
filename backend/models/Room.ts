import mongoose, { Schema } from 'mongoose';

const Room = mongoose.model('Room', new Schema({
    isPrivate: Boolean,
}));

export default Room;