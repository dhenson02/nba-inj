import React, { Component } from "react";
import Team                 from "./Team.jsx";

function Report ( props ) {
    return (
        <div>
            {props.matchups.map(( { matchup, date, time, teams }, i ) =>
                <div
                    className="card"
                    key={`${matchup}-${i}`}>
                    <code>{matchup}</code>

                    <p>Away Team:</p>
                    <Team
                        teamName={teams[ 0 ].teamName}
                        players={teams[ 0 ].players} />

                    <p>Home Team:</p>
                    <Team
                        teamName={teams[ 1 ].teamName}
                        players={teams[ 1 ].players} />
                </div>
            )}
        </div>
    );
}

export default Report;
