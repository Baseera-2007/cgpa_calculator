import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
} from "@mui/material";

function ForgotPasswordForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
  e.preventDefault();

  if (!email) {
    alert("Please enter your email address");
    return;
  }

  navigate("/verify-code");
};

  return (
    <Paper
      elevation={3}
      sx={{
        width: 430,
        maxWidth: "100%",
        p: { xs: 3, sm: 4 },
        borderRadius: 3,
        backgroundColor: "#ffffff",
        border: "1px solid #e5edf8",
      }}
    >
      {/* Title */}
      <Typography
        variant="h4"
        align="center"
        sx={{
          color: "#1e3a8a",
          fontWeight: 700,
          mb: 1,
        }}
      >
        Forgot Password?
      </Typography>

      {/* Subtitle */}
      <Typography
        align="center"
        sx={{
          color: "#64748b",
          fontSize: "0.95rem",
          mb: 3,
        }}
      >
        Enter your registered email address
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>

        {/* Email */}
        <TextField
          fullWidth
          label="Email Address"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              backgroundColor: "#fbfdff",
            },
          }}
        />

        {/* Send Code Button */}
        <Button
          fullWidth
          variant="contained"
          type="submit"
          sx={{
            mt: 1,
            py: 1.4,
            borderRadius: 2,
            backgroundColor: "#2563eb",
            fontWeight: 600,
            fontSize: "1rem",
            textTransform: "none",
            boxShadow: "none",
            "&:hover": {
              backgroundColor: "#1d4ed8",
              boxShadow: "none",
            },
          }}
        >
          Send Verification Code
        </Button>

        {/* Back to Sign In */}
        <Typography
          align="center"
          sx={{
            mt: 3,
            color: "#64748b",
            fontSize: "0.92rem",
          }}
        >
          Remember your password?{" "}

          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: "#1e3a8a",
              fontWeight: 600,
            }}
          >
            Sign In
          </Link>
        </Typography>

      </Box>
    </Paper>
  );
}

export default ForgotPasswordForm;