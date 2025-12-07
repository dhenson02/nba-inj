"use strict";

import React, { useState } from "react";
import Report    from "./Report.jsx";
import "./App.css"

function App () {
    // Get report from API
    const [ report, setReport ] = useState(null);
    const [ lastUpdated, setLastUpdated ] = useState(null);

    React.useEffect(() => {
        if ( report ) {
            return;
        }
        fetch('/api/injury-report')
            .then(res => res.json())
            .then(data => {
                setReport(data.matchups);
                setLastUpdated(`${data.lastReportDateTime.date} ${data.lastReportDateTime.time}`);
            })
            .catch(err => console.error('Error fetching injury report:', err));
    }, [ report, setReport ]);

    return (
        <div className="container-xxl">
            <header className={`d-flex flex-column my-4`}>
                <h1>
                    NBA Injury Report
                </h1>
                <button
                    className={`px-4 py-2 rounded-lg bg-fuchsia-400 text-white my-2`}
                    type={`button`}
                    onClick={() => setReport(null)}>
                    Refresh Report
                </button>
                <small>
                    Last updated: {lastUpdated || "N/A"}
                </small>
            </header>
            <Report matchups={report} />
        </div>
    )
}

export default App
