"use strict";

export function formatMatchupDate(dateString) {
    const today = new Date();
    const date = new Date(dateString);
    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    }
    if (date.toDateString() === new Date(today.getTime() + 86400000).toDateString()) {
        return 'Tomorrow';
    }
    const options = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}
