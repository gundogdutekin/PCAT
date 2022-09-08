import express from 'express';
import ejs from 'ejs';
import path from 'path';

const app = express();
//Template Engine ejs set
app.set('view engine', 'ejs');
//Static files middleware
app.use(express.static('public'));
//routes
app.get('/', (req, res) => {
    res.render('index');
});
app.get('/about', (req, res) => {
    res.render('about');
});
app.get('/add', (req, res) => {
    res.render('add');
});

const port = 3000;
app.listen(port, () => {
    console.log(`Sunucu ${port} portunda çalıştırıldı`);
});