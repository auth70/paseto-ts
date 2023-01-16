/**
 * Parses a string time in the style of "5m" "5 min" or "5 minutes" into a Date object.
 * @param {string} time The time to parse.
 * @returns {Date} The parsed time.
 */
export function parseTimeString(time: string): Date {

    // Split the time into a number and a unit
    // Find the unit and convert the number into milliseconds
    const timeParts = time.split(" ");

    if (timeParts.length !== 2) {
        // Assume it's in format of "1d" or "10min"
        // Find the unit and convert the number into milliseconds
        const timeUnit = timeParts[0].replace(/\d/g, "");
        const timeAmount = parseInt(timeParts[0].replace(/\D/g, ""), 10);
        timeParts[0] = timeAmount.toString();
        timeParts[1] = timeUnit;
    }

    const timeAmount = parseInt(timeParts[0], 10);
    const timeUnit = timeParts[1];

    // Convert the time into a number of milliseconds
    let timeMilliseconds = 0;
    switch (timeUnit) {
        case "s":
        case "sec":
        case "secs":
        case "second":
        case "seconds":
            timeMilliseconds = timeAmount * 1000;
            break;
        case "m":
        case "min":
        case "mins":
        case "minute":
        case "minutes":
            timeMilliseconds = timeAmount * 1000 * 60;
            break;
        case "h":
        case "hr":
        case "hrs":
        case "hour":
        case "hours":
            timeMilliseconds = timeAmount * 1000 * 60 * 60;
            break;
        case "d":
        case "day":
        case "days":
            timeMilliseconds = timeAmount * 1000 * 60 * 60 * 24;
            break;
        case "w":
        case "wk":
        case "wks":
        case "week":
        case "weeks":
            timeMilliseconds = timeAmount * 1000 * 60 * 60 * 24 * 7;
            break;
        case "mo":
        case "mos":
        case "month":
        case "months":
            timeMilliseconds = timeAmount * 1000 * 60 * 60 * 24 * 30;
            break;
        case "y":
        case "yr":
        case "yrs":
        case "year":
        case "years":
            timeMilliseconds = timeAmount * 1000 * 60 * 60 * 24 * 365;
            break;
        default:
            throw new TypeError("Invalid time string");
    }

    return new Date(Date.now() + timeMilliseconds);
    
}

/**
 * Parses a time into a Date object.
 * @param {string | number | Date} time The time to parse.
 * @returns {Date} The parsed time.
 */
export function parseTime(time: string | number | Date): Date {
    if (typeof time === "string") {
        // If the time is a string, we need to parse it
        const parsedDate = Date.parse(time);
        if (isNaN(parsedDate)) {
            try {
                return parseTimeString(time);
            } catch (e) {
                throw new TypeError("Invalid date string");
            }
        }
        return new Date(time);
    } else if (typeof time === "number" && !isNaN(time) && isFinite(time)) {
        return new Date(time);
    } else if (time instanceof Date) {
        return time;
    } else {
        throw new TypeError("Time must be a string, number, or Date");
    }
}