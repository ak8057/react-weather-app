import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, Card, CardContent } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import CloudIcon from "@mui/icons-material/Cloud";
import GrainIcon from "@mui/icons-material/Grain";
import AcUnitIcon from "@mui/icons-material/AcUnit";
// import "./HourlyWeather.css"; // For custom styles if needed

const HourlyWeather = ({ city }) => {
  const [hourlyData, setHourlyData] = useState([]);

  useEffect(() => {
    const fetchHourlyData = async () => {
      const API_KEY = "075ef05b5d0d611285f007d3ad9b62f6"; // Replace with your OpenWeatherMap API key
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
        );
        const filteredHourlyData = response.data.list.slice(0, 8); // Get first 8 entries (24 hours, 3-hour interval)
        setHourlyData(filteredHourlyData);
      } catch (error) {
        console.error("Error fetching hourly weather data:", error);
      }
    };

    fetchHourlyData();
  }, [city]);

  // Helper function to map weather description to appropriate icons
  const getWeatherIcon = (description) => {
    if (description.includes("cloud")) return <CloudIcon />;
    if (description.includes("rain")) return <GrainIcon />;
    if (description.includes("snow")) return <AcUnitIcon />;
    return <WbSunnyIcon />;
  };

  return (
    <Box
      className="hourly-weather-container"
      sx={{ display: "flex", flexDirection: "column", gap: "20px" }}
    >
      <Typography variant="h6" gutterBottom>
        Hourly Weather Forecast
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-around",
          gap: "10px",
        }}
      >
        {hourlyData.map((hour, index) => (
          <Card
            key={index}
            className="hourly-card"
            sx={{ width: 120, textAlign: "center" }}
          >
            <CardContent>
              <Typography variant="body2" color="textSecondary">
                <AccessTimeIcon /> {new Date(hour.dt * 1000).getHours()}:00
              </Typography>
              {getWeatherIcon(hour.weather[0].description)}
              <Typography variant="h6">
                {Math.round(hour.main.temp)}°C
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {hour.weather[0].description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default HourlyWeather;
