import React from "react";

function StatusGroup ( props ) {
    const {
        status,
        players = [],
    } = props;

    if ( !players || players.length === 0 ) {
        return null;
    }

    return (
        <div className="mb-2">
            <table className="table table-striped table-sm">
                <thead>
                    <tr>
                        <th className="table-light">{status}</th>
                    </tr>
                </thead>
                <tbody>
                    {players.sort((a, b) => {
                        return a.name > b.name;
                    }).map(( {
                           name,
                           reason,
                       }, i ) =>
                    <tr key={`${name}-${i}`}>
                        <td className="col" title={reason}>
                            {name}
                            <p style={{
                                fontSize: "70%"
                            }}>{reason}</p>
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    )
}

export default StatusGroup;
