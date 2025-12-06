import React, { Component } from "react";
import Team                 from "./Team.jsx";

function Report ( props ) {
    return (
        <div>
            {props.matchups.map(( { matchup, date, time, teams }, i ) =>
                <div
                    className="row"
                    key={`${matchup}-${i}`}>
                    <h2 className="col col-3">
                        <code>
                            {matchup} <br/>
                            <small>{date} - {time}</small>
                        </code>
                    </h2>

                    <Team
                        teamName={teams[ 0 ].teamName}
                        players={teams[ 0 ].players} />

                    <Team
                        teamName={teams[ 1 ].teamName}
                        players={teams[ 1 ].players} />

                    <hr/>
                </div>
            )}
        </div>
    );
}

export default Report;
