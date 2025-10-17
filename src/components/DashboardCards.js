import React from "react";
import { Grid, Paper, Typography } from "@mui/material";

const DashboardCards = ({ data }) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={3}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="subtitle2" color="textSecondary">
            Total Expense
          </Typography>
          <Typography variant="h5" color="primary">
            ₹{data.totalExpense?.toLocaleString() || 0}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={3}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="subtitle2" color="textSecondary">
            Total GST
          </Typography>
          <Typography variant="h5" color="success.main">
            ₹{data.totalGST?.toLocaleString() || 0}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={3}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="subtitle2" color="textSecondary">
            Persons
          </Typography>
          <Typography variant="h5" color="warning.main">
            {Object.keys(data.expenseByPerson || {}).length}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={3}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="subtitle2" color="textSecondary">
            Projects
          </Typography>
          <Typography variant="h5" color="error.main">
            4
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default DashboardCards;
