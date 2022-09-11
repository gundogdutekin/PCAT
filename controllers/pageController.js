import { Photo } from '../models/Photo.js';

const getAboutPage = (req, res) => {
    res.render('about');
};
const getAddPage = (req, res) => {
    const message = {
        title: 'Plese add photo. ',
        type: 'info',
    };
    res.render('add', { message });
};
const getEditPage = async(req, res) => {
    const photo = await Photo.findById(req.params.id);
    res.render('edit', { photo });
};

export { getAboutPage, getAddPage, getEditPage };