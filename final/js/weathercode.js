export function getWeatherImage(weatherCode) {
    switch (weatherCode) {
        case 0:
            return "img/sun.png"; // Clear sky
        case 1:
        case 2:
        case 3:
            return "img/sunandcloud.png"; // Partly cloudy
        case 45:
        case 48:
            return "img/cloud.png"; // Fog
        case 61:
        case 63:
        case 65:
            return "img/rain.png"; // Rain
        case 71:
        case 73:
        case 75:
        case 77:
        case 85:
        case 86:
            return "img/snow.png"; // Snow
        case 95:
        case 96:
        case 99:
            return "img/thunder.png"; // Thunderstorm
        default:
            return "img/cloud.png"; // Default
    }
}
