import express from 'express';
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    const photo = {
        id: 1,
        name: 'photo name',
        description: 'photo description',
    };
    res.send(photo);
});

app.listen(port, () => {
    console.log(`Sunucu ${port} portunda çalıştırıldı`);
});