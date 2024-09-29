import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, Card, CardContent } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import CloudIcon from "@mui/icons-material/Cloud";
import GrainIcon from "@mui/icons-material/Grain";
import AcUnitIcon from "@mui/icons-material/AcUnit";

const HourlyWeather = ({ city }) => {
  const [hourlyData, setHourlyData] = useState([]);

  useEffect(() => {
    const fetchHourlyData = async () => {
      const API_KEY = "075ef05b5d0d611285f007d3ad9b62f6"; // Replace with your OpenWeatherMap API key
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
        );
        const filteredHourlyData = response.data.list; // Get all available hourly data
        setHourlyData(filteredHourlyData);
      } catch (error) {
        console.error("Error fetching hourly weather data:", error);
      }
    };

    fetchHourlyData();
  }, [city]);

  // Helper function to map weather description to appropriate icons
  const getWeatherIcon = (description) => {
    if (description.includes("cloud"))
      return <CloudIcon fontSize="large" sx={{ color: "gray" }} />;
    if (description.includes("rain"))
      return <GrainIcon fontSize="large" sx={{ color: "blue" }} />;
    if (description.includes("snow"))
      return <AcUnitIcon fontSize="large" sx={{ color: "lightblue" }} />;
    return <WbSunnyIcon fontSize="large" sx={{ color: "orange" }} />;
  };

  return (
    <Box
      className="hourly-weather-container"
      sx={{
        display: "flex",

        flexDirection: "column",
        gap: "20px",
        padding: "20px",
        backgroundColor: "#001F3F", // Dark blue background
        borderRadius: "8px",
        width: "68vw",
        boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.3)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          // Enable horizontal scrolling
          gap: "15px",
          paddingBottom: "10px",
          paddingRight: "20px", // Optional: add some padding to the right
          height: "8.5rem",
         
        }}
      >
        {hourlyData.slice(0, 8).map(
          (
            hour,
            index // Show only the first 6 hours
          ) => (
            <Card
              key={index}
              className="hourly-card"
              sx={{
                width: "120px",
                textAlign: "center",
                // height: "11.5rem",
                backgroundColor: "rgba(1, 44, 87, 0.5)", // Semi-transparent background
                color: "white",
                borderRadius: "8px",
                transition: "transform 0.2s",
                height: "10rem",
                "&:hover": {
                  transform: "scale(1.05)", // Scale effect on hover
                  boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.4)",
                },
              }}
            >
              <CardContent>
                <Typography variant="body2" color="white">
                  <AccessTimeIcon
                    sx={{ verticalAlign: "middle", marginRight: "5px" }}
                  />
                  {new Date(hour.dt * 1000).getHours()}:00
                </Typography>
                {getWeatherIcon(hour.weather[0].description)}
                <Typography variant="h6">
                  {Math.round(hour.main.temp)}°C
                </Typography>
                <Typography variant="body2" color="white">
                  {hour.weather[0].description}
                </Typography>
              </CardContent>
            </Card>
          )
        )}
      </Box>
    </Box>
  );
};

export default HourlyWeather;
