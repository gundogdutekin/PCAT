import express from 'express';
import path from 'path';
//__dirname değişkeninin kullanılması için son sürümlerde yapılan düzenleme
/*import { fileURLToPath } from 'url';
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename); */

const app = express();

app.use(express.static('public'));
app.get('/', (req, res) => {
    //res.sendFile(path.resolve(__dirname, 'temp/index.html'));
    /*https://nodejs.org/api/esm.html#esm_no_filename_or_dirname buradaki açıklamaya göre __dirname kaldırılmış */
    res.sendFile(path.resolve('temp/index.html'));
});
const port = 3000;
app.listen(port, () => {
    console.log(`Sunucu ${port} portunda çalıştırıldı`);
});