import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import MainWeatherCard from "./components/MainWeatherCard";
import "./App.css";
import TodayHighlights from "./components/TodayHighlights";
import FiveDayForecast from "./components/FiveDayForecast";
import axios from "axios";
import HourlyWeather from "./components/HourlyWeather";

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("London"); // Default city is set to London
  const [airQualityData, setAirQualityData] = useState(null);
  const [fiveDayForecast, setFiveDayForecast] = useState(null);

  useEffect(() => {
    fetchWeatherData(city);
  }, [city]);

  const fetchAirQualityData = (lat, lon) => {
    const API_KEY = "075ef05b5d0d611285f007d3ad9b62f6"; // Replace with your OpenWeatherMap API key
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      )
      .then((response) => {
        setAirQualityData(response.data.list[0]); // Set the first item in the list as air quality data
      })
      .catch((error) =>
        console.error("Error fetching the air quality data:", error)
      );
  };

  const fetchWeatherData = (city) => {
    const API_KEY = "075ef05b5d0d611285f007d3ad9b62f6"; // Replace with your OpenWeatherMap API key
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
    )
      .then((response) => response.json())
      .then((data) => {
        setWeatherData(data);
        console.log(JSON.stringify(data));
        fetchAirQualityData(data.coord.lat, data.coord.lon);
        axios
          .get(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
          )
          .then((response) => {
            setFiveDayForecast(response.data);
          })
          .catch((error) =>
            console.error("Error fetching the 5-day forecast data:", error)
          );
      })
      .catch((error) =>
        console.error("Error fetching the weather data:", error)
      );
  };

  // New function to fetch weather data using coordinates
  const fetchWeatherByCoords = (lat, lon) => {
    const API_KEY = "075ef05b5d0d611285f007d3ad9b62f6";
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    )
      .then((response) => response.json())
      .then((data) => {
        setWeatherData(data);
        fetchAirQualityData(lat, lon);
        axios
          .get(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
          )
          .then((response) => {
            setFiveDayForecast(response.data);
          })
          .catch((error) =>
            console.error("Error fetching the 5-day forecast data:", error)
          );
      })
      .catch((error) =>
        console.error("Error fetching the weather data:", error)
      );
  };

  const handleSearch = (searchedCity) => {
    setCity(searchedCity);
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoords(latitude, longitude);
        },
        (error) => {
          console.error("Error fetching the current location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };



  return (
    <>
      <Navbar
        onSearch={handleSearch}
        onCurrentLocation={handleCurrentLocation}
      />

      {weatherData && airQualityData && (
        <div style={{ display: "flex", padding: "30px", gap: "20px" }}>
          <div style={{ flex: "1", marginRight: "10px" }}>
            <MainWeatherCard weatherData={weatherData} />
            <p
              style={{ fontWeight: "700", fontSize: "20px", marginTop: "20px" }}
            >
              5 Days Forecast
            </p>
            {fiveDayForecast && (
              <FiveDayForecast forecastData={fiveDayForecast} />
            )}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: "0.5",
              gap: "20px",
            }}
          >
            <TodayHighlights
              weatherData={weatherData}
              airQualityData={airQualityData}
            />
            <HourlyWeather city={city} /> {/* Add HourlyWeather component */}
          </div>
        </div>
      )}
    </>
  );
}

export default App;
