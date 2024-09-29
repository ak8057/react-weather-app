import React from "react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import WbSunnyIcon from "@mui/icons-material/WbSunny"; // Hot weather icon
import AcUnitIcon from "@mui/icons-material/AcUnit"; // Cold weather icon
import CloudIcon from "@mui/icons-material/Cloud"; // Moderate weather icon
import { Box, Typography } from "@mui/material";
import "../App";

const MainWeatherCard = ({ weatherData }) => {
  const temperatureCelsius = weatherData?.main?.temp || "N/A";
  const weatherDescription = weatherData?.weather?.[0]?.description || "N/A";
  const cityName = weatherData?.name || "City not available";
  const countryName = weatherData?.sys?.country || "Country not available";
  const timestamp = weatherData?.dt || null;

  const currentDate = timestamp
    ? new Date(timestamp * 1000).toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "short",
      })
    : "Date not available";

  const renderTemperatureIcon = () => {
    if (temperatureCelsius > 23) {
      return (
        <WbSunnyIcon
          style={{ marginLeft: "10px", fontSize: "3rem", color: "orange" }}
        />
      );
    } else if (temperatureCelsius < 10) {
      return (
        <AcUnitIcon
          style={{ marginLeft: "10px", fontSize: "3rem", color: "blue" }}
        />
      );
    } else {
      return (
        <CloudIcon
          style={{ marginLeft: "10px", fontSize: "3rem", color: "gray" }}
        />
      );
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#00203FFF",
        color: "white",
        borderRadius: "0.5rem",
        width: "326px",
        height: "200px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
      }}
      className="glass-card"
    >
      <Typography variant="h6">Now</Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          fontSize: "35px",
          fontWeight: "bold",
        }}
      >
        <Typography variant="h4" sx={{ marginRight: "10px" }}>
          {temperatureCelsius}°C
        </Typography>
        {renderTemperatureIcon()}
      </Box>
      <Typography variant="body1" sx={{ marginTop: "8px", fontWeight: "500" }}>
        {weatherDescription}
      </Typography>
      <Box sx={{ marginTop: "1rem" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <CalendarMonthIcon sx={{ marginRight: "5px" }} />
          <Typography variant="body2">{currentDate}</Typography>
        </Box>
        <Box sx={{ marginTop: "4px", display: "flex", alignItems: "center" }}>
          <LocationOnIcon sx={{ marginRight: "5px" }} />
          <Typography variant="body2">
            {cityName}, {countryName}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default MainWeatherCard;
