import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import MainWeatherCard from "./components/MainWeatherCard";
import "./App.css";
import TodayHighlights from "./components/TodayHighlights";
import FiveDayForecast from "./components/FiveDayForecast";
import HourlyWeather from "./components/HourlyWeather";
import axios from "axios";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material"; // Material UI Dialog

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("London"); // Default city is set to London
  const [airQualityData, setAirQualityData] = useState(null);
  const [fiveDayForecast, setFiveDayForecast] = useState(null);
  const [errorMessage, setErrorMessage] = useState(""); // Error message state
  const [openErrorPopup, setOpenErrorPopup] = useState(false); // State to control error popup visibility

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
    setErrorMessage(""); // Clear any previous error
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("City not found");
        }
        return response.json();
      })
      .then((data) => {
        setWeatherData(data);
        fetchAirQualityData(data.coord.lat, data.coord.lon);
        axios
          .get(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
          )
          .then((response) => {
            setFiveDayForecast(response.data);
          })
          .catch((error) => {
            console.error("Error fetching the 5-day forecast data:", error);
          });
      })
      .catch((error) => {
        console.error("Error fetching the weather data:", error);
        setErrorMessage(error.message); // Set error message
        setOpenErrorPopup(true); // Show error popup
      });
  };

  const fetchWeatherByCoords = (lat, lon) => {
    const API_KEY = "075ef05b5d0d611285f007d3ad9b62f6";
    setErrorMessage(""); // Clear previous error
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("City not found");
        }
        return response.json();
      })
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
          .catch((error) => {
            console.error("Error fetching the 5-day forecast data:", error);
          });
      })
      .catch((error) => {
        console.error("Error fetching the weather data:", error);
        setErrorMessage(error.message); // Set error message
        setOpenErrorPopup(true); // Show error popup
      });
  };

  const handleSearch = (searchedCity) => {
    setCity(searchedCity);
    setErrorMessage(""); // Clear error when a new city is searched
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
          setErrorMessage("Error fetching the current location.");
          setOpenErrorPopup(true); // Show error popup
        }
      );
    } else {
      setErrorMessage("Geolocation is not supported by this browser.");
      setOpenErrorPopup(true); // Show error popup
    }
  };

  const handleClosePopup = () => {
    setOpenErrorPopup(false); // Close the error popup
  };

  return (
    <>
      <Navbar
        onSearch={handleSearch}
        onCurrentLocation={handleCurrentLocation}
      />

      {/* Error Popup Dialog */}
      <Dialog
        open={openErrorPopup}
        onClose={handleClosePopup}
        aria-labelledby="error-dialog-title"
        aria-describedby="error-dialog-description"
      >
        <DialogTitle id="error-dialog-title">Error</DialogTitle>
        <DialogContent>
          <DialogContentText id="error-dialog-description">
            {errorMessage} {/* Display the error message */}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePopup} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

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
