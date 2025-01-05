function getEquivalentTimesInTimezone(timezone = undefined) {
    // Create a Date object for 12 AM EST
    const dateAt12AM = new Date();
    dateAt12AM.setUTCHours(5, 0, 0, 0); // 12 AM EST is UTC-5

    // Create a Date object for 1 AM EST
    const dateAt1AM = new Date();
    dateAt1AM.setUTCHours(6, 0, 0, 0); // 1 AM EST is UTC-5

    // Format the times to the specified timezone or user's local timezone
    const options = { hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
    if (timezone) {
        options.timeZone = timezone;
    }

    const equivalentTo12AMEST = dateAt12AM.toLocaleString(undefined, options);
    const equivalentTo1AMEST = dateAt1AM.toLocaleString(undefined, options);

    return {
        equivalentTo12AMEST,
        equivalentTo1AMEST
    };
}

// Function to format the time as "12 am TZ"
function formatTime(localeString) {
    const [time, tz] = localeString.split(' ');
    const formattedTime = time.toLowerCase().replace(':00', ''); // Remove ":00" for cleaner output
    return `${formattedTime} ${tz}`;
}

const userLocalTimes = getEquivalentTimesInTimezone();

const timezone_element = document.getElementById("timezone_conversion")

timezone_element.innerHTML = timezone_element.innerHTML.replace("TIME_1", formatTime(userLocalTimes.equivalentTo12AMEST));

timezone_element.innerHTML = timezone_element.innerHTML.replace("TIME_2", formatTime(userLocalTimes.equivalentTo1AMEST));

/*
// Example usage:
const equivalentTimes = getEquivalentTimesInTimezone('Europe/London'); // Pass a timezone like 'Europe/London'
console.log('12 AM EST in the specified timezone:', equivalentTimes.equivalentTo12AMEST);
console.log('1 AM EST in the specified timezone:', equivalentTimes.equivalentTo1AMEST);

// For the user's local timezone
const userLocalTimes = getEquivalentTimesInTimezone();
console.log('12 AM EST in your local timezone:', userLocalTimes.equivalentTo12AMEST);
console.log('1 AM EST in your local timezone:', userLocalTimes.equivalentTo1AMEST);
 */
