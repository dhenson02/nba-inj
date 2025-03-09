"use strict";

import fs from "node:fs";
import { spawn } from "node:child_process";
import {
    STATUSES,
    TEAMS,
} from "./helper.js";
import { logger } from "../logger/index.js";

import config from "../config.json" with { type: 'json' };

const {
    pdfConvertUtil,
    pdfConvertUtilArgs,
} = config;

export function convertToText ( infile ) {
    const outfile = infile + `.txt`;
    const args = pdfConvertUtilArgs
        .replace(`%INPUTFILE%`, infile)
        .replace(`%OUTPUTFILE%`, outfile);
    const argsArray = args.split(/\s/);
    const converter = spawn(pdfConvertUtil, argsArray);
    return new Promise(( resolve, reject ) => {
        converter.stdout.on(`data`, data => {
            logger.info(`${pdfConvertUtil} | ${data}`);
        });
        converter.stdout.on(`data`, data => {
            logger.error(`${pdfConvertUtil} | ${data}`);
            reject();
        });
        converter.on(`close`, async code => {
            logger.debug(`${pdfConvertUtil} finished with code ${code}`);
            const txtFile = await fs.promises.readFile(outfile, { "encoding": `utf8` });
            resolve(txtFile);
        });
    });
}

export function getLines ( file ) {
    const lines = file
        .split(`\n`)
        .filter(line => {
            return (
                // Not page # line
                !/Page \d+ of \d+/.test(line) &&
                // Not report title/heading line
                !/Injury Report:/.test(line)
            );
        });
    return lines;
}

export function getCells ( lines ) {
    const first = lines[0];
    const cells = first.split(/\s{2,}/);
    return cells;
}

export function makePlayer ( name, status, reason ) {
    if ( reason === `NOT YET SUBMITTED` ) {
        return null;
    }
    // const details = {};
    return {
        name,
        status,
        reason,
        // details,
    };
}

export function makeMatchup ( date, time, matchup ) {
    const [
        awayTeam,
        homeTeam,
    ] = matchup.split(`@`);

    return {
        date,
        time,
        matchup,
        teams: [{
            team: awayTeam,
            teamName: ``,
            players: [],
        }, {
            team: homeTeam,
            teamName: ``,
            players: [],
        }],
    };
}

export function getCellTypes ( line ) {
    const cells = getCells([line]);
    let cellTypes = {};
    for ( const cell of cells ) {
        if ( /^\d\d\/\d\d\/\d\d\d\d$/.test(cell) ) {
            cellTypes[`Game Date`] = cell;
        }
        else if ( /^\d\d:\d\d \(\w\w\)$/.test(cell) ) {
            cellTypes[ `Game Time` ] = cell;
        }
        else if ( /^[A-Z]{3}@[A-Z]{3}$/.test(cell) ) {
            cellTypes[ `Matchup` ] = cell;
        }
        else if ( TEAMS.includes(cell) ) {
            cellTypes[ `Team` ] = cell;
        }
        else if ( /, \w/.test(cell) ) {
            cellTypes[ `Player Name` ] = cell;
        }
        else if ( STATUSES.includes(cell) ) {
            cellTypes[ `Current Status` ] = cell;
        }
        else if ( cell.trim() ) {
            cellTypes[ `Reason` ] = cell;
        }
    }
    return cellTypes;
}

/**
 * @param {string}  txt -   raw text output from PDF
 */
export function parsePivotTable ( txt ) {
    const [ emptyLine, headerRow, ...tableRows ] = getLines(txt);
    /**
     * @typedef Headers
     * @param {string[]} cells - array of strings representing the table cells.
     * @example [
     * "Game Number",
     * "Game Date",
     * "Game Time",
     * "Matchup",
     * "Team",
     * "Player Name",
     * "Current Status"
     * ]
     */
    // const headers = getCells(tableRows);
/*    const positions = headers.reduce(( map, h, i ) => {
        const startIndex = headerRow.indexOf(h);
        const nextIndex = headerRow.indexOf(headers[ i + 1]);
        map[ headers[ startIndex ] ] = [
            startIndex,
            nextIndex,
        ];
        return map;
    }, {});*/

    const matchups = [];

    let currentDate;
    let currentTime;
    let currentMatchup;
    let currentReason = ``;
    let homeTeam = false;

    for ( const line of tableRows ) {
        const cellData = getCellTypes(line);
        const dataCount = Object.keys(cellData).length;

        // Empty line
        if ( dataCount === 0 ) {
            const currentPlayers = currentMatchup?.teams[ Number(homeTeam) ].players;
            const lastPlayer = currentPlayers?.[ currentPlayers?.length - 1 ];
            if ( currentReason && lastPlayer ) {
                lastPlayer.reason += currentReason.trim();
                currentReason = ``;
            }
            continue;
        }

        if ( dataCount === 1 && cellData[ `Reason` ] ) {
            currentReason += cellData[ `Reason` ] + ` `;
            continue;
        }

        currentDate = cellData[`Game Date`] || currentDate;
        currentTime = cellData[`Game Time`] || currentTime;

        if ( cellData[`Matchup`] ) {
            // New Matchup, push old to end
            if ( currentMatchup ) {
                matchups.push(currentMatchup);
            }
            currentMatchup = makeMatchup(
                currentDate,
                currentTime,
                cellData[ `Matchup` ]
            );
        }

        if ( cellData[ `Team` ] ) {
            homeTeam = !cellData[ `Matchup` ];
        }

        const currentTeam = currentMatchup.teams[ Number(homeTeam) ];
        currentTeam.teamName = cellData[ `Team` ] || currentTeam.teamName;

        const player = makePlayer(
            cellData[`Player Name`] || ``,
            cellData[`Current Status`] || ``,
            cellData[`Reason`] || ``,
        );

        // Check if "not submitted" and skip to next team
        if ( player === null ) {
            homeTeam = !homeTeam;
            continue;
        }

        currentTeam.players.push(player);
    }

    return matchups;
}

/**
 * @param {string}  txt -   raw text output from PDF
 */
/*export function processPivotTable2 ( txt ) {
    const lines = getLines(txt);
    /!**
     * @typedef Headers
     * @param {string[]} cells - array of strings representing the table cells.
     * @example [
     * "Game Number",
     * "Game Date",
     * "Game Time",
     * "Matchup",
     * "Team",
     * "Player Name",
     * "Current Status"
     * ]
     *!/
    const headers = getCells(lines);

    // Headers done, start from main body now
    const body = lines.slice(1);

    const matchups = [];

    let currentDate;
    let currentTime;
    let currentMatchup;
    let awayTeam = true;

    for ( const line of body ) {
        const cells = getCells(line);

        if ( cells.length === 7 ) {
            // Main line of table, occurs once per "day" listed
            currentDate = cells[ 0 ];
            currentTime = cells[ 1 ];
            currentMatchup = makeMatchup(currentDate, currentTime, cells[ 2 ]);
            currentMatchup.away.teamName = cells[ 3 ];
            awayTeam = true;
            const firstPlayer = makePlayer(cells[ 4 ], cells[ 5 ], cells[ 6 ]);
            currentMatchup.away.players.push(firstPlayer);
        }

        // Check if "not submitted"
        if ( cells[ cells.length - 1 ] === `NOT YET SUBMITTED` ) {
            awayTeam = !awayTeam;
            continue;
        }

        switch ( cells.length ) {
            case 6: {

                break;
            }

            case 5:
                // Otherwise this is Team Name + First player same line
                break;
            case 4:
                // Otherwise this is Team Name + First player same line
                break;
            case 3:
                // Otherwise this is Team Name + First player same line
                break;
            case 2:
                // Otherwise this is Team Name + First player same line
                break;
        }
    }
}*/
