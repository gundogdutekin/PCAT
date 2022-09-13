import fs from 'fs';
//import fs from 'fs/promises';
import path from 'path';
import { Photo } from '../models/Photo.js';

const getAllPhotos = async(req, res) => {
    //pagination start
    const page = req.query.page || 1;
    const photosPerPage = 3;

    const totalPhotos = await Photo.find().countDocuments();
    const Photos = await Photo.find({})
        .sort('-dateCreated')
        .skip((page - 1) * photosPerPage)
        .limit(photosPerPage);
    let desc = 0;
    if (page != 1) {
        desc = page - 1;
    }
    let inc = 0;
    if (page != Math.ceil(totalPhotos / photosPerPage)) {
        inc = parseInt(page) + 1;
    }
    res.render('index', {
        photos: Photos,
        current: page,
        pages: Math.ceil(totalPhotos / photosPerPage),
        leftArrow: desc,
        rightArrow: inc,
    });
};

const getPhoto = async(req, res) => {
    const photo = await Photo.findById(req.params.id);
    res.render('photo', { photo });
};

const createPhoto = (req, res, next) => {
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
        await Photo.create({
                ...req.body,
                image: `/uploads/${slugify()}.${ex}`,
            })
            .then(() => {
                fs.renameSync(uploadPath, newReNameUploadPath);
                res.redirect('/');
            })
            .catch((err) => {
                fs.unlinkSync(uploadPath);

                const message = {
                    title: 'Photo kayıt edilemedi çünkü bu title de başka bir veri var. ',
                    type: 'danger',
                };
                res.render('add', { message });
            });
    });
};

const photoUpdate = async(req, res) => {
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
};
const photoDelete = async(req, res) => {
    const findFilePath = await Photo.findOne({ _id: req.params.id }).exec();
    const path = `./public${findFilePath.image}`;
    fs.unlinkSync(path);
    await Photo.findByIdAndDelete(req.params.id);
    res.redirect('/');
};

export { getAllPhotos, getPhoto, createPhoto, photoUpdate, photoDelete };