"use strict";

import fs from "node:fs";
import path from "node:path";
import axios from "axios";
import { logger } from "../logger/index.js";

import config from "../config.json" with { type: 'json' };

const {
    nbaInjuryReportBaseUrl,
    nbaInjuryReportBaseFilename,
} = config;

export const BASE_FILE_PATH = path.join(`./`, `report-downloads`);

export function makeUrl ( date, time ) {
    const filename = nbaInjuryReportBaseFilename
        .replace(`%DATE%`, date)
        .replace(`%TIMEAMPM%`, time);
    return `${nbaInjuryReportBaseUrl}/${filename}`;
}

export async function downloadFile ( date, time ) {
    const localFilePath = `${BASE_FILE_PATH}/${date}_${time}.pdf`;

    // Confirm file doesn't exist already - no point in extra download if so
    try {
        await fs.promises.stat(localFilePath);
        logger.debug(`Report exists for ${date} ${time}.  Skipping`);
        return localFilePath;
    }
    catch (e) {
        logger.debug(e.message);
        logger.debug(`No existing report found for ${date} ${time}.  Downloading now`);
    }

    const url = makeUrl(date, time);
    logger.debug(`URL to download: ${url}`);
    try {
        const response = await axios({
            method: 'get',
            url,
            responseType: 'stream',
            headers: {
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "en-US,en;q=0.9",
                "Cache-Control": "max-age=0",
                "Connection": "keep-alive",
                "Host": "ak-static.cms.nba.com",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
            },
        });
        const fileStream = fs.createWriteStream(localFilePath);
        response.data.pipe(fileStream);
        await new Promise(( resolve, reject ) => {
            let error = null;
            fileStream.on('error', err => {
                error = err;
                fileStream.close();
                reject(err);
            });
            fileStream.on('close', () => {
                if ( !error ) {
                    logger.info(`Report downloaded to ${localFilePath}`);
                    resolve(true);
                }
            });
        });
        return localFilePath;
    }
    catch ( error ) {
        logger.error(`Error downloading file: ${error.message}`, error);
        return false;
    }
}
