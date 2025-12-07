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
    const dateFormatted = formatMatchupDate(date);

    return (
        <div className="col-12 col-lg-3 mb-4 mb-lg-0">
            <div className="d-flex flex-column align-items-start p-3 rounded-3" style={{backgroundColor: '#1e1e1e', borderLeft: '4px solid #444'}}>
                 <div className="d-flex align-items-center mb-2 w-100">
                    <span className={`h3 mb-0 me-2 ${splitMatchup[0]}`} style={{fontWeight: 800, color: 'var(--team-text)'}}>
                        {splitMatchup[0]}
                    </span>
                    <span className="text-muted mx-2">@</span>
                    <span className={`h3 mb-0 ${splitMatchup[1]}`} style={{fontWeight: 800, color: 'var(--team-text)'}}>
                        {splitMatchup[1]}
                    </span>
                 </div>
                 <div className="text-white-50 small">
                    <span title={date} className="d-block text-uppercase" style={{letterSpacing: '1px'}}>{dateFormatted}</span>
                    <span className="d-block">{time}</span>
                 </div>
            </div>
        </div>
    );
}

function Report ( props ) {
    if ( !props.matchups || props.matchups.length === 0 ) {
        return (
            <div className="text-center py-5">
                <h2 className="text-muted">No Matchups Found</h2>
                <p className="text-white-50">
                    Refresh the report or try again later.
                </p>
            </div>
        );
    }

    return (
        <div>
            {props.matchups.map(( { matchup, date, time, teams }, i ) =>
                <div
                    className="row mb-5 pb-4 border-bottom border-secondary"
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
                        : <div className="col-12 col-lg-9 d-flex align-items-center justify-content-center text-white-50">
                            <em>No injured players reported for this matchup.</em>
                        </div>
                    }
                </div>
            )}
        </div>
    );
}

export default Report;
