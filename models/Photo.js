import mongoose from 'mongoose';
import moment from 'moment-timezone';
const { Schema } = mongoose;
import beautifyUnique from 'mongoose-beautiful-unique-validation';
const PhotoSchema = new Schema({
    title: {
        type: String,
        unique: 'Aynı başlık daha önce girilmiş ({VALUE})',
    },
    description: String,
    image: String,
    dateCreated: {
        type: Date,
        default: moment.tz('Europe/Istanbul').format(),
    },
});

PhotoSchema.plugin(beautifyUnique);

const Photo = mongoose.model('photo', PhotoSchema);

export { Photo };