/**
 * Render detailed weather information
 * @param {Object} details - The detailed weather data.
 * @param {number} details.precipitation - The precipitation amount (mm).
 * @param {number} details.humidity - The humidity percentage (%).
 * @param {string} details.sunrise - The sunrise time (ISO 8601 format).
 * @param {string} details.sunset - The sunset time (ISO 8601 format).
 * @param {HTMLElement} targetElement - The DOM element where the details will be rendered.
 */
export function renderDetailedInfo(details, targetElement) {
    if (!details || !targetElement) {
        console.error("Invalid arguments passed to renderDetailedInfo.");
        return;
    }

    const { precipitation = 0, humidity = 0, sunrise = "", sunset = "" } = details;

    const formattedSunrise = sunrise
        ? new Date(sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : "N/A";
    const formattedSunset = sunset
        ? new Date(sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : "N/A";

    targetElement.innerHTML = `
        <h3>Today's Weather</h3>
        <div>
            <h4>Precipitation</h4>
            <p>${precipitation} mm</p>
        </div>
        <div>
            <h4>Humidity</h4>
            <p>${humidity} %</p>
        </div>
        <div>
            <h4>Sunrise</h4>
            <p>${formattedSunrise}</p>
        </div>
        <div>
            <h4>Sunset</h4>
            <p>${formattedSunset}</p>
        </div>
    `;
}
