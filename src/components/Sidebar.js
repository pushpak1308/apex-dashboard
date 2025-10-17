import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Link } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BusinessIcon from "@mui/icons-material/Business";
import PaidIcon from "@mui/icons-material/Paid";
import PeopleIcon from "@mui/icons-material/People";
import ReceiptIcon from "@mui/icons-material/Receipt"; // ✅ For Bills

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
  { text: "Projects", icon: <BusinessIcon />, path: "/projects" },
  { text: "Expenses", icon: <PaidIcon />, path: "/add-expense" },
  { text: "Persons", icon: <PeopleIcon />, path: "/persons" },
  { text: "Bills", icon: <ReceiptIcon />, path: "/bills" }, // ✅ Added Bills page navigation
];

const Sidebar = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        [`& .MuiDrawer-paper`]: {
          width: 240,
          backgroundColor: "#F9FAFB",
          borderRight: "1px solid #E5E7EB",
        },
      }}
    >
      <List sx={{ mt: 8 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              sx={{
                "&:hover": { backgroundColor: "#E0E7FF" },
              }}
            >
              <ListItemIcon sx={{ color: "#1E3A8A" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
