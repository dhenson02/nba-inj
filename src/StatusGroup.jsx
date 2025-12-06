import React from "react";

function StatusGroup ( props ) {
    const {
        status,
        players = [],
    } = props;

    return (
        <div className="col">
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>{status}</th>
                    </tr>
                </thead>
                <tbody>
                    {players.sort((a, b) => {
                        return a.name > b.name;
                    }).map(( {
                           name,
                           status,
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
