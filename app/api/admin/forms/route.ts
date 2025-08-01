import { NextRequest } from 'next/server';
import fs from 'fs/promises';
import { dataConfig } from '@features/data/database-config';
import { nextResponse200OK } from '@features/data/lib/serverResponses';

export const GET = async (req: NextRequest) => {
    /*
    res.setHeader('Access-Control-Allow-Origin', 'https://ms-strazisko.cz');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    */
    let definitions = await fs.readFile(dataConfig.formDefPath, 'utf8');
    return nextResponse200OK('OK', { definitions });
};
