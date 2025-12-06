import React, { useState } from "react";
import StatusGroup          from "./StatusGroup.jsx";

function Team ( props ) {
    const [ showOthers, setShowOthers ] = useState(false);

    if ( !props.players || props.players.length === 0 ) {
        return (
            <div className={`col-12 col-lg mb-3`}>
                <div className="card h-100">
                    <div className="card-body">
                        <h3 className="card-title">{props.teamName}</h3>
                        <div className="col-12 col-lg-9 d-flex align-items-center justify-content-center">
                            <em>No injured players reported for this team.</em>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const grouped = props.players.reduce(( groups, player ) => {
        const group = groups[ player.status ] || [];
        groups[ player.status ] = [ ...group, player ];
        return groups;
    }, {});

    const hasOthers = (grouped.Doubtful && grouped.Doubtful.length > 0) ||
                      (grouped.Questionable && grouped.Questionable.length > 0) ||
                      (grouped.Probable && grouped.Probable.length > 0);

    return (
        <div className={`col-12 col-lg mb-3`}>
            <div className="card h-100">
                <div className="card-body">
                    <h3 className="card-title">{props.teamName}</h3>
                    <StatusGroup
                        key={`Out`}
                        players={grouped.Out}
                        status={`Out`} />

                    {showOthers && (
                        <>
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
                        </>
                    )}

                    {hasOthers && (
                        <button
                            className="btn btn-sm btn-outline-secondary mt-3 w-100"
                            onClick={() => setShowOthers(!showOthers)}>
                            {showOthers ? "Hide Others" : "Show Others"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Team;
