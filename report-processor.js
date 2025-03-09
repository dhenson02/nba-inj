"use strict";

import fs from "node:fs";
import moment from "moment-timezone";
import { logger } from "./logger/index.js";

import {
    downloadFile,
} from "./report-utils/downloader.js";

import {
    convertToText,
    parsePivotTable,
} from "./report-utils/parser.js";

export async function processReport ( now = moment().tz(`US/Eastern`) ) {
    const date = now.format(`YYYY-MM-DD`);
    if ( now.minutes() < 30 ) {
        now.add(-1, `hour`);
    }
    const time = now.format(`hhA`);

    const filePath = await downloadFile(date, time);
    if ( !filePath ) {
        throw new Error(`Download failed, see console`);
    }
    const rawFileText = await convertToText(filePath);
    const matchups = parsePivotTable(rawFileText);
    await fs.promises.writeFile(`./output.json`, JSON.stringify(matchups, null, 4), { "encoding": `utf8` });

    logger.info(`Complete`);
}

processReport(moment(`2025-03-08T18:29:00`).tz(`US/Eastern`));
