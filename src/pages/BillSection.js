import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  OutlinedInput,
  Checkbox,
  ListItemText,
  IconButton,
} from "@mui/material";
import { DataGrid, GridToolbarContainer } from "@mui/x-data-grid";
import DownloadIcon from "@mui/icons-material/Download";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const CustomToolbar = ({ data, columns }) => {
  const handleExport = () => {
    const header = columns
      .filter((col) => !col.disableExport)
      .map((col) => col.headerName)
      .join(",");
    const rows = data.map((row) =>
      columns
        .filter((col) => !col.disableExport)
        .map((col) => {
          let value = row[col.field];
          if (value === undefined || value === null) return "";
          const stringVal = typeof value === "string" ? value : String(value);
          if (stringVal.includes(",") || stringVal.includes('"')) {
            return `"${stringVal.replace(/"/g, '""')}"`;
          }
          return stringVal;
        })
        .join(",")
    );
    const csvContent = [header, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bills_export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <GridToolbarContainer sx={{ justifyContent: "flex-end", p: 1 }}>
      <Button
        variant="outlined"
        size="small"
        onClick={handleExport}
        sx={{ color: "#1E3A8A", borderColor: "#1E3A8A", fontWeight: 600 }}
      >
        Export CSV
      </Button>
    </GridToolbarContainer>
  );
};

const BillSection = () => {
  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [persons, setPersons] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const [selectedProjects, setSelectedProjects] = useState([]);
  const [selectedPersons, setSelectedPersons] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get("https://apexconstruction.onrender.com/api/expenses/all").then((res) => {
      setBills(res.data);
      setFilteredBills(res.data);
    });
    axios
      .get("https://apexconstruction.onrender.com/api/projects/all")
      .then((res) => setProjects(res.data));
    axios
      .get("https://apexconstruction.onrender.com/api/persons/all")
      .then((res) => setPersons(res.data));
  }, []);

  useEffect(() => {
    if (selectedProjects.length === 1) {
      axios
        .get(
          `https://apexconstruction.onrender.com/api/categories/byProject/${selectedProjects[0]}`
        )
        .then((res) => setCategories(res.data));
    } else if (selectedProjects.length === 0) {
      setCategories([]);
    }
  }, [selectedProjects]);

  useEffect(() => {
    if (selectedCategories.length === 1) {
      axios
        .get(
          `https://apexconstruction.onrender.com/api/subcategories/byCategory/${selectedCategories[0]}`
        )
        .then((res) => setSubcategories(res.data));
    } else if (selectedCategories.length === 0) {
      setSubcategories([]);
    }
  }, [selectedCategories]);

  useEffect(() => {
    let filtered = [...bills];
    if (selectedProjects.length)
      filtered = filtered.filter((b) =>
        selectedProjects.includes(b.project?.projectId)
      );
    if (selectedPersons.length)
      filtered = filtered.filter((b) =>
        selectedPersons.includes(b.person?.personId)
      );
    if (selectedCategories.length)
      filtered = filtered.filter((b) =>
        selectedCategories.includes(b.category?.categoryId)
      );
    if (selectedSubcategories.length)
      filtered = filtered.filter((b) =>
        selectedSubcategories.includes(b.subcategory?.subcategoryId)
      );
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.vendor?.toLowerCase().includes(q) ||
          b.description?.toLowerCase().includes(q) ||
          b.invoiceNumber?.toLowerCase().includes(q)
      );
    }
    if (fromDate)
      filtered = filtered.filter((b) => new Date(b.expenseDate) >= fromDate);
    if (toDate)
      filtered = filtered.filter((b) => new Date(b.expenseDate) <= toDate);
    setFilteredBills(filtered);
  }, [
    selectedProjects,
    selectedPersons,
    selectedCategories,
    selectedSubcategories,
    searchQuery,
    fromDate,
    toDate,
    bills,
  ]);

  const handleReset = () => {
    setSelectedProjects([]);
    setSelectedPersons([]);
    setSelectedCategories([]);
    setSelectedSubcategories([]);
    setSearchQuery("");
    setFromDate(null);
    setToDate(null);
  };

  const handleDownload = (billFileName) => {
    if (!billFileName) return alert("No bill file available ❌");
    const link = document.createElement("a");
    link.href = `https://apexconstruction.onrender.com/api/expenses/files/${billFileName}`;
    link.download = billFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEdit = (expense) => {
    navigate("/add-expense", { state: { expense } });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await axios.delete(`https://apexconstruction.onrender.com/api/expenses/delete/${id}`);
        alert("Expense deleted successfully ✅");
        setBills((prev) =>
          prev.filter((b) => b.expenseId !== id && b.id !== id)
        );
        setFilteredBills((prev) =>
          prev.filter((b) => b.expenseId !== id && b.id !== id)
        );
      } catch {
        alert("Failed to delete expense ❌");
      }
    }
  };

  const totals = filteredBills.reduce(
    (acc, b) => {
      acc.amount += Number(b.amount || 0);
      acc.taxAmount += Number(b.taxAmount || 0);
      acc.totalAmount += Number(b.totalAmount || 0);
      return acc;
    },
    { amount: 0, taxAmount: 0, totalAmount: 0 }
  );

  const columns = [
    { field: "id", headerName: "S.No", width: 80 },
    { field: "invoiceNumber", headerName: "Invoice No", width: 150 },
    {
      field: "projectName",
      headerName: "Project",
      width: 150,
      valueGetter: ({ row }) => row?.project?.projectName || "",
    },
    {
      field: "personName",
      headerName: "Person",
      width: 150,
      valueGetter: ({ row }) => row?.person?.personName || "",
    },
    {
      field: "categoryName",
      headerName: "Category",
      width: 150,
      valueGetter: ({ row }) => row?.category?.categoryName || "",
    },
    {
      field: "subcategoryName",
      headerName: "Subcategory",
      width: 150,
      valueGetter: ({ row }) => row?.subcategory?.subcategoryName || "",
    },
    { field: "vendor", headerName: "Vendor", width: 180 },
    { field: "description", headerName: "Description", flex: 1, minWidth: 250 },
    { field: "amount", headerName: "Amount (₹)", width: 130 },
    { field: "taxPercent", headerName: "Tax (%)", width: 100 },
    { field: "taxAmount", headerName: "Tax Amt (₹)", width: 130 },
    {
      field: "gstRequired",
      headerName: "GST Required",
      width: 130,
      valueGetter: ({ row }) => {
        if (typeof row?.gstRequired === "string") {
          const val = row.gstRequired.trim().toLowerCase();
          if (val === "yes") return "Yes";
          if (val === "no") return "No";
          if (val === "partially") return "Partially";
          return row.gstRequired;
        }
        return "";
      },
    },
    { field: "totalAmount", headerName: "Total (₹)", width: 150 },
    { field: "paymentMethod", headerName: "Payment", width: 150 },
    { field: "reconciliationStatus", headerName: "Reconciliation", width: 160 },
    { field: "expenseDate", headerName: "Date", width: 140 },
    {
      field: "billFile",
      headerName: "Bill",
      width: 100,
      renderCell: (params) =>
        params.value ? (
          <DownloadIcon
            onClick={() => handleDownload(params.value)}
            sx={{
              color: "#1E3A8A",
              cursor: "pointer",
              "&:hover": { color: "#2563EB", transform: "scale(1.2)" },
              transition: "all 0.2s ease",
            }}
          />
        ) : (
          "—"
        ),
      valueGetter: (params) => params?.value,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      disableExport: true,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            onClick={() => handleEdit(params.row)}
            size="small"
            sx={{
              color: "#2563EB",
              "&:hover": {
                backgroundColor: "#e0e7ff",
                color: "#1E3A8A",
                transform: "scale(1.15)",
                boxShadow: "0 0 6px #2563EB33",
              },
              transition: "all 0.2s",
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => handleDelete(params?.row?.expenseId || params?.row?.id)}
            size="small"
            sx={{
              color: "#F44336",
              "&:hover": {
                backgroundColor: "#FFEBEE",
                color: "#B71C1C",
                transform: "scale(1.15)",
                boxShadow: "0 0 6px #F4433633",
              },
              transition: "all 0.2s",
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const rows = filteredBills.map((b, i) => ({
    ...b,
    id: i + 1,
    projectName: b?.project?.projectName || "",
    personName: b?.person?.personName || "",
    categoryName: b?.category?.categoryName || "",
    subcategoryName: b?.subcategory?.subcategoryName || "",
    gstRequired: b.gstRequired,
  }));

  function groupByCategory(billsInProject) {
    const groups = {};
    billsInProject.forEach((bill) => {
      const catName = bill.category?.categoryName || "Uncategorized";
      if (!groups[catName]) {
        groups[catName] = [];
      }
      groups[catName].push(bill);
    });
    return Object.entries(groups).map(([category, items]) => ({
      name: category,
      items,
    }));
  }

  const showCategoryGrids = selectedProjects.length > 0;
  const categoryGroups = showCategoryGrids
    ? groupByCategory(
        filteredBills.filter((bill) =>
          selectedProjects.includes(bill.project?.projectId)
        )
      )
    : [];

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
      <Box
        sx={{
          p: 4,
          minHeight: "100vh",
          backgroundImage:
            "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80')",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
          backgroundPosition: "center",
        }}
      >
        <Box
          sx={{
            backdropFilter: "blur(8px)",
            background: "rgba(255,255,255,0.85)",
            borderRadius: 4,
            p: 4,
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          }}
        >
          {/* HEADER */}
          <Typography
            variant="h4"
            sx={{ mb: 3, fontWeight: 700, color: "#1E3A8A" }}
          >
            💼 Bills & Payment Records
          </Typography>
          <Card
            sx={{
              mb: 4,
              p: 3,
              borderRadius: 3,
              display: "flex",
              justifyContent: "space-around",
              background: "rgba(255, 255, 255, 0.8)",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            }}
          >
            {[
              { label: "Total Amount", value: totals.amount },
              { label: "Total Tax Amount", value: totals.taxAmount },
              { label: "Grand Total", value: totals.totalAmount },
            ].map((item) => (
              <Box key={item.label} textAlign="center">
                <Typography sx={{ color: "#1E3A8A", fontWeight: 600 }}>
                  {item.label}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ color: "#2563EB", fontWeight: 700 }}
                >
                  ₹{item.value.toLocaleString()}
                </Typography>
              </Box>
            ))}
          </Card>
          {/* FILTERS */}
          <Card
            elevation={0}
            sx={{
              mb: 4,
              p: 3,
              borderRadius: 3,
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
              overflowX: "auto",
              whiteSpace: "nowrap",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
                flexWrap: "nowrap",
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: "#1E3A8A", fontWeight: 600 }}
              >
                🎯 Filter Your Records
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  flexShrink: 0,
                }}
              >
                <TextField
                  placeholder="Search (Vendor / Invoice / Desc)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <SearchIcon sx={{ color: "#1E3A8A", mr: 1 }} />
                    ),
                  }}
                  sx={{
                    backgroundColor: "#fff",
                    borderRadius: "50px",
                    "& .MuiOutlinedInput-root": { borderRadius: "50px" },
                    width: 280,
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleReset}
                  sx={{
                    px: 3,
                    py: 1,
                    borderRadius: "50px",
                    background: "linear-gradient(135deg, #3B82F6, #1E3A8A)",
                    fontWeight: 600,
                    "&:hover": { transform: "scale(1.05)" },
                  }}
                >
                  🔄 Reset
                </Button>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                overflowX: "auto",
                pb: 1,
              }}
            >
              {/* Project */}
              <FormControl sx={{ minWidth: 220, flexShrink: 0 }}>
                <InputLabel>Project</InputLabel>
                <Select
                  multiple
                  value={selectedProjects}
                  onChange={(e) => setSelectedProjects(e.target.value)}
                  input={<OutlinedInput label="Project" />}
                  renderValue={(selected) =>
                    projects
                      .filter((p) => selected.includes(p.projectId))
                      .map((p) => p.projectName)
                      .join(", ")
                  }
                >
                  {projects.map((p) => (
                    <MenuItem key={p.projectId} value={p.projectId}>
                      <Checkbox
                        checked={selectedProjects.includes(p.projectId)}
                      />
                      <ListItemText primary={p.projectName} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* Person */}
              <FormControl sx={{ minWidth: 220, flexShrink: 0 }}>
                <InputLabel>Person</InputLabel>
                <Select
                  multiple
                  value={selectedPersons}
                  onChange={(e) => setSelectedPersons(e.target.value)}
                  input={<OutlinedInput label="Person" />}
                  renderValue={(selected) =>
                    persons
                      .filter((p) => selected.includes(p.personId))
                      .map((p) => p.personName)
                      .join(", ")
                  }
                >
                  {persons.map((p) => (
                    <MenuItem key={p.personId} value={p.personId}>
                      <Checkbox
                        checked={selectedPersons.includes(p.personId)}
                      />
                      <ListItemText primary={p.personName} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* Category: only enable when project is selected */}
              <FormControl
                sx={{ minWidth: 220, flexShrink: 0 }}
                disabled={selectedProjects.length === 0}
              >
                <InputLabel>Category</InputLabel>
                <Select
                  multiple
                  value={selectedCategories}
                  onChange={(e) => setSelectedCategories(e.target.value)}
                  input={<OutlinedInput label="Category" />}
                  renderValue={(selected) =>
                    categories
                      .filter((c) => selected.includes(c.categoryId))
                      .map((c) => c.categoryName)
                      .join(", ")
                  }
                >
                  {categories.map((c) => (
                    <MenuItem key={c.categoryId} value={c.categoryId}>
                      <Checkbox
                        checked={selectedCategories.includes(c.categoryId)}
                      />
                      <ListItemText primary={c.categoryName} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* Subcategory: only enable when category is selected */}
              <FormControl
                sx={{ minWidth: 220, flexShrink: 0 }}
                disabled={selectedCategories.length === 0}
              >
                <InputLabel>Subcategory</InputLabel>
                <Select
                  multiple
                  value={selectedSubcategories}
                  onChange={(e) => setSelectedSubcategories(e.target.value)}
                  input={<OutlinedInput label="Subcategory" />}
                  renderValue={(selected) =>
                    subcategories
                      .filter((s) => selected.includes(s.subcategoryId))
                      .map((s) => s.subcategoryName)
                      .join(", ")
                  }
                >
                  {subcategories.map((s) => (
                    <MenuItem key={s.subcategoryId} value={s.subcategoryId}>
                      <Checkbox
                        checked={selectedSubcategories.includes(
                          s.subcategoryId
                        )}
                      />
                      <ListItemText primary={s.subcategoryName} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* From Date */}
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="From"
                  value={fromDate}
                  onChange={(date) => setFromDate(date)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={{ minWidth: 180, flexShrink: 0 }}
                    />
                  )}
                />
              </LocalizationProvider>
              {/* To Date */}
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="To"
                  value={toDate}
                  onChange={(date) => setToDate(date)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={{ minWidth: 180, flexShrink: 0 }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Box>
          </Card>
          {/* CATEGORY GRIDS */}
          {selectedProjects.length > 0 ? (
            categoryGroups.map((catGroup, idx) => (
              <Box key={idx} sx={{ mb: 4 }}>
                <Typography
                  variant="h5"
                  sx={{
                    color: "#2563EB",
                    fontWeight: 800,
                    mb: 2,
                    letterSpacing: 1.1,
                  }}
                >
                  {catGroup.name}
                </Typography>
                <Card
                  sx={{
                    borderRadius: 4,
                    boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                  }}
                >
                  <CardContent>
                    <div style={{ height: 400, width: "100%" }}>
                      <DataGrid
                        rows={catGroup.items.map((b, i) => ({
                          ...b,
                          id: i + 1,
                          projectName: b.project?.projectName || "",
                          personName: b.person?.personName || "",
                          categoryName: b.category?.categoryName || "",
                          subcategoryName: b.subcategory?.subcategoryName || "",
                          gstRequired: b.gstRequired,
                        }))}
                        columns={columns}
                        pageSize={7}
                        rowsPerPageOptions={[7, 14, 21]}
                        sx={{
                          border: "none",
                          "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: "#E0E7FF",
                            color: "#1E3A8A",
                            fontWeight: "bold",
                          },
                          "& .MuiDataGrid-row:hover": {
                            backgroundColor: "#F3F4F6",
                            transform: "scale(1.01)",
                            transition: "all 0.2s ease",
                          },
                        }}
                        hideFooterSelectedRowCount
                        components={{
                          Toolbar: () => (
                            <CustomToolbar
                              data={catGroup.items.map((b, i) => ({
                                ...b,
                                id: i + 1,
                                projectName: b.project?.projectName || "",
                                personName: b.person?.personName || "",
                                categoryName: b.category?.categoryName || "",
                                subcategoryName:
                                  b.subcategory?.subcategoryName || "",
                                gstRequired: b.gstRequired,
                              }))}
                              columns={columns}
                            />
                          ),
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </Box>
            ))
          ) : (
            <Card
              sx={{ borderRadius: 4, boxShadow: "0 8px 25px rgba(0,0,0,0.08)" }}
            >
              <CardContent>
                <div style={{ height: 600, width: "100%" }}>
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[5, 10, 20]}
                    sx={{
                      border: "none",
                      "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: "#E0E7FF",
                        color: "#1E3A8A",
                        fontWeight: "bold",
                      },
                      "& .MuiDataGrid-row:hover": {
                        backgroundColor: "#F3F4F6",
                        transform: "scale(1.01)",
                        transition: "all 0.2s ease",
                      },
                    }}
                    components={{
                      Toolbar: () => (
                        <CustomToolbar data={rows} columns={columns} />
                      ),
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </Box>
      </Box>
    </motion.div>
  );
};

export default BillSection;
