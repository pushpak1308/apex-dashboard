import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box, Toolbar } from "@mui/material";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import AddExpense from "./pages/AddExpense";
import Dashboard from "./pages/Dashboard";
import BillSection from "./pages/BillSection";

function App() {
  const drawerWidth = 240;
  return (
    <Router>
      <Box sx={{ display: "flex" }}>
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: "#F3F4F6",
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
          }}
        >
          {/* Navbar */}
          <Navbar />
          {/* Add some space for the Drawer top */}
          <Toolbar />

          {/* Routes */}
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add-expense" element={<AddExpense />} />
            <Route path="/bills" element={<BillSection />} />{" "}
            {/* ✅ New Route */}
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
