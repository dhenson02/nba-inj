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
    const url = makeUrl(date, time);
    logger.debug(`URL to download: ${url}`);
    const localFilePath = `${BASE_FILE_PATH}/${date}_${time}.pdf`;

    // Confirm file doesn't exist already - no point in extra download if so
    try {
        await fs.promises.stat(localFilePath);
        logger.warn(`Report exists for ${date} ${time}.  Skipping`);
        return localFilePath;
    }
    catch (e) {
        logger.info(`No existing report found for ${date} ${time}.  Downloading now`);
    }

    try {
        const response = await axios({
            method: 'get',
            url,
            responseType: 'stream',
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
