import { OperationResult } from '@features/data/lib/types';
import fs from 'fs/promises';
import { fileExists } from 'lib/fileUtils';
import 'server-only';
import sharp from 'sharp';

export const knownMethods: {
    [name: string]: {
        paramCount: number;
        method: (params: any[]) => Promise<OperationResult>;
    };
} = {
    createDirectoryIfNotExist: {
        paramCount: 1,
        method: createDirectoryIfNotExist,
    },
    deleteDirectory: {
        paramCount: 1,
        method: deleteDirectory,
    },
    deleteFile: {
        paramCount: 1,
        method: deleteFile,
    },
    createThumbnail: {
        paramCount: 1,
        method: createThumbnail,
    },
};

async function createDirectoryIfNotExist(params): Promise<OperationResult> {
    const newDirPath = params[0];
    if (!(await fileExists(newDirPath))) {
        await fs.mkdir(newDirPath, { recursive: true });
        return {
            ok: true,
            msg: 'Directory created',
        };
    }
    return {
        ok: true,
        msg: 'Directory already exists',
    };
}

async function deleteDirectory(params): Promise<OperationResult> {
    const directoryPath = params[0];
    if (await fileExists(directoryPath)) {
        await fs.rmdir(directoryPath, { recursive: true });
        return {
            ok: true,
            msg: 'Directory removed',
        };
    } else {
        return {
            ok: false,
            error: 'Directory not found',
        };
    }
}

async function deleteFile(params): Promise<OperationResult> {
    const filePath = 'public\\' + params[0];
    if (await fileExists(filePath)) {
        await fs.unlink(filePath);
        return {
            ok: true,
            msg: 'File deleted',
        };
    }

    return {
        ok: false,
        error: 'File not found',
    };
}

async function createThumbnail(params): Promise<OperationResult> {
    const originalFilePath = params[0];
    let thumbnailsDirPath =
        originalFilePath.substring(0, originalFilePath.lastIndexOf('/')) +
        '/thumbnails';
    let filename = originalFilePath.substring(
        originalFilePath.lastIndexOf('/')
    );
    if (!(await fileExists(thumbnailsDirPath))) {
        await fs.mkdir(thumbnailsDirPath, { recursive: true });
    }
    let fileData = await fs.readFile(originalFilePath);
    await sharp(fileData)
        .resize({
            fit: sharp.fit.inside,
            width: 200,
            height: 200,
        })
        .webp({ quality: 80 })
        .toFile(thumbnailsDirPath + filename);

    return {
        ok: true,
        msg: 'Thumbnail created',
    };
}
