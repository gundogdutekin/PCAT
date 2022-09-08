import express from 'express';
import mongoose from 'mongoose';
import { Photo } from './models/Photo.js';
const app = express();

//CONNECT db
mongoose.connect('mongodb://localhost/pcat-test-db');
//Template Engine ejs set
app.set('view engine', 'ejs');
//Middlewares
app.use(express.static('public'));
//Post Middlewars
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//routes
app.get('/', async(req, res) => {
    const Photos = await Photo.find({});
    res.render('index', { photos: Photos });
});
app.get('/about', (req, res) => {
    res.render('about');
});
app.get('/add', (req, res) => {
    res.render('add');
});
app.post('/photos', async(req, res) => {
    await Photo.create(req.body);
    res.redirect('/');
});

const port = 3000;
app.listen(port, () => {
    console.log(`Sunucu ${port} portunda çalıştırıldı`);
});