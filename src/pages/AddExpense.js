import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const AddExpense = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if editing, get expense data from navigation state
  const expenseToEdit = location.state?.expense || null;

  const [formData, setFormData] = useState({
    expenseDate: new Date(),
    personId: "",
    projectId: "",
    groupId: "",
    categoryId: "",
    subcategoryId: "",
    invoiceNumber: "",
    vendor: "",
    description: "",
    amount: "",
    gstRequired: "",
    quantity: "",
    taxPercent: "",
    taxAmount: "",
    totalAmount: "",
    paymentMethod: "",
    remarks: "",
    reconciliationStatus: "",
  });

  const [billFile, setBillFile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [groups, setGroups] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [persons, setPersons] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [newValue, setNewValue] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // Load base data on mount
  useEffect(() => {
    axios
      .get("https://apexconstruction.onrender.com/api/projects/all")
      .then((res) => setProjects(res.data));
    axios
      .get("https://apexconstruction.onrender.com/api/persons/all")
      .then((res) => setPersons(res.data));
  }, []);

  // Load dependent dropdowns on formData changes
  useEffect(() => {
    if (formData.projectId)
      axios
        .get(`https://apexconstruction.onrender.com/api/groups/byProject/${formData.projectId}`)
        .then((res) => setGroups(res.data));
    else setGroups([]);

    if (formData.groupId)
      axios
        .get(`https://apexconstruction.onrender.com/api/categories/byGroup/${formData.groupId}`)
        .then((res) => setCategories(res.data));
    else setCategories([]);

    if (formData.categoryId)
      axios
        .get(
          `https://apexconstruction.onrender.com/api/subcategories/byCategory/${formData.categoryId}`
        )
        .then((res) => setSubcategories(res.data));
    else setSubcategories([]);
  }, [formData.projectId, formData.groupId, formData.categoryId]);

  // Populate form if editing existing expense
  useEffect(() => {
    if (expenseToEdit) {
      setFormData({
        expenseDate: new Date(expenseToEdit.expenseDate),
        personId: expenseToEdit.person?.personId || "",
        projectId: expenseToEdit.project?.projectId || "",
        groupId: expenseToEdit.group?.groupId || "",
        categoryId: expenseToEdit.category?.categoryId || "",
        subcategoryId: expenseToEdit.subcategory?.subcategoryId || "",
        invoiceNumber: expenseToEdit.invoiceNumber || "",
        vendor: expenseToEdit.vendor || "",
        description: expenseToEdit.description || "",
        amount: expenseToEdit.amount || "",
        gstRequired: expenseToEdit.gstRequired || "",
        quantity: expenseToEdit.quantity || "",
        taxPercent: expenseToEdit.taxPercent || "",
        taxAmount: expenseToEdit.taxAmount || "",
        totalAmount: expenseToEdit.totalAmount || "",
        paymentMethod: expenseToEdit.paymentMethod || "",
        remarks: expenseToEdit.remarks || "",
        reconciliationStatus: expenseToEdit.reconciliationStatus || "",
      });
    }
  }, [expenseToEdit]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleDateChange = (date) =>
    setFormData({ ...formData, expenseDate: date });
  const handleFileChange = (e) => setBillFile(e.target.files[0]);

  const openDialog = (type) => {
    setDialogType(type);
    setDialogOpen(true);
    setNewValue("");
  };

  const handleAddNew = async () => {
    const name = (newValue || "").trim();
    if (!name) {
      alert("Please enter a name before adding ❌");
      return;
    }

    // URL map for adding new
    const urlMap = {
      project: "https://apexconstruction.onrender.com/api/projects/add",
      group: "https://apexconstruction.onrender.com/api/groups/add",
      category: "https://apexconstruction.onrender.com/api/categories/add",
      subcategory: "https://apexconstruction.onrender.com/api/subcategories/add",
      person: "https://apexconstruction.onrender.com/api/persons/add",
    };

    if (!urlMap[dialogType]) {
      alert("Cannot add: invalid type.");
      return;
    }

    let requestBody = {};

    switch (dialogType) {
      case "project":
        requestBody = { projectName: name };
        break;
      case "group":
        if (!formData.projectId) {
          alert("Please select a Project first ❌");
          return;
        }
        requestBody = { groupName: name, projectId: formData.projectId };
        break;
      case "category":
        if (!formData.groupId) {
          alert("Please select a Group first ❌");
          return;
        }
        requestBody = { categoryName: name, groupId: formData.groupId };
        break;
      case "subcategory":
        if (!formData.categoryId) {
          alert("Please select a Category first ❌");
          return;
        }
        requestBody = {
          subcategoryName: name,
          categoryId: formData.categoryId,
        };
        break;
      case "person":
        requestBody = { personName: name };
        break;
      default:
        return;
    }

    try {
      await axios.post(urlMap[dialogType], requestBody);

      setDialogOpen(false);
      setNewValue("");

      // Refresh relevant lists after adding
      switch (dialogType) {
        case "project":
          axios
            .get("https://apexconstruction.onrender.com/api/projects/all")
            .then((r) => setProjects(r.data));
          break;
        case "group":
          if (formData.projectId)
            axios
              .get(
                `https://apexconstruction.onrender.com/api/groups/byProject/${formData.projectId}`
              )
              .then((r) => setGroups(r.data));
          break;
        case "category":
          if (formData.groupId)
            axios
              .get(
                `https://apexconstruction.onrender.com/api/categories/byGroup/${formData.groupId}`
              )
              .then((r) => setCategories(r.data));
          break;
        case "subcategory":
          if (formData.categoryId)
            axios
              .get(
                `https://apexconstruction.onrender.com/api/subcategories/byCategory/${formData.categoryId}`
              )
              .then((r) => setSubcategories(r.data));
          break;
        case "person":
          axios
            .get("https://apexconstruction.onrender.com/api/persons/all")
            .then((r) => setPersons(r.data));
          break;
        default:
          break;
      }

      alert(`${dialogType} added successfully ✅`);
    } catch (error) {
      alert("Failed to add new item ❌");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    Object.entries({
      ...formData,
      expenseDate: formData.expenseDate.toISOString().split("T")[0],
    }).forEach(([key, value]) => payload.append(key, value));
    if (billFile) payload.append("billFile", billFile);

    try {
      if (expenseToEdit) {
        // PUT request for update
        await axios.put(
          `https://apexconstruction.onrender.com/api/expenses/update/${expenseToEdit.expenseId}`,
          payload,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        alert("Expense updated successfully ✅");
      } else {
        // POST request for add
        await axios.post("https://apexconstruction.onrender.com/api/expenses/add", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Expense added successfully ✅");
      }
      navigate("/bills");
    } catch (err) {
      alert("Error saving expense ❌");
    }
  };

  const dropdownBoxStyle = {
    display: "flex",
    alignItems: "center",
    gap: 1.5,
    width: "100%",
  };
  const iconStyle = {
    backgroundColor: "#E0E7FF",
    color: "#1E3A8A",
    "&:hover": { backgroundColor: "#C7D2FE" },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Box
        sx={{
          p: 4,
          background: "linear-gradient(to right, #EEF2FF, #F9FAFB)",
          minHeight: "100vh",
        }}
      >
        <Typography
          variant="h4"
          sx={{ mb: 3, fontWeight: 700, color: "#1E3A8A" }}
        >
          {expenseToEdit ? "✏️ Edit Expense" : "🧾 Add New Expense"}
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* Left Section */}
            <Grid item xs={12} md={6}>
              <Card elevation={6} sx={{ borderRadius: 4, background: "#fff" }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{ mb: 2, fontWeight: 600, color: "#1E3A8A" }}
                  >
                    🏗️ Project & Person Details
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  {[
                    {
                      name: "projectId",
                      label: "Project",
                      list: projects,
                      key: "projectId",
                      display: "projectName",
                    },
                    {
                      name: "groupId",
                      label: "Group",
                      list: groups,
                      key: "groupId",
                      display: "groupName",
                    },
                    {
                      name: "categoryId",
                      label: "Category",
                      list: categories,
                      key: "categoryId",
                      display: "categoryName",
                    },
                    {
                      name: "subcategoryId",
                      label: "Subcategory",
                      list: subcategories,
                      key: "subcategoryId",
                      display: "subcategoryName",
                    },
                    {
                      name: "personId",
                      label: "Person",
                      list: persons,
                      key: "personId",
                      display: "personName",
                    },
                  ].map((item) => (
                    <Box key={item.name} sx={dropdownBoxStyle} mb={2}>
                      <FormControl fullWidth>
                        <InputLabel>{item.label}</InputLabel>
                        <Select
                          name={item.name}
                          value={formData[item.name]}
                          onChange={handleChange}
                        >
                          {item.list.map((x) => (
                            <MenuItem key={x[item.key]} value={x[item.key]}>
                              {x[item.display]}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <Tooltip title={`Add new ${item.label}`}>
                        <IconButton
                          size="small"
                          onClick={() =>
                            openDialog(item.name.replace("Id", ""))
                          }
                          sx={iconStyle}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  ))}

                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Expense Date"
                      value={formData.expenseDate}
                      onChange={handleDateChange}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth />
                      )}
                    />
                  </LocalizationProvider>
                </CardContent>
              </Card>
            </Grid>

            {/* Right Section */}
            <Grid item xs={12} md={6}>
              <Card elevation={6} sx={{ borderRadius: 4, background: "#fff" }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{ mb: 2, fontWeight: 600, color: "#1E3A8A" }}
                  >
                    💰 Invoice & Payment Details
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  <TextField
                    label="Invoice Number"
                    name="invoiceNumber"
                    value={formData.invoiceNumber}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Vendor"
                    name="vendor"
                    value={formData.vendor}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={2}
                    sx={{ mb: 2 }}
                  />

                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>GST Input Required</InputLabel>
                    <Select
                      name="gstRequired"
                      value={formData.gstRequired}
                      onChange={handleChange}
                    >
                      <MenuItem value="Yes">Yes</MenuItem>
                      <MenuItem value="No">No</MenuItem>
                      <MenuItem value="Partially">Partially</MenuItem>
                    </Select>
                  </FormControl>

                  <Box
                    component="label"
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      p: 4,
                      mb: 3,
                      borderRadius: 4,
                      border: "2px dashed #3B82F6",
                      background: "rgba(239,246,255,0.7)",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      "&:hover": { background: "rgba(239,246,255,0.95)" },
                    }}
                  >
                    <UploadFileIcon
                      sx={{ fontSize: 50, color: "#1E3A8A", mb: 1 }}
                    />
                    <Typography
                      variant="body1"
                      sx={{ color: "#1E3A8A", fontWeight: 600 }}
                    >
                      {billFile
                        ? "File Selected"
                        : "Click or Drag to Upload Bill"}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ mt: 0.5, color: "#6B7280" }}
                    >
                      {billFile ? billFile.name : "Supported: PDF, JPG, PNG"}
                    </Typography>
                    <input
                      type="file"
                      hidden
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                    />
                  </Box>

                  <TextField
                    label="Amount (₹)"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                  />

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        label="Tax Percent (%)"
                        name="taxPercent"
                        value={formData.taxPercent}
                        onChange={handleChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Tax Amount"
                        name="taxAmount"
                        value={formData.taxAmount}
                        onChange={handleChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Total Amount"
                        name="totalAmount"
                        value={formData.totalAmount}
                        onChange={handleChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Quantity"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        fullWidth
                      />
                    </Grid>
                  </Grid>

                  <TextField
                    label="Payment Method"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    fullWidth
                    sx={{ my: 2 }}
                  />

                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Reconciliation Status</InputLabel>
                    <Select
                      name="reconciliationStatus"
                      value={formData.reconciliationStatus}
                      onChange={handleChange}
                    >
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Reconciled">Reconciled</MenuItem>
                      <MenuItem value="Discrepancy">Discrepancy</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    label="Remarks"
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={2}
                  />
                </CardContent>
              </Card>
            </Grid>

            {/* Submit */}
            <Grid item xs={12} sx={{ textAlign: "center", mt: 4 }}>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{
                    px: 8,
                    py: 1.5,
                    fontWeight: 600,
                    borderRadius: 3,
                    background: "linear-gradient(90deg, #1E3A8A, #3B82F6)",
                    color: "#fff",
                    boxShadow: "0px 4px 12px rgba(30,58,138,0.3)",
                    "&:hover": {
                      background: "linear-gradient(90deg, #1E40AF, #2563EB)",
                    },
                  }}
                >
                  {expenseToEdit ? "💾 Save Changes" : "💾 Save Expense"}
                </Button>
              </motion.div>
            </Grid>
          </Grid>
        </form>

        {/* Add Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>
            Add New{" "}
            {dialogType
              ? dialogType.charAt(0).toUpperCase() + dialogType.slice(1)
              : "Item"}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label={`Enter ${dialogType || "name"}`}
              fullWidth
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleAddNew}
              variant="contained"
              sx={{ backgroundColor: "#1E3A8A" }}
            >
              Add
            </Button>
          </DialogActions>
        </Dialog>

        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            style={{
              position: "fixed",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2000,
              backgroundColor: "rgba(255,255,255,0.85)",
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  background: "#3B82F6",
                  mx: "auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography sx={{ fontSize: 40, color: "#fff" }}>✅</Typography>
              </Box>
              <Typography sx={{ mt: 2, fontWeight: 700, color: "#1E3A8A" }}>
                Expense Added Successfully!
              </Typography>
            </Box>
          </motion.div>
        )}
      </Box>
    </motion.div>
  );
};

export default AddExpense;
