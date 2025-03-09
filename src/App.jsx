import { useState } from "react"

import Report    from "./Report.jsx";
import reactLogo from "./assets/react.svg"
import viteLogo     from "/vite.svg"
import "./App.css"
import moment from "moment-timezone";
import report from "../output.json";

function App () {
    return (
        <>
            <h1>NBA Injury Report</h1>
            <Report matchups={report} />

            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </>
    )
}

export default App
