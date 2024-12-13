export const weatherCodeImages = {
    0: "./img/sunny.png", // Clear sky
    1: "./img/sunandcloud.png", // Mainly clear
    2: "./img/sunandcloud.png", // Partly cloudy
    3: "./img/cloud.png", // Overcast
    45: "./img/cloud.png", // Fog
    48: "./img/cloud.png", // Depositing rime fog
    51: "./img/rain.png", // Light drizzle
    53: "./img/rain.png", // Moderate drizzle
    55: "./img/rain.png", // Dense drizzle
    61: "./img/rain.png", // Slight rain
    63: "./img/rain.png", // Moderate rain
    65: "./img/rain.png", // Heavy rain
    71: "./img/snow.png", // Slight snowfall
    73: "./img/snow.png", // Moderate snowfall
    75: "./img/snow.png", // Heavy snowfall
    80: "./img/rain.png", // Rain showers
    81: "./img/rain.png", // Moderate rain showers
    82: "./img/rain.png", // Violent rain showers
    85: "./img/snow.png", // Slight snow showers
    86: "./img/snow.png", // Heavy snow showers
    95: "./img/thunder.png", // Thunderstorm
    96: "./img/thunder.png", // Thunderstorm with slight hail
    99: "./img/thunder.png", // Severe thunderstorm with hail
    default: "./img/cloud.png" // Default for unknown codes
};

/**
 * Get image URL for a specific weather code
 * @param {number} code - Weather code from API
 * @returns {string} - Corresponding image URL
 */
export function getWeatherImage(code) {
    return weatherCodeImages[code] || weatherCodeImages.default;
}
