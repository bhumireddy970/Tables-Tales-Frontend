import { Box, Typography, Link, Button } from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import GitHubIcon from "@mui/icons-material/GitHub";
import TwitterIcon from "@mui/icons-material/Twitter";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <Box sx={{ bgcolor: "black", color: "white" }}>
      {/* Top Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-around",
          alignItems: { xs: "center", md: "flex-start" },
          gap: { xs: 4, md: 0 },
          px: { xs: 2, md: 4 },
          py: 4,
        }}
      >
        {/* Brand */}
        <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
          <Typography
            variant="h5"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            Table
            <Button variant="contained" color="success">
              Tales
            </Button>
          </Typography>
          <Typography sx={{ fontSize: "14px", mt: 1 }}>
            Where Every Meal Tells a Story! 🍽️✨
          </Typography>
        </Box>

        {/* Account Links */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            textAlign: { xs: "center", md: "left" },
            "& a": {
              color: "white",
              textDecoration: "none",
              fontSize: "16px",
              fontWeight: "500",
              transition: "color 0.3s",
            },
            "& a:hover": { color: "goldenrod" },
          }}
        >
          <Typography
            sx={{ color: "green", fontWeight: "bold", fontSize: "14px" }}
          >
            ACCOUNT
          </Typography>
          <NavLink to="/profile">My Account</NavLink>
          <NavLink to="/orders">Order History</NavLink>
          <NavLink to="/profile">Wish List</NavLink>
          <NavLink to="/review">Review</NavLink>
        </Box>

        {/* Services */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            textAlign: { xs: "center", md: "left" },
            "& a": {
              color: "white",
              textDecoration: "none",
              fontSize: "16px",
              fontWeight: "500",
              transition: "color 0.3s",
            },
            "& a:hover": { color: "goldenrod" },
          }}
        >
          <Typography
            sx={{ color: "green", fontWeight: "bold", fontSize: "14px" }}
          >
            SERVICES
          </Typography>
          <NavLink to="/orders">Orders</NavLink>
          <NavLink to="/catering">Catering</NavLink>
          <NavLink to="/profile">Accounts</NavLink>
        </Box>

        {/* Details */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            textAlign: { xs: "center", md: "left" },
            "& a": {
              color: "white",
              textDecoration: "none",
              fontSize: "16px",
              fontWeight: "500",
              transition: "color 0.3s",
            },
            "& a:hover": { color: "goldenrod" },
          }}
        >
          <Typography
            sx={{ color: "green", fontWeight: "bold", fontSize: "14px" }}
          >
            DETAILS
          </Typography>
          <Link href="/about">About Us</Link>
          <Link href="/contact">Contact Us</Link>
          <Link href="/tandc">Terms and Conditions</Link>
        </Box>

        {/* Social Links */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            textAlign: { xs: "center", md: "left" },
            "& svg": {
              fontSize: "30px",
              cursor: "pointer",
              transition: "color 0.3s, transform 0.3s",
            },
            "& svg:hover": {
              color: "goldenrod",
              transform: "scale(1.1)",
            },
          }}
        >
          <Typography
            sx={{ color: "green", fontWeight: "bold", fontSize: "14px" }}
          >
            MORE LINKS
          </Typography>
          <Link href="https://instagram.com" target="_blank">
            <InstagramIcon />
          </Link>
          <Link href="https://github.com" target="_blank">
            <GitHubIcon />
          </Link>
          <Link href="https://twitter.com" target="_blank">
            <TwitterIcon />
          </Link>
        </Box>
      </Box>

      {/* Bottom Section */}
      <Typography
        variant="body2"
        sx={{
          fontSize: "14px",
          textAlign: "center",
          bgcolor: "black",
          color: "white",
          py: 2,
          borderTop: "1px solid #444",
        }}
      >
        &copy; {new Date().getFullYear()} Restaurant. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
