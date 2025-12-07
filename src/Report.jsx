import React, { Component } from "react";
import Team                 from "./Team.jsx";
import { formatMatchupDate } from "./util.js";

function MatchupHeader ( props ) {
    const {
        matchup,
        date,
        time,
    } = props;

    const splitMatchup = matchup.split(`@`);
    const matchupFormatted = (
        <span>
            <span className={splitMatchup[ 0 ]}>
                {splitMatchup[ 0 ]}
            </span> @ <span className={splitMatchup[ 1 ]}>
                {splitMatchup[ 1 ]}
            </span>
        </span>
    );

    const dateFormatted = formatMatchupDate(date);

    return (
        <h2 className="col-12 col-lg-3 mb-3">
            <code>
                {matchupFormatted} <br/>
                <small>
                    <span title={date}>
                        {dateFormatted}
                    </span> <br />
                    {time}
                </small>
            </code>
        </h2>
    );
}

function Report ( props ) {
    if ( !props.matchups || props.matchups.length === 0 ) {
        return (
            <div>
                <h2>No Matchups Found</h2>
                <p>
                    Refresh the report or try again later.
                </p>
            </div>
        );
    }

    return (
        <div>
            {props.matchups.map(( { matchup, date, time, teams }, i ) =>
                <div
                    className="row mb-4"
                    key={`${matchup}-${i}`}>
                    <MatchupHeader
                        matchup={matchup}
                        date={date}
                        time={time} />

                    {teams[ 0 ].players.length !== 0 || teams[ 1 ].players.length !== 0
                        ? <>
                            <Team
                                key={`team-key-${teams[ 0 ].teamName}`}
                                teamAbbr={teams[ 0 ].team}
                                teamName={teams[ 0 ].teamName}
                                players={teams[ 0 ].players} />

                            <Team
                                key={`team-key-${teams[ 1 ].teamName}`}
                                teamAbbr={teams[ 1 ].team}
                                teamName={teams[ 1 ].teamName}
                                players={teams[ 1 ].players} />
                        </>
                        : <div className="col-12 col-lg-9 d-flex align-items-center justify-content-center">
                            <em>No injured players reported for this matchup.</em>
                        </div>
                    }

                    <hr className="d-lg-none"/>
                </div>
            )}
        </div>
    );
}

export default Report;
