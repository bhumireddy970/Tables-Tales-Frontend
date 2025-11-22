// import React, { useState } from 'react';
// import '../../styles/nav-menu.css';
// import FastfoodIcon from '@mui/icons-material/Fastfood';
// import MenuIcon from '@mui/icons-material/Menu';
// import { NavLink, useNavigate } from 'react-router-dom';
// import {
//   AppBar,
//   Toolbar,
//   Box,
//   Typography,
//   IconButton,
//   Drawer,
//   Divider,
//   Button,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemText
// } from '@mui/material';
// import { useUser } from '../../contextAPI/context';

// const Header = () => {
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const { email, role, logo, logout } = useUser();
//   const navigate = useNavigate();

//   const handleToggle = () => {
//     setMobileOpen(!mobileOpen);
//   };

//   const handleLogout = () => {
//     logout(null);
//     logo('CUSTOMER');
//     navigate('/');
//   };

//   const navLinks = [
//     { label: 'Home', path: '/' },
//     { label: 'Menu', path: '/menu' },
//     ...(role === 'ADMIN'
//       ? [
//           { label: 'Admin', path: '/admin' },
//           { label: 'Deliveries', path: '/deliveryboy' }
//         ]
//       : role === 'DELIVERYBOY'
//       ? [{ label: 'Deliveries', path: '/deliveryboy' }]
//       : [{ label: 'Profile', path: '/profile' }]
//     ),
//     {label:'Reservation', path:'/reservation'},
//     { label: 'Services', path: '/catering' },
//     { label: 'About', path: '/about' },
//     { label: 'Contact', path: '/contact' }
//   ];

//   // Drawer content
//   const drawer = (
//     <Box onClick={handleToggle} sx={{ textAlign: 'center' }}>
//       <Box sx={{ my: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//         <FastfoodIcon sx={{ mr: 1, color: 'goldenrod' }} />
//         <Typography variant="h6" color="goldenrod">
//           Table
//         </Typography>
//         <Button size="small" variant="contained" color="success" sx={{ ml: 1 }}>
//           Tales
//         </Button>
//       </Box>
//       <Divider />
//       <List>
//         {navLinks.map((link) => (
//           <ListItem key={link.path} disablePadding>
//             <ListItemButton component={NavLink} to={link.path} sx={{ textAlign: 'center' }}>
//               <ListItemText primary={link.label} />
//             </ListItemButton>
//           </ListItem>
//         ))}
//         <ListItem disablePadding>
//           {email === null ? (
//             <ListItemButton component={NavLink} to="/signin" sx={{ textAlign: 'center' }}>
//               <Button variant="contained" color="success" fullWidth>Login</Button>
//             </ListItemButton>
//           ) : (
//             <ListItemButton onClick={handleLogout} sx={{ textAlign: 'center' }}>
//               <Button variant="contained" color="success" fullWidth>Log out</Button>
//             </ListItemButton>
//           )}
//         </ListItem>
//       </List>
//     </Box>
//   );

//   return (
//     <Box>
//       <AppBar component="nav" sx={{ bgcolor: 'black' }}>
//         <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
//           {/* Mobile Menu Button */}
//           <IconButton
//             onClick={handleToggle}
//             color="inherit"
//             aria-label="open drawer"
//             edge="start"
//             sx={{ mr: 2, display: { sm: 'none' } }}
//           >
//             <MenuIcon />
//           </IconButton>

//           {/* Logo */}
//           <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
//             <FastfoodIcon sx={{ mr: 1, color: 'goldenrod' }} />
//             <Typography variant="h6" color="goldenrod" sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}>
//               Table
//             </Typography>
//             <Button size="small" variant="contained" color="success" sx={{ ml: 1 }}>
//               <Typography sx={{ color: 'goldenrod', fontSize: { xs: '0.8rem', sm: '1rem' } }}>
//                 Tales
//               </Typography>
//             </Button>
//           </Box>

//           {/* Desktop Menu */}
//           <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
//             <ul className="nav-menu">
//               {navLinks.map((link) => (
//                 <li key={link.path}>
//                   <NavLink to={link.path} className={({ isActive }) => (isActive ? 'active' : '')}>
//                     {link.label}
//                   </NavLink>
//                 </li>
//               ))}
//               <li>
//                 {email === null ? (
//                   <NavLink to="/signin">
//                     <Button variant="contained" color="success">Login</Button>
//                   </NavLink>
//                 ) : (
//                   <Button variant="contained" color="success" onClick={handleLogout}>
//                     Log out
//                   </Button>
//                 )}
//               </li>
//             </ul>
//           </Box>
//         </Toolbar>
//       </AppBar>

//       {/* Mobile Drawer */}
//       <Drawer
//         sx={{
//           display: { xs: 'block', sm: 'none' },
//           '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 }
//         }}
//         variant="temporary"
//         open={mobileOpen}
//         onClose={handleToggle}
//       >
//         {drawer}
//       </Drawer>

//       {/* Offset for AppBar */}
//       <Toolbar />
//     </Box>
//   );
// };

// export default Header;
import React, { useState, useEffect } from "react";
import "../../styles/nav-menu.css";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Drawer,
  Divider,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Chip,
  Avatar,
} from "@mui/material";
import { useUser } from "../../contextAPI/context";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { email, role, logo, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout(null);
    logo("CUSTOMER");
    navigate("/");
    setMobileOpen(false);
  };

  const handleNavClick = () => {
    setMobileOpen(false);
  };

  // Nav links for drawer (with icons)
  const navLinksDrawer = [
    { label: "Home", path: "/", icon: "🏠" },
    { label: "Menu", path: "/menu", icon: "📋" },
    ...(role === "ADMIN"
      ? [
          { label: "Admin", path: "/admin", icon: "⚙️" },
          { label: "Deliveries", path: "/deliveryboy", icon: "🚚" },
        ]
      : role === "DELIVERYBOY"
      ? [{ label: "Deliveries", path: "/deliveryboy", icon: "🚚" }]
      : [{ label: "Profile", path: "/profile", icon: "👤" }]),
    { label: "Reservation", path: "/reservation", icon: "📅" },
    { label: "Services", path: "/catering", icon: "🎯" },
    { label: "About", path: "/about", icon: "ℹ️" },
    { label: "Contact", path: "/contact", icon: "📞" },
  ];

  // Nav links for header (without icons)
  const navLinksHeader = [
    { label: "Home", path: "/" },
    { label: "Menu", path: "/menu" },
    ...(role === "ADMIN"
      ? [
          { label: "Admin", path: "/admin" },
          { label: "Deliveries", path: "/deliveryboy" },
        ]
      : role === "DELIVERYBOY"
      ? [{ label: "Deliveries", path: "/deliveryboy" }]
      : [{ label: "Profile", path: "/profile" }]),
    { label: "Reservation", path: "/reservation" },
    { label: "Services", path: "/catering" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  // Enhanced drawer content
  const drawer = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)",
      }}
    >
      {/* Drawer Header */}
      <Box
        sx={{
          p: 2,
          textAlign: "center",
          borderBottom: "1px solid rgba(255,215,0,0.2)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 1,
          }}
        >
          <FastfoodIcon sx={{ fontSize: 32, color: "goldenrod", mr: 1 }} />
          <Typography variant="h5" color="goldenrod" fontWeight="bold">
            Table
          </Typography>
          <Box
            sx={{
              ml: 1,
              bgcolor: "success.main",
              borderRadius: 1,
              px: 1,
              py: 0.5,
            }}
          >
            <Typography
              sx={{ color: "white", fontSize: "0.8rem", fontWeight: "bold" }}
            >
              Tales
            </Typography>
          </Box>
        </Box>

        {email && (
          <Chip
            icon={<PersonIcon />}
            label={email}
            variant="outlined"
            size="small"
            onClick={() => navigate("/profile")}
            sx={{
              color: "goldenrod",
              borderColor: "goldenrod",
              bgcolor: "rgba(255,215,0,0.1)",
              maxWidth: "90%",
              mt: 1,
              cursor: "pointer",
              "&:hover": {
                bgcolor: "rgba(255,215,0,0.2)",
                transform: "scale(1.05)",
              },
              transition: "all 0.2s ease-in-out",
            }}
          />
        )}
      </Box>

      {/* Navigation Links */}
      <List sx={{ flexGrow: 1, p: 1 }}>
        {navLinksDrawer.map((link) => (
          <ListItem key={link.path} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={NavLink}
              to={link.path}
              onClick={handleNavClick}
              sx={{
                textAlign: "left",
                borderRadius: 1,
                mb: 0.5,
                bgcolor:
                  location.pathname === link.path
                    ? "rgba(255,215,0,0.15)"
                    : "transparent",
                border:
                  location.pathname === link.path
                    ? "1px solid rgba(255,215,0,0.3)"
                    : "1px solid transparent",
                "&:hover": {
                  bgcolor: "rgba(255,215,0,0.1)",
                  border: "1px solid rgba(255,215,0,0.2)",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, fontSize: "1.2rem" }}>
                {link.icon}
              </ListItemIcon>
              <ListItemText
                primary={link.label}
                primaryTypographyProps={{
                  fontSize: "0.95rem",
                  fontWeight:
                    location.pathname === link.path ? "bold" : "normal",
                  color:
                    location.pathname === link.path ? "goldenrod" : "white",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Logout/Login Section */}
      <Box sx={{ p: 2, borderTop: "1px solid rgba(255,215,0,0.2)" }}>
        {email === null ? (
          <Button
            component={NavLink}
            to="/signin"
            onClick={handleNavClick}
            variant="contained"
            color="success"
            fullWidth
            startIcon={<PersonIcon />}
            sx={{
              py: 1.2,
              borderRadius: 2,
              fontWeight: "bold",
              background: "linear-gradient(45deg, #2e7d32 30%, #4caf50 90%)",
              boxShadow: "0 3px 5px 2px rgba(46, 125, 50, .3)",
            }}
          >
            Login
          </Button>
        ) : (
          <Button
            onClick={handleLogout}
            variant="outlined"
            color="error"
            fullWidth
            startIcon={<ExitToAppIcon />}
            sx={{
              py: 1.2,
              borderRadius: 2,
              fontWeight: "bold",
              borderWidth: 2,
              "&:hover": {
                borderWidth: 2,
              },
            }}
          >
            Log out
          </Button>
        )}
      </Box>
    </Box>
  );

  return (
    <>
      {/* AppBar with enhanced scroll effects - No Slide component */}
      <AppBar
        component="nav"
        sx={{
          bgcolor: scrolled ? "rgba(0,0,0,0.95)" : "black",
          backdropFilter: scrolled ? "blur(10px)" : "none",
          transition: "all 0.3s ease-in-out",
          boxShadow: scrolled ? "0 4px 20px rgba(0,0,0,0.3)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,215,0,0.1)" : "none",
          transform: "translateY(0)",
          opacity: 1,
        }}
      >
        <Toolbar
          sx={{
            minHeight: { xs: 60, sm: 70 },
            py: { xs: 1, sm: 0 },
          }}
        >
          {/* Mobile Menu Button */}
          <IconButton
            onClick={handleToggle}
            color="inherit"
            aria-label="open drawer"
            edge="start"
            sx={{
              mr: 2,
              display: { sm: "none" },
              color: "goldenrod",
            }}
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>

          {/* Logo - Enhanced */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexGrow: 1,
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
          >
            <FastfoodIcon
              sx={{
                mr: 1,
                color: "goldenrod",
                fontSize: { xs: 28, sm: 32, md: 36 },
              }}
            />
            <Typography
              variant="h5"
              color="goldenrod"
              sx={{
                fontWeight: "bold",
                fontSize: { xs: "1.2rem", sm: "1.5rem", md: "1.75rem" },
              }}
            >
              Table
            </Typography>
            <Box
              sx={{
                ml: 1,
                bgcolor: "success.main",
                borderRadius: 1.5,
                px: { xs: 1, sm: 1.2 },
                py: { xs: 0.5, sm: 0.6 },
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0 4px 8px rgba(76, 175, 80, 0.3)",
                },
              }}
            >
              <Typography
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.9rem" },
                }}
              >
                Tales
              </Typography>
            </Box>
          </Box>

          {/* User Info Chip - Desktop */}
          {email && (
            <Chip
              icon={
                <Avatar sx={{ width: 24, height: 24, bgcolor: "goldenrod" }}>
                  <PersonIcon sx={{ fontSize: 16 }} />
                </Avatar>
              }
              label={
                <Typography
                  sx={{
                    fontSize: { xs: "0.7rem", sm: "0.8rem" },
                    maxWidth: { xs: 80, sm: 120, md: 150 },
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {email}
                </Typography>
              }
              onClick={() => navigate("/profile")}
              variant="outlined"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                color: "goldenrod",
                borderColor: "goldenrod",
                bgcolor: "rgba(255,215,0,0.1)",
                "& .MuiChip-label": {
                  px: 1,
                },
              }}
            />
          )}

          {/* Desktop Menu - Enhanced (without icons) */}
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <ul className="nav-menu">
              {navLinksHeader.map((link) => (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "active" : ""}`
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
              <li>
                {email === null ? (
                  <NavLink to="/signin">
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<PersonIcon />}
                      sx={{
                        borderRadius: 2,
                        fontWeight: "bold",
                        background:
                          "linear-gradient(45deg, #2e7d32 30%, #4caf50 90%)",
                        boxShadow: "0 3px 5px 2px rgba(46, 125, 50, .3)",
                        minWidth: { sm: 100, md: 120 },
                        height: 40,
                      }}
                    >
                      Login
                    </Button>
                  </NavLink>
                ) : (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleLogout}
                    startIcon={<ExitToAppIcon />}
                    sx={{
                      borderRadius: 2,
                      fontWeight: "bold",
                      borderWidth: 2,
                      minWidth: { sm: 100, md: 120 },
                      height: 40,
                      "&:hover": {
                        borderWidth: 2,
                      },
                    }}
                  >
                    Logout
                  </Button>
                )}
              </li>
            </ul>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Enhanced Mobile Drawer */}
      <Drawer
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 280,
            borderRight: "2px solid goldenrod",
          },
        }}
        variant="temporary"
        open={mobileOpen}
        onClose={handleToggle}
        ModalProps={{
          keepMounted: true,
        }}
      >
        {drawer}
      </Drawer>

      {/* Offset for AppBar */}
      <Toolbar sx={{ minHeight: { xs: 60, sm: 70 } }} />
    </>
  );
};

export default Header;
