import { Paper, Typography, MenuItem, TextField } from "@mui/material";

function FilterBar({ batch, setBatch }) {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        borderRadius: 3,
        mb: 4,
      }}
    >
      <Typography
        variant="h5"
        sx={{
          color: "#1e3a8a",
          fontWeight: "bold",
          mb: 3,
        }}
      >
        🎓 CSBS Academic Performance & Result Management System
      </Typography>

      <Typography
        sx={{
          fontSize: "20px",
          mb: 3,
        }}
      >
        <b>Department :</b> CSBS
      </Typography>

      <TextField
        select
        label="Batch"
        value={batch}
        onChange={(e) => setBatch(e.target.value)}
        sx={{ width: 280 }}
      >
        <MenuItem value="2023-2027">2023-2027</MenuItem>
        <MenuItem value="2024-2028">2024-2028</MenuItem>
        <MenuItem value="2025-2029">2025-2029</MenuItem>
      </TextField>
    </Paper>
  );
}

export default FilterBar;