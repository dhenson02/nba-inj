"use strict";

import pg from "pg";
import { logger } from "../logger/index.js";
import dotenv from "dotenv";
dotenv.config();

const {
    DB_HOST,
    DB_PORT,
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    DB_URL,
} = process.env;

const cfg = {
    host: DB_HOST,
    port: DB_PORT,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
    ssl: false,
};

if ( DB_URL ) {
    const urlCfg = new URL(DB_URL);
    cfg.host     = urlCfg.hostname;
    cfg.port     = urlCfg.port;
    cfg.database = urlCfg.pathname.slice(1);
    cfg.user     = urlCfg.username;
    cfg.password = urlCfg.password;
}

const pool = new pg.Pool(cfg);

pool.on(`error`, err => {
    logger.error(`Unexpected error on idle client: ${err.message}`);
    process.exit(1);
});

export async function queryDb ( text, params ) {
    const start = Date.now();
    const client = await pool.connect();
    try {
        const res = await client.query(text, params);
        const duration = Date.now() - start;
        logger.debug(`Executed query in ${duration}ms: ${text} | params: ${JSON.stringify(params)}`);
        return res;
    }
    catch (err) {
        logger.error(`Error executing query: ${err.message} | query: ${text} | params: ${JSON.stringify(params)}`);
        throw err;
    }
    finally {
        client.release();
    }
}

export async function closeDbPool () {
    await pool.end();
    logger.info(`Database pool has been closed`);
}
