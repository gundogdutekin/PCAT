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
//LİST ALL PHOTO
/* Photo.find()
    .exec()
    .then((data) => {
        data.forEach((item) => {
            console.log(`Title:${item.title}`);
            console.log(`Description:${item.description}`);
        });
    })
    .catch((err) => {
        console.log(err);
    }); */
//LİST ONE PHOTO
/* const Id = '6319c4f5248f2a19054f446f';
Photo.find({ _id: Id })
    .exec()
    .then((data) => {
        data.forEach((item) => {
            console.log(`Title:${item.title}`);
            console.log(`Description:${item.description}`);
        });
    })
    .catch((err) => {
        console.log(err);
    }); */
//CREAT A PHOTO
/* Photo.create({
    title: 'Photo 3',
    description: 'Photo 3 lorem ipsum',
}); */
//DELETE A PHOTO
/* const Id = '6319ccabb90f94cb574b3b20';

Photo.deleteOne({ _id: Id }, (err, data) => {
    if (err) {
        console.log(`ERROR!The document with id ${Id} has not been deleted`);
        console.log(data);
    }
    console.log(`The document with id ${Id} has been deleted`);
}); */
//UPDATE A PHOTO
/* Photo.updateOne({ title: 'Photo 3' }, { description: 'Photo 333 lorem ipsum' },
    (err, data) => {
        if (err) console.log('The photo has updated');
        console.log(data);
    }
); */