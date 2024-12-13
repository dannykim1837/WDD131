import { getWeatherImage } from './weathercode.js';

const GEOCODING_API_URL = "https://api.opencagedata.com/geocode/v1/json";
const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";
const GEOCODING_API_KEY = "1298fa4155a34f8f8cce4c6018df122f"; // Your OpenCage API key

// Get DOM elements
const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");
const resultDiv = document.getElementById("result");

// Search button click event
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

// Utility function to fetch JSON data
async function fetchJSON(url, params = {}) {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${url}?${query}`);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    return await response.json();
}

// Weather data processing function
function processWeatherData(weatherData) {
    const daily = weatherData.daily;
    const dates = daily.time;
    const maxTemps = daily.temperature_2m_max;
    const minTemps = daily.temperature_2m_min;
    const weatherCodes = daily.weather_code;

    let gridHTML = `
        <div class="weather-grid">
    `;

    for (let i = 0; i < 7; i++) { // Loop through 7 days
        const imageUrl = getWeatherImage(weatherCodes[i]); // Get image URL based on weather code
        gridHTML += `
            <div class="weather-card">
                <h3>${dates[i]}</h3>
                <p>Max: ${maxTemps[i]} °F</p>
                <p>Min: ${minTemps[i]} °F</p>
                <img src="${imageUrl}" alt="Weather Icon">
            </div>
        `;
    }

    gridHTML += `</div>`;
    document.getElementById('result').innerHTML = gridHTML; // Display the HTML in the result container
}

// Main logic to handle weather fetching and rendering
async function main() {
    const urlParams = new URLSearchParams(window.location.search);
    const city = urlParams.get("city");

    if (!city) {
        document.getElementById('result').innerHTML = "<p style='color: red;'>City not specified!</p>";
        return;
    }

    document.getElementById('result').innerHTML = `<p>Fetching weather for <strong>${city}</strong>...</p>`;

    try {
        // Get coordinates for the city
        const geoData = await fetchJSON(GEOCODING_API_URL, {
            q: city,
            key: GEOCODING_API_KEY,
            limit: 1
        });

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("Location not found");
        }

        const { lat, lng } = geoData.results[0].geometry;

        // Fetch weather data
        const weatherData = await fetchJSON(WEATHER_API_URL, {
            latitude: lat,
            longitude: lng,
            daily: "temperature_2m_max,temperature_2m_min,weather_code",
            temperature_unit: "fahrenheit",
            timezone: "auto"
        });

        // Process and display weather data
        processWeatherData(weatherData);
    } catch (error) {
        document.getElementById('result').innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    }
}

// Run the main function when the script is loaded
main();