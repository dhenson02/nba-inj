import React, { Component } from "react";

function Team ( props ) {
    const sortedPlayers = props.players.sort(( a, b ) => {
        if ( a.status > b.status ) {
            return -1;
        }
        if ( a.status < b.status ) {
            return 1;
        }
        return 0;
    });
    return (
        <div>
            <h2>{props.teamName}</h2>
            {sortedPlayers.map(( { name, status, reason }, i ) =>
                <div key={`${name}-${i}`}>
                    <strong>{status}</strong> {name}
                    <pre>

                        {reason}
                    </pre>

                </div>
            )}
        </div>
    );
}

export default Team;
