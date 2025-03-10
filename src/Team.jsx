import React, { Component } from "react";

function Team ( props ) {
    const grouped = props.players.reduce(( groups, player ) => {
        const group = groups[ player.status ] || [];
        groups[ player.status ] = [ ...group, player ];
        return groups;
    }, {});
    // const sortedPlayers = props.players.sort(( a, b ) => {
    //     if ( a.status > b.status ) {
    //         return -1;
    //     }
    //     if ( a.status < b.status ) {
    //         return 1;
    //     }
    //     return 0;
    // });
    return (
        <div className={`row`}>
            <h2>{props.teamName}</h2>
            {Object.keys(grouped).map((status, i) =>
                <div className="col" key={`${status}`}>
                    <div className="row">
                        <strong>{status}</strong>
                    </div>
                    <div className="row">
                        {grouped[ status ].sort((a, b) => {
                            return a.name > b.name;
                        }).map(( {
                               name,
                               status,
                               reason,
                           }, i ) =>
                        <div className="row" key={`${name}-${i}`}>
                            <div className="col">
                                {name}
                            </div>
                            <div className="col">
                                <code>{reason}</code>
                            </div>

                        </div>
                    )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Team;
