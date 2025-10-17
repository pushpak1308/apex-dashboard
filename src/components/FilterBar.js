import React, { useState, useEffect } from "react";
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField,
  Collapse,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import axios from "axios";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";

const FilterBar = ({ onFilterChange }) => {
  const [projects, setProjects] = useState([]);
  const [groups, setGroups] = useState([]);
  const [categories, setCategories] = useState([]);

  const [filters, setFilters] = useState({
    project: "",
    group: "",
    category: "",
    startDate: null,
    endDate: null,
  });

  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    axios
      .get("https://apexconstruction.onrender.com/api/projects/all")
      .then((res) => setProjects(res.data));
  }, []);

  const handleChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });
  const handleDateChange = (name, value) =>
    setFilters({ ...filters, [name]: value });

  const handleApply = () => onFilterChange(filters);

  useEffect(() => {
    if (filters.project)
      axios
        .get(`https://apexconstruction.onrender.com/api/groups/byProject/${filters.project}`)
        .then((res) => setGroups(res.data));
  }, [filters.project]);

  useEffect(() => {
    if (filters.group)
      axios
        .get(`https://apexconstruction.onrender.com/api/categories/byGroup/${filters.group}`)
        .then((res) => setCategories(res.data));
  }, [filters.group]);

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        p: 2,
        mb: 3,
        borderRadius: 2,
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
      }}
    >
      {/* Header Row with Toggle Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, color: "#1E3A8A" }}>
          Filters
        </Typography>

        <IconButton
          onClick={() => setShowFilters(!showFilters)}
          color="primary"
        >
          {showFilters ? <CloseIcon /> : <FilterListIcon />}
        </IconButton>
      </Box>

      {/* Collapsible Filter Section */}
      <Collapse in={showFilters}>
        <Grid container spacing={2}>
          {/* Project */}
          <Grid item xs={12} sm={6} md={2.5}>
            <FormControl fullWidth>
              <InputLabel>Project</InputLabel>
              <Select
                name="project"
                value={filters.project}
                onChange={handleChange}
                sx={{ minWidth: "200px" }}
              >
                {projects.map((p) => (
                  <MenuItem key={p.projectId} value={p.projectId}>
                    {p.projectName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Group */}
          <Grid item xs={12} sm={6} md={2.5}>
            <FormControl fullWidth>
              <InputLabel>Group</InputLabel>
              <Select
                name="group"
                value={filters.group}
                onChange={handleChange}
                sx={{ minWidth: "200px" }}
              >
                {groups.map((g) => (
                  <MenuItem key={g.groupId} value={g.groupId}>
                    {g.groupName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Category */}
          <Grid item xs={12} sm={6} md={2.5}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={filters.category}
                onChange={handleChange}
                sx={{ minWidth: "200px" }}
              >
                {categories.map((c) => (
                  <MenuItem key={c.categoryId} value={c.categoryId}>
                    {c.categoryName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Start Date */}
          <Grid item xs={12} sm={6} md={2.25}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={filters.startDate}
                onChange={(val) => handleDateChange("startDate", val)}
                renderInput={(params) => (
                  <TextField {...params} fullWidth sx={{ minWidth: "180px" }} />
                )}
              />
            </LocalizationProvider>
          </Grid>

          {/* End Date */}
          <Grid item xs={12} sm={6} md={2.25}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="End Date"
                value={filters.endDate}
                onChange={(val) => handleDateChange("endDate", val)}
                renderInput={(params) => (
                  <TextField {...params} fullWidth sx={{ minWidth: "180px" }} />
                )}
              />
            </LocalizationProvider>
          </Grid>

          {/* Apply Button */}
          <Grid
            item
            xs={12}
            sm={6}
            md={1.5}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleApply}
              sx={{
                width: "100%",
                minWidth: "130px",
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Apply
            </Button>
          </Grid>
        </Grid>
      </Collapse>
    </Box>
  );
};

export default FilterBar;
