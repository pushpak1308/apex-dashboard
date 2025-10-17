import React from "react";
import { Grid, Paper, Typography } from "@mui/material";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";

// Register required Chart.js modules
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

const Charts = ({ data }) => {
  if (!data) return null;

  const personLabels = Object.keys(data.expenseByPerson || {});
  const personValues = Object.values(data.expenseByPerson || {});
  const subcatLabels = Object.keys(data.expenseBySubcategory || {});
  const subcatValues = Object.values(data.expenseBySubcategory || {});
  const monthLabels = Object.keys(data.monthlyExpense || {});
  const monthValues = Object.values(data.monthlyExpense || {});

  return (
    <Grid container spacing={3} sx={{ mt: 2 }}>
      {/* Bar Chart: Expense by Person */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Expense by Person
          </Typography>
          <Bar
            data={{
              labels: personLabels,
              datasets: [
                {
                  label: "Expense (₹)",
                  data: personValues,
                  backgroundColor: "rgba(54, 162, 235, 0.5)",
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: {
                x: { ticks: { color: "#333" } },
                y: { ticks: { color: "#333" } },
              },
            }}
          />
        </Paper>
      </Grid>

      {/* Pie Chart: Expense by Subcategory */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Expense by Subcategory
          </Typography>
          <Pie
            data={{
              labels: subcatLabels,
              datasets: [
                {
                  data: subcatValues,
                  backgroundColor: [
                    "#36A2EB",
                    "#FF6384",
                    "#FFCE56",
                    "#4BC0C0",
                    "#9966FF",
                    "#FF9F40",
                  ],
                },
              ],
            }}
          />
        </Paper>
      </Grid>

      {/* Line Chart: Monthly Expense */}
      <Grid item xs={12}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Monthly Expense Trend
          </Typography>
          <Line
            data={{
              labels: monthLabels,
              datasets: [
                {
                  label: "Monthly Expense (₹)",
                  data: monthValues,
                  fill: true,
                  borderColor: "#2563EB",
                  backgroundColor: "rgba(37, 99, 235, 0.2)",
                  tension: 0.3,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: {
                x: { ticks: { color: "#333" } },
                y: { ticks: { color: "#333" } },
              },
            }}
          />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Charts;
