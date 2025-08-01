import fs from 'fs/promises';
import { getAllFiles } from 'lib/fileUtils';
import sharp from 'sharp';
const path = require('path');

// TODO SOUBOR SE NEPOUŽÍVÁ ALE MOŽNÁ SE BUDE NĚKDE HODIT (ASI NĚKDE PŘI UKLÁDÁNÍ FOTEK??)
async function handler(req, res) {
    const result = await getAllFiles('public/img/albums/all');
    for (const file of result) {
        let imageBuffer = await fs.readFile(file);
        const fname =
            'public/img/albums/compressed90/' + Math.random() + '.webp';
        await sharp(imageBuffer)
            .resize({
                fit: sharp.fit.inside,
                width: 1920,
                height: 1080,
            })
            .webp({ quality: 90 })
            .toFile(fname);
    }
    res.status(200).send('done!');
}

export default handler;
