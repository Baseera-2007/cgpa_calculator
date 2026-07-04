import {
  Paper,
  Typography,
  Grid,
  Button,
  Box,
} from "@mui/material";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DownloadIcon from "@mui/icons-material/Download";

const data = [
  { range: "9 - 10", students: 45 },
  { range: "8 - 8.99", students: 120 },
  { range: "7 - 7.99", students: 75 },
  { range: "< 7", students: 15 },
];

function Reports() {
  return (
    <div style={{ padding: "20px" }}>
      {/* Title */}
      <Typography
        variant="h4"
        sx={{
          color: "#1e3a8a",
          fontWeight: "bold",
          mb: 1,
        }}
      >
        📊 Academic Reports
      </Typography>

      <Typography
        sx={{
          color: "#555",
          mb: 4,
          fontSize: "16px",
        }}
      >
        View overall academic performance and generate downloadable reports.
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={2.4}>
          <Paper sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
            <Typography>Total Students</Typography>
            <Typography variant="h4" color="#1e3a8a">
              255
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={2.4}>
          <Paper sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
            <Typography>Average CGPA</Typography>
            <Typography variant="h4" color="#1e3a8a">
              8.72
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={2.4}>
          <Paper sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
            <Typography>Highest CGPA</Typography>
            <Typography variant="h4" color="#1e3a8a">
              9.91
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={2.4}>
          <Paper sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
            <Typography>Lowest CGPA</Typography>
            <Typography variant="h4" color="#1e3a8a">
              6.95
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={2.4}>
          <Paper sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
            <Typography>Pass Percentage</Typography>
            <Typography variant="h4" color="#1e3a8a">
              98%
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Chart */}
      <Paper
        sx={{
          p: 4,
          mt: 4,
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "#1e3a8a",
            fontWeight: "bold",
            mb: 3,
          }}
        >
          CGPA Distribution
        </Typography>

        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data}>
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="students" fill="#1e3a8a" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      {/* Download Buttons */}
      <Paper
        sx={{
          mt: 4,
          p: 4,
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "#1e3a8a",
            fontWeight: "bold",
            mb: 3,
          }}
        >
          Generate Reports
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 3,
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="contained"
            startIcon={<PictureAsPdfIcon />}
            sx={{
              background: "#1e3a8a",
              px: 4,
            }}
            onClick={() => alert("PDF Report Downloaded")}
          >
            Download PDF
          </Button>

          <Button
            variant="contained"
            color="success"
            startIcon={<DownloadIcon />}
            sx={{
              px: 4,
            }}
            onClick={() => alert("Excel Report Downloaded")}
          >
            Export Excel
          </Button>
        </Box>
      </Paper>
    </div>
  );
}

export default Reports;