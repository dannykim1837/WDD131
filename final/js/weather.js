import { getWeatherImage } from './weathercode.js';
import { renderDetailedInfo } from './renderDetailedInfo.js';

const GEOCODING_API_URL = "https://api.opencagedata.com/geocode/v1/json";
const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";
const GEOCODING_API_KEY = "1298fa4155a34f8f8cce4c6018df122f";

// Fetch JSON data utility function
async function fetchJSON(url, params = {}) {
    const query = new URLSearchParams(params).toString();
    const fullUrl = `${url}?${query}`;
    console.log(`Fetching URL: ${fullUrl}`);

    const response = await fetch(fullUrl);
    if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP Error ${response.status}: ${errorText}`);
        throw new Error(`HTTP Error ${response.status}`);
    }
    return await response.json();
}

// Render today's weather
function renderTodayWeather(todayData) {
    if (!todayData) {
        console.error("No data for today's weather.");
        return;
    }

    const { date, maxTemp, minTemp, weather_code } = todayData;
    const imageUrl = getWeatherImage(weather_code);

    const todayWeatherDiv = document.getElementById("todayWeather");
    todayWeatherDiv.innerHTML = `
        <div class="weather-card-large">
            <h3>Today - ${date}</h3>
            <img src="${imageUrl}" alt="Weather Icon">
            <p>Max: ${maxTemp} °F</p>
            <p>Min: ${minTemp} °F</p>
        </div>
    `;
}

// Render weekly weather
function renderWeeklyWeather(weeklyData) {
    if (!weeklyData || weeklyData.length === 0) {
        console.error("No data for weekly weather.");
        return;
    }

    const weeklyHTML = weeklyData.map(({ date, maxTemp, minTemp, weather_code }) => {
        const imageUrl = getWeatherImage(weather_code);
        return `
            <div class="weather-card">
                <h3>${date}</h3>
                <img src="${imageUrl}" alt="Weather Icon">
                <p>Max: ${maxTemp} °F</p>
                <p>Min: ${minTemp} °F</p>
            </div>
        `;
    }).join('');

    const weeklyWeatherDiv = document.getElementById("weeklyWeather");
    weeklyWeatherDiv.innerHTML = weeklyHTML;
}

// Render empty cards for default view
function renderEmptyCards() {
    const weeklyWeatherDiv = document.getElementById("weeklyWeather");
    const todayWeatherDiv = document.getElementById("todayWeather");

    // Empty card for today's weather
    todayWeatherDiv.innerHTML = `
        <div class="weather-card-large">
            <h3>Today's Weather</h3>
            <img src="img/placeholder.png" alt="No Data">
            <p>Max: -- °F</p>
            <p>Min: -- °F</p>
        </div>
    `;

    // Empty cards for weekly forecast
    let emptyCardsHTML = '';
    for (let i = 0; i < 8; i++) { // Render 8 empty cards
        emptyCardsHTML += `
            <div class="weather-card">
                <h3>--</h3>
                <img src="img/placeholder.png" alt="No Data">
                <p>Max: -- °F</p>
                <p>Min: -- °F</p>
            </div>
        `;
    }

    weeklyWeatherDiv.innerHTML = emptyCardsHTML;
}

// Handle the search functionality
function setupSearchBar() {
    const cityInput = document.getElementById("cityInput");
    const searchButton = document.getElementById("searchButton");

    if (searchButton) {
        searchButton.addEventListener("click", () => {
            const city = cityInput.value.trim();
            if (!city) {
                alert("Please enter a city name!");
                return;
            }
            window.location.href = `weather.html?city=${encodeURIComponent(city)}`;
        });
    }
}

// Main function for the weather page
async function main() {
    const urlParams = new URLSearchParams(window.location.search);
    const city = urlParams.get("city");

    if (!city) {
        console.log("No city specified. Rendering empty cards.");
        renderEmptyCards();
        return;
    }

    console.log(`Fetching data for city: ${city}`);

    try {
        const geoData = await fetchJSON(GEOCODING_API_URL, {
            q: city,
            key: GEOCODING_API_KEY,
            limit: 1
        });

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("Location not found.");
        }

        const { lat, lng } = geoData.results[0].geometry;
        console.log(`Coordinates for ${city}: Latitude ${lat}, Longitude ${lng}`);

        const today = new Date();
        const startDate = today.toISOString().split('T')[0]; // Today's date
        const endDate = new Date(today.setDate(today.getDate() + 8)) // 9 days from today
            .toISOString()
            .split('T')[0];

        const weatherData = await fetchJSON(WEATHER_API_URL, {
            latitude: lat,
            longitude: lng,
            daily: "temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum,sunrise,sunset",
            temperature_unit: "fahrenheit",
            timezone: "auto",
            start_date: startDate,
            end_date: endDate
        });

        const dailyWeather = weatherData.daily.time.map((date, index) => ({
            date,
            maxTemp: weatherData.daily.temperature_2m_max[index],
            minTemp: weatherData.daily.temperature_2m_min[index],
            weather_code: weatherData.daily.weather_code[index],
            precipitation: weatherData.daily.precipitation_sum[index] || 0,
            sunrise: weatherData.daily.sunrise[index],
            sunset: weatherData.daily.sunset[index]
        }));

        const todayWeather = dailyWeather[0];
        const weeklyWeather = dailyWeather.slice(1, 9);

        renderTodayWeather(todayWeather);
        renderWeeklyWeather(weeklyWeather);
        renderDetailedInfo(todayWeather, document.getElementById("detailedInfo"));
    } catch (error) {
        console.error("Error during data fetching or rendering:", error.message);
        alert(`Error: ${error.message}`);
    }
}

// Initialize search bar
setupSearchBar();

// Run main function on load
main();
