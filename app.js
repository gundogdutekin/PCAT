import express from 'express';
import mongoose from 'mongoose';
import fileUpload from 'express-fileupload';
import fs from 'fs';
import { Photo } from './models/Photo.js';
const app = express();

//CONNECT DB
mongoose.connect('mongodb://localhost/pcat-test-db');
//Template Engine "EJS" Set
app.set('view engine', 'ejs');
//MİDDLEWARS
//Static Files Middleware
app.use(express.static('public'));
//Post Request Middlewars
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//Fileupload Middleware
app.use(fileUpload());

//ROUTES
app.get('/', async(req, res) => {
    const Photos = await Photo.find({}).sort('-dateCreated');
    res.render('index', { photos: Photos });
});
app.get('/about', (req, res) => {
    res.render('about');
});
app.get('/add', (req, res) => {
    res.render('add');
});
app.get('/photo/:id', async(req, res) => {
    const photo = await Photo.findById(req.params.id);
    res.render('photo', { photo });
});
app.post('/photos', (req, res) => {
    const uploadDir = './public/uploads';

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }
    let uploadImage = req.files.image;
    let uploadPath = `./public/uploads/${uploadImage.name}`;

    uploadImage.mv(uploadPath, async() => {
        await Photo.create({
            ...req.body,
            image: `/uploads/${uploadImage.name}`,
        });
    });
    res.redirect('/');
});
//PORT DEFİNED
const port = 3000;
app.listen(port, () => {
    console.log(`Sunucu ${port} portunda çalıştırıldı`);
});