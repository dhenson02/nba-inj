"use strict";
// Koa server for API endpoints
import Koa     from 'koa';
import Router  from '@koa/router';
import helmet  from 'koa-helmet';

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

const lastReportDateTime = {
    date: null,
    time: null,
};

export async function processReport ( now = moment().tz(`US/Eastern`) ) {
    const date = now.format(`YYYY-MM-DD`);
    if ( now.minutes() < 30 ) {
        now.add(-1, `hour`);
    }
    const time = now.format(`hhA`);

    if (
        lastReportDateTime
        && lastReportDateTime.date === date
        && lastReportDateTime.time === time
    ) {
        logger.debug(`Report already processed for ${date} ${time}, skipping`);
        return {
            matchups: JSON.parse(await fs.promises.readFile(`./output.json`, { encoding: `utf8` })),
            lastReportDateTime,
        };
    }

    const filePath = await downloadFile(date, time);
    if ( !filePath ) {
        throw new Error(`Download failed, see console`);
    }
    const rawFileText = await convertToText(filePath);
    const matchups = parsePivotTable(rawFileText);
    const matchupJson = JSON.stringify(matchups, null, 4);
    await fs.promises.writeFile(`./output.json`, matchupJson, { "encoding": `utf8` });

    lastReportDateTime.date = date;
    lastReportDateTime.time = time;
    logger.debug(`Complete`);

    return {
        matchups,
        lastReportDateTime,
    };
}

const app = new Koa();
const router = new Router();
app.use(helmet());

// Routes
router.get(`/api/injury-report`, async ( ctx ) => {
    try {
        ctx.body = await processReport();
    }
    catch (err) {
        logger.error(`Error processing report: ${err.message}`);
        ctx.status = 500;
        ctx.body = { status: `error`, message: err.message };
    }
});

// Register routes
app.use(router.routes())
   .use(router.allowedMethods());

// Start the server
const PORT = process.env.PORT || 3011;
app.listen(PORT, `127.0.0.1`, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
