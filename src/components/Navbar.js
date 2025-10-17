import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  InputBase,
  Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Navbar = () => {
  return (
    <AppBar position="fixed" sx={{ backgroundColor: "#1E3A8A", zIndex: 1201 }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Apex Construction
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "rgba(255,255,255,0.15)",
              borderRadius: 2,
              px: 1,
            }}
          >
            <SearchIcon />
            <InputBase placeholder="Search…" sx={{ color: "white", ml: 1 }} />
          </Box>
          <IconButton color="inherit">
            <AddCircleIcon />
          </IconButton>
          <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton>
          <IconButton color="inherit">
            <AccountCircleIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
