import React, { Component } from "react";
import StatusGroup          from "./StatusGroup.jsx";

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
        <div className={`col`}>
            <div className="col">
            <h3>{props.teamName}</h3>
                <StatusGroup
                    key={`Out`}
                    players={grouped.Out}
                    status={`Out`} />
                <StatusGroup
                    key={`Doubtful`}
                    players={grouped.Doubtful}
                    status={`Doubtful`} />
                <StatusGroup
                    key={`Questionable`}
                    players={grouped.Questionable}
                    status={`Questionable`} />
                <StatusGroup
                    key={`Probable`}
                    players={grouped.Probable}
                    status={`Probable`} />
                <StatusGroup
                    key={`Available`}
                    players={grouped.Available}
                    status={`Available`} />
            </div>
        </div>
    );
}

export default Team;
