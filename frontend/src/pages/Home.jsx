import { useState } from "react";

import FilterBar from "../components/FilterBar";
import Dashboard from "../components/Dashboard";

import {
  Typography,
  Box,
} from "@mui/material";

function Home() {
  const [batch, setBatch] = useState("2023-2027");

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      {/* Page Header */}
      <Box
        sx={{
          mb: 3,
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "24px", md: "28px" },
            fontWeight: 600,
            color: "#1f2937",
            letterSpacing: "-0.3px",
          }}
        >
          Dashboard
        </Typography>

        <Typography
          sx={{
            mt: 0.5,
            fontSize: "14px",
            color: "#6b7280",
          }}
        >
          Academic performance overview
        </Typography>
      </Box>

      {/* Batch Filter */}
      <FilterBar
        batch={batch}
        setBatch={setBatch}
      />

      {/* Dashboard */}
      <Dashboard batch={batch} />
    </Box>
  );
}

export default Home;