import React from "react";

function StatusGroup ( props ) {
    const {
        status,
        players = [],
    } = props;

    if (!players || players.length === 0) return null;

    let badgeColorClass = "bg-secondary";
    if (status === "Out") badgeColorClass = "bg-danger";
    else if (status === "Doubtful") badgeColorClass = "bg-warning text-dark";
    else if (status === "Questionable") badgeColorClass = "bg-info text-dark";
    else if (status === "Probable") badgeColorClass = "bg-success";

    return (
        <div className="mb-3">
            <div className="d-flex align-items-center mb-2">
                <span className={`badge rounded-pill ${badgeColorClass} me-2`} style={{fontSize: '0.8rem', fontWeight: 600}}>
                    {status}
                </span>
            </div>

            <div className="d-flex flex-column gap-2">
                {players.sort((a, b) => a.name > b.name).map(( { name, reason }, i ) => (
                    <div key={`${name}-${i}`} className="d-flex align-items-center justify-content-between p-2 rounded" style={{backgroundColor: 'rgba(255,255,255,0.05)'}}>
                        <span className="font-weight-bold" style={{color: '#ececec'}}>{name}</span>
                        <span className="text-white-50 text-end" style={{fontSize: '0.85rem', maxWidth: '50%'}}>{reason}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default StatusGroup;
