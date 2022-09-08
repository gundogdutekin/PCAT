import mongoose from 'mongoose';
const { Schema } = mongoose;

//CONNECT db
mongoose.connect('mongodb://localhost/pcat-test-db');

//CREAT SCHEMA
const PhotoSchema = new Schema({
    title: String,
    description: String,
});

//CREAT MODEL
const Photo = mongoose.model('photo', PhotoSchema);

//CREAT A PHOTO
Photo.create({
    title: 'Photo 1',
    description: 'Photo 1 lorem ipsum',
});