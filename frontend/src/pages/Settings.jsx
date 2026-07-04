import { useState } from "react";
import {
  Paper,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Switch,
  FormControlLabel,
  Button,
  Box,
} from "@mui/material";

function Settings() {
  const [darkMode, setDarkMode] = useState(false);

  const handleSave = () => {
    alert("Settings Saved Successfully!");
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography
        variant="h4"
        sx={{
          color: "#1e3a8a",
          fontWeight: "bold",
          mb: 1,
        }}
      >
        ⚙️ Settings
      </Typography>

      <Typography
        sx={{
          color: "#555",
          mb: 4,
        }}
      >
        Configure your Academic Management System.
      </Typography>

      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "#1e3a8a",
            mb: 3,
            fontWeight: "bold",
          }}
        >
          College Information
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="College Name"
              defaultValue="KPR Institute of Engineering and Technology"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Department"
              defaultValue="Computer Science and Business Systems"
            />
          </Grid>
        </Grid>

        <Typography
          variant="h6"
          sx={{
            color: "#1e3a8a",
            mt: 5,
            mb: 3,
            fontWeight: "bold",
          }}
        >
          Academic Settings
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Academic Year"
              defaultValue="2025-2026"
            >
              <MenuItem value="2024-2025">2024-2025</MenuItem>
              <MenuItem value="2025-2026">2025-2026</MenuItem>
              <MenuItem value="2026-2027">2026-2027</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Default Batch"
              defaultValue="2023-2027"
            >
              <MenuItem value="2023-2027">2023-2027</MenuItem>
              <MenuItem value="2024-2028">2024-2028</MenuItem>
              <MenuItem value="2025-2029">2025-2029</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        <Typography
          variant="h6"
          sx={{
            color: "#1e3a8a",
            mt: 5,
            mb: 2,
            fontWeight: "bold",
          }}
        >
          Appearance
        </Typography>

        <FormControlLabel
          control={
            <Switch
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
          }
          label={darkMode ? "Dark Mode" : "Light Mode"}
        />

        <Box sx={{ mt: 5 }}>
          <Button
            variant="contained"
            sx={{
              background: "#1e3a8a",
              px: 5,
            }}
            onClick={handleSave}
          >
            Save Settings
          </Button>
        </Box>
      </Paper>
    </div>
  );
}

export default Settings;