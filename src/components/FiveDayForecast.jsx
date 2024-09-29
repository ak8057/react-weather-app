import React from "react";
import { Box, Typography } from "@mui/material";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import CloudIcon from "@mui/icons-material/Cloud";
import GrainIcon from "@mui/icons-material/Grain";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import InsertChartIcon from "@mui/icons-material/InsertChart";

const FiveDayForecast = ({ forecastData }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
    }).format(date);
  };

  const getWeatherIcon = (description) => {
    if (description.includes("clear"))
      return <WbSunnyIcon fontSize="large" sx={{ color: "yellow" }} />;
    if (description.includes("cloud"))
      return <CloudIcon fontSize="large" sx={{ color: "gray" }} />;
    if (description.includes("rain"))
      return <GrainIcon fontSize="large" sx={{ color: "blue" }} />;
    if (description.includes("snow"))
      return <AcUnitIcon fontSize="large" sx={{ color: "lightblue" }} />;
    return <InsertChartIcon fontSize="large" sx={{ color: "white" }} />;
  };

  const getDailyForecast = () => {
    const dailyForecast = {};

    // Grouping data by date
    forecastData.list.forEach((item) => {
      const date = item.dt_txt.split(" ")[0]; // Extract the date part
      if (!dailyForecast[date]) {
        dailyForecast[date] = {
          temp: Math.round(item.main.temp),
          description: item.weather[0].description,
          count: 1,
        };
      } else {
        dailyForecast[date].temp += Math.round(item.main.temp);
        dailyForecast[date].count += 1;
      }
    });

    // Averaging the temperature for each day
    for (const date in dailyForecast) {
      dailyForecast[date].temp = Math.round(
        dailyForecast[date].temp / dailyForecast[date].count
      );
    }

    return Object.entries(dailyForecast).slice(0, 5); // Return only the first 5 days
  };

  return (
    <Box
      sx={{
        backgroundColor: "#00203FFF",
        color: "white",
        borderRadius: "0.5rem",
        width: "326px",
        padding: "20px",
        marginTop: "1rem",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Typography variant="h6" align="center" gutterBottom>
        5 Days Forecast
      </Typography>
      {getDailyForecast().map(([date, { temp, description }], index) => (
        <Box
          key={index}
          sx={{
            marginBottom: "8px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
            paddingBottom: "10px",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {getWeatherIcon(description)}
            <Typography
              variant="body1"
              sx={{ marginLeft: "10px", fontWeight: "bold" }}
            >
              {temp}°C
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              {formatDate(date)}
            </Typography>
            <Typography variant="body2">{description}</Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default FiveDayForecast;
