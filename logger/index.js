"use strict";

import pino from "pino";
// import pinoPretty from "pino-pretty";

export const logger = pino({
    level: process.env.LOG_LEVEL || `debug`,
    // prettyPrint: {
    //     translateTime: 'yyyy-mm-dd hh:MM:ss.l',
    //     ignore: [ 'pid', 'hostname' ],
    // },
});
