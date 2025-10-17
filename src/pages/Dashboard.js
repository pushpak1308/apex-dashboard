import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography } from "@mui/material";
import FilterBar from "../components/FilterBar";
import DashboardCards from "../components/DashboardCards";
import Charts from "../components/Charts";

const Dashboard = () => {
  const [data, setData] = useState({});

  // Fetch dashboard data (with optional filters)
  const loadDashboard = (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.project) params.append("projectId", filters.project);
    if (filters.group) params.append("groupId", filters.group);
    if (filters.category) params.append("categoryId", filters.category);
    if (filters.startDate)
      params.append("start", filters.startDate.toISOString().split("T")[0]);
    if (filters.endDate)
      params.append("end", filters.endDate.toISOString().split("T")[0]);

    axios
      .get(`https://apexconstruction.onrender.com/api/dashboard/summary?${params}`)
      .then((res) => setData(res.data))
      .catch((err) => console.error("Error loading dashboard:", err));
  };

  // Load on first render
  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <Box sx={{ flexGrow: 1, p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Dashboard Overview
      </Typography>

      <FilterBar onFilterChange={loadDashboard} />
      <DashboardCards data={data} />
      <Charts data={data} />
    </Box>
  );
};

export default Dashboard;
