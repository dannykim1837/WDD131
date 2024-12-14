import requests
import pandas as pd

# Function to get latitude and longitude for a city using OpenCage Geocoding API
def get_coordinates(city_name):
    geocoding_api_url = "https://api.opencagedata.com/geocode/v1/json"
    api_key = "1298fa4155a34f8f8cce4c6018df122f"  # Replace with your OpenCage API key
    params = {
        "q": city_name,
        "key": api_key,
        "limit": 1
    }
    response = requests.get(geocoding_api_url, params=params)
    data = response.json()
    
    if response.status_code == 200 and data['results']:
        latitude = data['results'][0]['geometry']['lat']
        longitude = data['results'][0]['geometry']['lng']
        return latitude, longitude
    else:
        raise ValueError(f"Could not find location for {city_name}.")

# Function to get weather data from Open-Meteo API
def get_weather_data(latitude, longitude):
    weather_api_url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current_weather": "true",
        "hourly": "temperature_2m,precipitation,weather_code,visibility,wind_speed_10m,uv_index,is_day",
	    "daily": "weather_code", "temperature_2m_max", "temperature_2m_min", "sunrise", "sunset", "precipitation_sum",
        "temperature_unit": "fahrenheit"
    }
    response = requests.get(weather_api_url, params=params)
    data = response.json()
    
    if response.status_code == 200:
        return data
    else:
        raise ValueError("Could not fetch weather data.")

# Main function
def main():
    city_name = input("Enter a city name: ")
    
    try:
        # Get coordinates for the city
        latitude, longitude = get_coordinates(city_name)
        print(f"Coordinates for {city_name}: Latitude {latitude}, Longitude {longitude}")
        
        # Get weather data for the coordinates
        weather_data = get_weather_data(latitude, longitude)
        print("Current Weather:")
        current_weather = weather_data.get("current_weather", {})
        print(f"Temperature: {current_weather.get('temperature', 'N/A')} °F")
        print(f"Wind Speed: {current_weather.get('windspeed', 'N/A')} mph")
        print(f"Weather Code: {current_weather.get('weathercode', 'N/A')}")
        
        # Optionally, process hourly or daily data
        # For example, show the first few hours of hourly data:
        hourly_data = weather_data.get("hourly", {})
        print("\nHourly Forecast:")
        for time, temp in zip(hourly_data.get("time", [])[:5], hourly_data.get("temperature_2m", [])[:5]):
            print(f"Time: {time}, Temperature: {temp} °F")
    
    except ValueError as e:
        print(f"Error: {e}")

# Run the script
if __name__ == "__main__":
    main()
