import mongoose from 'mongoose';
import moment from 'moment-timezone';
const { Schema } = mongoose;

const PhotoSchema = new Schema({
    title: { type: String, unique: true },
    description: String,
    image: String,
    dateCreated: {
        type: Date,
        default: moment.tz('Europe/Istanbul').format(),
    },
});
const Photo = mongoose.model('photo', PhotoSchema);
export { Photo };