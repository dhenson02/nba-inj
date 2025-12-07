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
        <div className="container-xxl py-5">
            <header className="d-flex flex-column align-items-center mb-5 text-center">
                <h1 className="display-4 fw-bold mb-3 tracking-tight">
                    NBA Injury Report
                </h1>
                <div className="d-flex flex-column flex-md-row align-items-center gap-3">
                    <button
                        className="px-4 py-2 rounded-pill fw-bold border-0 shadow-sm hover-scale transition-all"
                        style={{
                            background: 'linear-gradient(90deg, #ec4899 0%, #8b5cf6 100%)',
                            color: 'white'
                        }}
                        type="button"
                        onClick={() => setReport(null)}>
                        Refresh Report
                    </button>
                    <span className="text-muted-custom small">
                        Last updated: {lastUpdated || "N/A"}
                    </span>
                </div>
            </header>
            <Report matchups={report} />
        </div>
    )
}

export default App
