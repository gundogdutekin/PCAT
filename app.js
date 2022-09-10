import express from 'express';
import mongoose from 'mongoose';
import fileUpload from 'express-fileupload';
import methodOverride from 'method-override';
import fs from 'fs';
import path from 'path';
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
//method-override Middleware
app.use(methodOverride('_method'));

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
    //console.log(req.body);
    const uploadDir = './public/uploads';

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }
    let reqbody = req.body;
    let photoTitle = reqbody.title;
    let uploadImage = req.files.image;
    let imageMimetype = req.files.image.mimetype;
    let ex = imageMimetype.split('/')[1];
    const slugify = () => {
        let trMap = {
            çÇ: 'c',
            ğĞ: 'g',
            şŞ: 's',
            üÜ: 'u',
            ıİ: 'i',
            öÖ: 'o',
        };
        for (let key in trMap) {
            photoTitle = photoTitle.replace(
                new RegExp('[' + key + ']', 'g'),
                trMap[key]
            );
        }
        return photoTitle
            .replace(/[^-a-zA-Z0-9\s]+/gi, '') // remove non-alphanumeric chars
            .replace(/\s/gi, '-') // convert spaces to dashes
            .replace(/[-]+/gi, '-') // trim repeated dashes
            .toLowerCase();
    };
    let uploadPath = `./public/uploads/${uploadImage.name}`;
    let newReNameUploadPath = `./public/uploads/${slugify()}.${ex}`;

    uploadImage.mv(uploadPath, async() => {
        fs.renameSync(uploadPath, newReNameUploadPath);

        let docCreate = await Photo.create({
            ...req.body,
            image: `/uploads/${slugify()}.${ex}`,
        });
        return docCreate;
    });
    res.redirect('/');
});
app.get('/photo/edit/:id', async(req, res) => {
    const photo = await Photo.findById(req.params.id);
    res.render('edit', { photo });
});
app.post('/photoUpdate', async(req, res) => {
    const photo = await Photo.findById(req.body.id);
    const oldImage = `./public/${photo.image}`;
    const fileExtension = (file) => {
        return path.extname(file);
    };
    const slugify = (title) => {
        let trMap = {
            çÇ: 'c',
            ğĞ: 'g',
            şŞ: 's',
            üÜ: 'u',
            ıİ: 'i',
            öÖ: 'o',
        };
        for (let key in trMap) {
            title = title.replace(new RegExp('[' + key + ']', 'g'), trMap[key]);
        }
        return title
            .replace(/[^-a-zA-Z0-9\s]+/gi, '') // remove non-alphanumeric chars
            .replace(/\s/gi, '-') // convert spaces to dashes
            .replace(/[-]+/gi, '-') // trim repeated dashes
            .toLowerCase();
    };
    if (!req.files || Object.keys(req.files).length === 0) {
        photo.title = req.body.title;
        fs.renameSync(
            oldImage,
            `./public/uploads/${slugify(req.body.title)}${fileExtension(oldImage)}`
        );
        photo.image = `/uploads/${slugify(req.body.title)}${fileExtension(
      oldImage
    )}`;
        photo.description = req.body.description;
        photo.save();
        res.redirect('/');
    } else {
        const uploadDir = './public/uploads';

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }

        //Old image delete
        fs.unlinkSync(oldImage);

        let uploadImage = req.files.image;
        let reqbody = req.body;
        let photoTitle = req.body.title;
        let imageMimetype = req.files.image.mimetype;
        let ex = imageMimetype.split('/')[1];

        let uploadPath = `./public/uploads/${uploadImage.name}`;
        let newReNameUploadPath = `./public/uploads/${slugify(photoTitle)}.${ex}`;

        uploadImage.mv(uploadPath, async() => {
            fs.renameSync(uploadPath, newReNameUploadPath);
            const photo = await Photo.findById(req.body.id);
            photo.title = req.body.title;
            photo.description = req.body.description;
            photo.image = `/uploads/${slugify(photoTitle)}.${ex}`;
            photo.save();
        });
        res.redirect('/');
    }
});

//PORT DEFİNED
const port = 3000;
app.listen(port, () => {
    console.log(`Sunucu ${port} portunda çalıştırıldı`);
});