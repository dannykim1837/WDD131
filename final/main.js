const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");

if (searchButton) {
    searchButton.addEventListener("click", () => {
        const city = cityInput.value.trim();
        if (!city) {
            alert("Please enter a city name!");
            return;
        }
        // Redirect to weather.html with city as a query parameter
        window.location.href = `weather.html?city=${encodeURIComponent(city)}`;
    });
}
// Cities with their coordinates
const cities = {
    "New York": { latitude: 40.7128, longitude: -74.0060, tempId: "ny-temp", windId: "ny-wind", condId: "ny-condition" },
    "London": { latitude: 51.5074, longitude: -0.1278, tempId: "ld-temp", windId: "ld-wind", condId: "ld-condition" },
    "Seoul": { latitude: 37.5665, longitude: 126.9780, tempId: "sl-temp", windId: "sl-wind", condId: "sl-condition" },
    "Sydney": { latitude: -33.8688, longitude: 151.2093, tempId: "sy-temp", windId: "sy-wind", condId: "sy-condition" },
    "Berlin": { latitude: 52.5200, longitude: 13.4050, tempId: "bl-temp", windId: "bl-wind", condId: "bl-condition" }
};

// Open-Meteo API endpoint and parameters
const API_URL = "https://api.open-meteo.com/v1/forecast";
const API_PARAMS = {
    current_weather: true,
    temperature_unit: "fahrenheit",
    timezone: "auto"
};

// Function to fetch weather data for a single city
async function fetchWeatherData(city, latitude, longitude, tempId, windId, condId) {
    const url = new URL(API_URL);
    url.search = new URLSearchParams({ ...API_PARAMS, latitude, longitude });

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch data for ${city}`);

        const data = await response.json();
        const currentWeather = data.current_weather;

        // Update HTML elements with fetched weather data
        document.getElementById(tempId).textContent = currentWeather.temperature;
        document.getElementById(windId).textContent = currentWeather.windspeed;
        document.getElementById(condId).textContent = mapWeatherCode(currentWeather.weathercode);
    } catch (error) {
        console.error(`Error fetching weather for ${city}:`, error);
        document.getElementById(tempId).textContent = "Error";
        document.getElementById(windId).textContent = "Error";
        document.getElementById(condId).textContent = "Error";
    }
}

// Function to map weather codes to readable conditions
function mapWeatherCode(code) {
    const weatherConditions = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Foggy",
        48: "Depositing rime fog",
        51: "Drizzle: Light",
        53: "Drizzle: Moderate",
        55: "Drizzle: Dense",
        61: "Rain: Light",
        63: "Rain: Moderate",
        65: "Rain: Heavy",
        80: "Showers: Light",
        81: "Showers: Moderate",
        82: "Showers: Violent",
        95: "Thunderstorm: Light",
        96: "Thunderstorm: Moderate",
        99: "Thunderstorm: Heavy hail"
    };
    return weatherConditions[code] || "Unknown";
}

// Fetch weather data for all cities
function updateWeatherForCities() {
    for (const [city, { latitude, longitude, tempId, windId, condId }] of Object.entries(cities)) {
        fetchWeatherData(city, latitude, longitude, tempId, windId, condId);
    }
}

// Update weather data on page load
document.addEventListener("DOMContentLoaded", updateWeatherForCities);

