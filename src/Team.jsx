import React, { useState } from "react";
import StatusGroup          from "./StatusGroup.jsx";

function Team ( props ) {
    const [ showOthers, setShowOthers ] = useState(false);

    // Decorative corner
    const decorativeCorner = (
        <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            borderStyle: 'solid',
            borderWidth: '0 50px 50px 0',
            borderColor: 'transparent var(--team-primary) transparent transparent',
            opacity: 0.2
        }} />
    );

    // Dynamic container class
    const containerClass = `team-card ${props.teamAbbr}`;

    if ( !props.players || props.players.length === 0 ) {
        return (
            <div className={`col-12 col-lg mb-3`}>
                <div className={containerClass}>
                    {decorativeCorner}
                    <h3 className="h4 font-weight-bold mb-4" style={{color: 'var(--team-text)', letterSpacing: '0.5px'}}>{props.teamName}</h3>
                    <div className="d-flex align-items-center justify-content-start text-muted-custom">
                        <em>No injured players reported.</em>
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

    const hasOthers = (grouped.Questionable && grouped.Questionable.length > 0) ||
                      (grouped.Probable && grouped.Probable.length > 0);

    return (
        <div className={`col-12 col-lg mb-3`}>
            <div className={containerClass}>
                {decorativeCorner}
                <h3 className="h4 font-weight-bold mb-4" style={{color: 'var(--team-text)', letterSpacing: '0.5px'}}>{props.teamName}</h3>

                <StatusGroup
                    key={`Out`}
                    players={grouped.Out}
                    status={`Out`} />
                <StatusGroup
                    key={`Doubtful`}
                    players={grouped.Doubtful}
                    status={`Doubtful`} />

                {showOthers && (
                    <div className="mt-3 pt-3 border-top" style={{borderColor: 'var(--border-color)'}}>
                        <StatusGroup
                            key={`Questionable`}
                            players={grouped.Questionable}
                            status={`Questionable`} />
                        <StatusGroup
                            key={`Probable`}
                            players={grouped.Probable}
                            status={`Probable`} />
                    </div>
                )}

                {hasOthers && (
                    <button
                        className="btn btn-sm mt-3 w-100"
                        style={{
                            color: 'var(--team-text)',
                            borderColor: 'var(--team-primary)',
                            backgroundColor: 'transparent'
                        }}
                        onClick={() => setShowOthers(!showOthers)}>
                        {showOthers ? "Hide Others" : "Show Others"}
                    </button>
                )}
            </div>
        </div>
    );
}

export default Team;
