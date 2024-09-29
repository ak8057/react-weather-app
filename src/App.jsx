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
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("London"); // Default city is set to London
  const [airQualityData, setAirQualityData] = useState(null);
  const [fiveDayForecast, setFiveDayForecast] = useState(null);
  const [errorMessage, setErrorMessage] = useState(""); // Error message state
  const [openErrorPopup, setOpenErrorPopup] = useState(false); // State to control error popup visibility
  const [hourlyData, setHourlyData] = useState([]);

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
        PaperProps={{
          style: {
            backgroundColor: "#fff1f0", // Light red background to indicate error
            borderRadius: "12px", // Rounded corners
            padding: "20px", // Padding for content
            minWidth: "500px", // Maximum width of the dialog
          },
        }}
      >
        <DialogTitle
          id="error-dialog-title"
          style={{ display: "flex", alignItems: "center", gap: "10px" }}
          display="flex"
          justifyContent="center"
        >
          <ErrorOutlineIcon style={{ color: "#ff4d4f", fontSize: "32px" }} />{" "}
          {/* Red error icon */}
          <span style={{ color: "#ff4d4f" }}>Error</span>
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="error-dialog-description"
            style={{
              color: "#595959",
              fontSize: "25px",
              margin: "10px 0",
            }}
          >
            {errorMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ justifyContent: "center" }}>
          <Button
            onClick={handleClosePopup}
            variant="contained"
            style={{
              backgroundColor: "#ff7875",
              color: "white",
              padding: "10px 20px",
              borderRadius: "8px",
              transition: "background-color 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#ff4d4f")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#ff7875")}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {weatherData && airQualityData && (
        <div style={{ display: "flex", padding: "10px", gap: "10px", }}>
          <div style={{height:"86.5vh",width:"25vw" , marginRight: "10px" ,gap:"1rem" }}>
            <MainWeatherCard weatherData={weatherData} />
            
            {fiveDayForecast && (
              <FiveDayForecast forecastData={fiveDayForecast} />
            )}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              
              gap: "15px",
            }}
          >
            <TodayHighlights
              weatherData={weatherData}
              airQualityData={airQualityData}
            />
            <HourlyWeather city={city} />
            {/* Pass hourly weather data to the WeatherChart */}
            
          </div>
        </div>
      )}
    </>
  );
}

export default App;
