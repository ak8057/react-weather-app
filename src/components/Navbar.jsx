import * as React from "react";
import { useState } from "react";
import { styled, alpha, useTheme } from "@mui/material/styles";
import { Button } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import FilterDramaTwoToneIcon from "@mui/icons-material/FilterDramaTwoTone";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";



const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));
const Navbar = ({onSearch}) => {
  const theme = useTheme();

   const [searchCity, setSearchCity] = useState("");

   const handleSearchClick = () => {
     if (searchCity.trim()) {
       onSearch(searchCity);
     }
   };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Icon Button (Left) */}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <FilterDramaTwoToneIcon
              fontSize="inherit"
              sx={{ fontSize: 48, color: "#FFF" }}
            />
          </IconButton>

          {/* Typography (Left) */}
          <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              color: "#FFF",
              fontFamily: "'Poppins', sans-serif", // Custom font
              fontWeight: "bold", // Bold for emphasis
              letterSpacing: "0.05rem", // Slight letter spacing for clean look
              display: "flex",
              // justifyContent: "center", // Center this text content
              [theme.breakpoints.up("xs")]: {
                fontSize: "1.4rem", // Adjust font size for small screens
              },
              [theme.breakpoints.up("md")]: {
                fontSize: "1.8rem", // Larger font for larger screens
              },
            }}
          >
            Weather App
          </Typography>

          {/* Current Location Button (Center) */}
          <div
            style={{
              // marginTop: "1rem",
              fontSize: "16px",
              fontFamily: "'Poppins', sans-serif",
              fontWeight: "700",
              backgroundColor: "#0066b2",
              height: "35px",
              width: "150px",
              color: "white",
              gap: "5px",
              padding: "0.5rem",
              borderRadius: "6px",
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
              position: "absolute", // Positioning to keep it centered
              left: "50%", // Center horizontally
              transform: "translateX(-50%)", // Correct centering shift
              transform: "translateX(-50%)", // Correct centering shift
              transition: "all 0.3s ease", // Smooth transition for hover effect
              cursor: "pointer", // Cursor change on hover
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#005494"; // Darker shade on hover
              e.currentTarget.style.transform = "translateX(-50%) scale(1.05)"; // Slight scale on hover
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#0066b2"; // Original color when hover ends
              e.currentTarget.style.transform = "translateX(-50%) scale(1)"; // Reset scale
            }}
          >
            <GpsFixedIcon />
            <p
              style={{
                fontSize: "14px",
              }}
            >
              Current Location
            </p>
          </div>

          {/* Search Bar (Right) */}
          <Search sx={{ marginLeft: "auto" }}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
          <Button
            variant="contained"
            onClick={handleSearchClick}
            style={{
              borderRadius: "6px",
              backgroundColor: "#0066b2",
              margin: "10px",
            }}
          >
            Search
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
