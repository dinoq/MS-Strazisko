import { NextRequest } from 'next/server';
import fs from 'fs';
import sharp from 'sharp';
import {
    nextResponse200OK,
    nextResponse500Error,
} from '@features/data/lib/serverResponses';
import path from 'path';

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.formData();

        const paths = new Map<number, string>();
        const files = new Map<number, File>();

        for (const [key, value] of body.entries()) {
            const match = key.match(/(path|file)(\d+)/);
            if (!match) continue;

            const [, type, indexStr] = match;
            const index = parseInt(indexStr, 10);

            if (type === 'path' && typeof value === 'string') {
                paths.set(index, value);
            } else if (
                type === 'file' &&
                typeof value === 'object' &&
                value !== null &&
                'arrayBuffer' in value
            ) {
                files.set(index, value);
            }
        }

        // 2. Spáruj a ulož
        for (const [index, path] of paths.entries()) {
            const file = files.get(index);
            if (!file) continue;

            await saveFile(file, path);
        }

        return nextResponse200OK('success??');
    } catch (error) {
        console.log('error: ', error);
        return nextResponse500Error('Chyba při zpracování souboru!');
    }
};

const saveFile = async (file: File, url: string) => {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let fullPath = './public' + (url.startsWith('/') ? '' : '/') + url;
    const parsedPath = path.parse(fullPath);

    const directory = parsedPath.dir;

    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }

    if (fs.existsSync(fullPath)) {
        let newPath = fullPath;
        const parsedPath = path.parse(fullPath);
        const match = parsedPath.name.match(/(.+)\((\d+)\)$/);

        if (match) {
            // If filename ends with an index in brackets, increment it
            const baseName = match[1];
            const currentIndex = parseInt(match[2], 10);
            newPath = path.join(
                parsedPath.dir,
                `${baseName}(${currentIndex + 1})${parsedPath.ext}`
            );
        } else {
            // If no index exists, add [1] to the filename
            newPath = path.join(
                parsedPath.dir,
                `${parsedPath.name}(1)${parsedPath.ext}`
            );
        }

        fullPath = newPath;
    }

    const minify = true;
    if (file?.type?.includes('image') && minify) {
        await sharp(buffer)
            .resize({
                fit: sharp.fit.inside,
                width: 1920,
                height: 1080,
            })
            .webp({ quality: 80 })
            .toFile(fullPath);
    } else {
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        fs.writeFileSync(fullPath, uint8Array);
    }
    return;
};
