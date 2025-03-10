import React, { Component } from "react";
import Team                 from "./Team.jsx";

function Report ( props ) {
    return (
        <div>
            {props.matchups.map(( { matchup, date, time, teams }, i ) =>
                <div
                    className="row"
                    key={`${matchup}-${i}`}>
                    <code>{matchup}</code>

                    <Team
                        teamName={teams[ 0 ].teamName}
                        players={teams[ 0 ].players} />

                    <Team
                        teamName={teams[ 1 ].teamName}
                        players={teams[ 1 ].players} />
                </div>
            )}
        </div>
    );
}

export default Report;
