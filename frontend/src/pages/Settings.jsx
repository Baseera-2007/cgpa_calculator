import { Box, Paper, Typography } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

function Settings() {
  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 3,
          border: "1px solid #e2e8f0",
          backgroundColor: "#ffffff",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mb: 1,
          }}
        >
          <SettingsIcon
            sx={{
              color: "#1e3a8a",
              fontSize: 30,
            }}
          />

          <Typography
            sx={{
              fontSize: "26px",
              fontWeight: 700,
              color: "#1e3a8a",
            }}
          >
            Settings
          </Typography>
        </Box>

        <Typography
          sx={{
            color: "#64748b",
            fontSize: "14px",
            mt: 1,
          }}
        >
          Manage your account and application settings.
        </Typography>
      </Paper>
    </Box>
  );
}

export default Settings;