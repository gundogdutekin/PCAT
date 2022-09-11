import express from 'express';
import mongoose from 'mongoose';
import fileUpload from 'express-fileupload';
import methodOverride from 'method-override';

import {
    getAllPhotos,
    getPhoto,
    createPhoto,
    photoUpdate,
    photoDelete,
} from './controllers/photoController.js';
import {
    getAboutPage,
    getAddPage,
    getEditPage,
} from './controllers/pageController.js';

const app = express();

//CONNECT DB
mongoose.connect('mongodb://localhost/pcat-test-db');
//Template Engine "EJS" Set
app.set('view engine', 'ejs');
//MİDDLEWARS
//Static Files Middleware
app.use(express.static('public'));
//Post Request Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Fileupload Middleware
app.use(fileUpload());
//method-override Middleware
app.use(methodOverride('_method', { methods: ['POST', 'GET'] }));

//ROUTES
app.get('/', getAllPhotos);
app.get('/about', getAboutPage);
app.get('/add', getAddPage);
app.get('/photo/:id', getPhoto);
app.post('/photos', createPhoto);
app.get('/photo/edit/:id', getEditPage);
app.post('/photoUpdate', photoUpdate);
app.delete('/photo/:id', photoDelete);

//PORT DEFİNED
const port = 3000;
app.listen(port, () => {
    console.log(`Sunucu ${port} portunda çalıştırıldı`);
});