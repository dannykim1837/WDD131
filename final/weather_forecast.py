import openmeteo_requests
import requests_cache
import pandas as pd
from retry_requests import retry

# Setup the Open-Meteo API client with cache and retry
cache_session = requests_cache.CachedSession('.cache', expire_after=3600)
retry_session = retry(cache_session, retries=5, backoff_factor=0.2)
openmeteo = openmeteo_requests.Client(session=retry_session)

# API endpoint and parameters
url = "https://api.open-meteo.com/v1/forecast"
params = {
    "latitude": 43.826,
    "longitude": -111.7897,
    "current_weather": True,
    "hourly": ["temperature_2m", "precipitation", "weather_code", "visibility", "wind_speed_10m", "uv_index", "is_day"],
    "daily": ["weather_code", "temperature_2m_max", "temperature_2m_min", "sunrise", "sunset", "precipitation_sum"],
    "temperature_unit": "fahrenheit",
    "timezone": "auto"
}

# Fetch and validate response
responses = openmeteo.weather_api(url, params=params)
if not responses:
    raise ValueError("No response from Open-Meteo API.")
response = responses[0]

# Metadata
print(f"Coordinates: {response.Latitude()}°N, {response.Longitude()}°E")
print(f"Elevation: {response.Elevation()} m")
print(f"Timezone: {response.Timezone()} {response.TimezoneAbbreviation()}")

# Current weather
if params.get("current_weather"):
    current = response.Current()
    print(f"Current Time: {current.Time()}")
    print(f"Temperature: {current.Variables(0).Value()} °F")

# Process hourly data
hourly = response.Hourly()
hourly_data = pd.DataFrame({
    "date": pd.date_range(
        start=pd.to_datetime(hourly.Time(), unit="s", utc=True),
        end=pd.to_datetime(hourly.TimeEnd(), unit="s", utc=True),
        freq=pd.Timedelta(seconds=hourly.Interval()),
        inclusive="left"
    ),
    "temperature_2m": hourly.Variables(0).ValuesAsNumpy(),
    "precipitation": hourly.Variables(1).ValuesAsNumpy(),
    "weather_code": hourly.Variables(2).ValuesAsNumpy(),
    "visibility": hourly.Variables(3).ValuesAsNumpy(),
    "wind_speed_10m": hourly.Variables(4).ValuesAsNumpy(),
    "uv_index": hourly.Variables(5).ValuesAsNumpy(),
    "is_day": hourly.Variables(6).ValuesAsNumpy()
})
print(hourly_data)

# Process daily data
daily = response.Daily()
daily_data = pd.DataFrame({
    "date": pd.date_range(
        start=pd.to_datetime(daily.Time(), unit="s", utc=True),
        end=pd.to_datetime(daily.TimeEnd(), unit="s", utc=True),
        freq=pd.Timedelta(seconds=daily.Interval()),
        inclusive="left"
    ),
    "weather_code": daily.Variables(0).ValuesAsNumpy(),
    "temperature_2m_max": daily.Variables(1).ValuesAsNumpy(),
    "temperature_2m_min": daily.Variables(2).ValuesAsNumpy(),
    "sunrise": daily.Variables(3).ValuesAsNumpy(),
    "sunset": daily.Variables(4).ValuesAsNumpy(),
    "precipitation_sum": daily.Variables(5).ValuesAsNumpy()
})
print(daily_data)
