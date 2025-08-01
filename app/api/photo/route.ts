import { isLoggedForYear } from '@features/auth/lib/authFunc';
import {
    nextResponse401Error,
    nextResponse404Error,
    nextResponse500Error,
} from '@features/data/lib/serverResponses';
import fs from 'fs/promises';
import { fileExists } from 'lib/fileUtils';
import { prisma } from 'lib/server/prisma';
import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export const GET = async (req: NextRequest) => {
    const searchParams = req.nextUrl.searchParams;
    const fileParam = searchParams.get('file');
    const minify = searchParams.get('minify');

    if (!fileParam || !fileParam.length) {
        return nextResponse404Error('File not specified');
    }

    const filename = fileParam.startsWith('/')
        ? fileParam.substring(1)
        : fileParam; // ošetření počátečního lomítka

    const [albumName, ...restOfPath] = filename.split('/');
    const year =
        (
            await prisma.album.findUnique({
                where: {
                    title: albumName,
                },
            })
        )?.id_year || '-1';

    if (!(await isLoggedForYear(year))) {
        return nextResponse401Error('Unathorized access');
    }

    let imageBuffer: Buffer | undefined;
    try {
        let albumsPath = 'public/img/albums/';
        if (minify != null) {
            const file = '/' + restOfPath.join('/');
            const thumbnailPath = albumsPath + albumName + '/thumbnails' + file;
            if (await fileExists(thumbnailPath)) {
                imageBuffer = await fs.readFile(thumbnailPath);
            } else {
                const filePath = albumsPath + albumName + file;
                imageBuffer = await fs.readFile(filePath);
                const minified = sharp(imageBuffer)
                    .resize({
                        fit: sharp.fit.inside,
                        width: 192 * 2,
                        height: 108 * 2,
                    })
                    .webp({ quality: 70 });
                minified.toFile(thumbnailPath); // save mified for next call
                imageBuffer = await minified.toBuffer();
            }
        } else {
            imageBuffer = await fs.readFile(albumsPath + filename);
        }
    } catch (error) {
        return nextResponse404Error('File not found');
    }

    if (imageBuffer) {
        return new NextResponse(imageBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'image/jpeg',
                'Content-Length': imageBuffer.length.toString(),
            },
        });
    } else {
        return nextResponse500Error('Unknown app error');
    }
};
