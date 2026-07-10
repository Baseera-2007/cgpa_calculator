import { useState } from "react";

import FilterBar from "../components/FilterBar";
import Dashboard from "../components/Dashboard";

import {
  Typography,
  Box,
  Paper,
} from "@mui/material";

import SchoolIcon from "@mui/icons-material/School";

function Home() {

  const [batch, setBatch] = useState("2023-2027");

  return (
    <Box sx={{ p: 4 }}>

      {/* Header */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 4,
          mb: 4,
          background:
            "linear-gradient(135deg,#1e3a8a,#2563eb)",
          color: "white",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <SchoolIcon
            sx={{
              fontSize: 55,
            }}
          />

          <Box>
            <Typography
              sx={{
                fontSize: "34px",
                fontWeight: "bold",
                letterSpacing: 1,
              }}
            >
              Academic Dashboard
            </Typography>

            <Typography
              sx={{
                mt: 1,
                opacity: 0.9,
                fontSize: "17px",
              }}
            >
              Manage student records, upload semester results,
              calculate SGPA & CGPA and monitor academic
              performance batch-wise.
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Batch Filter */}
      <Box sx={{ mb: 4 }}>
        <FilterBar
          batch={batch}
          setBatch={setBatch}
        />
      </Box>

      {/* Dashboard */}
      <Dashboard batch={batch} />

    </Box>
  );
}

export default Home;