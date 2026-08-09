import {
  Paper,
  Typography,
  MenuItem,
  TextField,
  Box,
} from "@mui/material";

function FilterBar({ batch, setBatch }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, md: 3 },
        borderRadius: 3,
        mb: 3,
        border: "1px solid #e5e7eb",
        backgroundColor: "#ffffff",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "stretch", sm: "center" },
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        {/* Filter Information */}
        <Box>
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 600,
              color: "#1f2937",
              mb: 0.5,
            }}
          >
            Batch
          </Typography>

          <Typography
            sx={{
              fontSize: "13px",
              color: "#6b7280",
            }}
          >
            Select a batch to view academic performance
          </Typography>
        </Box>

        {/* Batch Dropdown */}
        <TextField
          select
          label="Batch"
          value={batch}
          onChange={(e) => setBatch(e.target.value)}
          size="small"
          sx={{
            width: { xs: "100%", sm: 220 },

            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              backgroundColor: "#ffffff",
              fontSize: "14px",
              fontFamily:
                '"Segoe UI", "Inter", "Arial", sans-serif',
            },

            "& .MuiInputLabel-root": {
              fontSize: "14px",
              fontFamily:
                '"Segoe UI", "Inter", "Arial", sans-serif',
            },

            "& .MuiInputBase-input": {
              fontFamily:
                '"Segoe UI", "Inter", "Arial", sans-serif',
              fontSize: "14px",
            },
          }}
        >
          <MenuItem value="2023-2027">
            2023-2027
          </MenuItem>

          <MenuItem value="2024-2028">
            2024-2028
          </MenuItem>

          <MenuItem value="2025-2029">
            2025-2029
          </MenuItem>
        </TextField>
      </Box>
    </Paper>
  );
}

export default FilterBar;