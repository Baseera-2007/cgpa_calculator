import { useState } from "react";
import { Link } from "react-router-dom";

import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
} from "@mui/material";

function VerifyCodeForm() {
  const [code, setCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!code) {
      alert("Please enter the verification code");
      return;
    }

    alert("Verification code will be verified.");
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
        Verify Your Email
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
        Enter the 6-digit code sent to your email
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>

        {/* Verification Code */}
        <TextField
          fullWidth
          label="Verification Code"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          inputProps={{
            maxLength: 6,
            inputMode: "numeric",
          }}
          required
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              backgroundColor: "#fbfdff",
            },
          }}
        />

        {/* Verify Button */}
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
          Verify Code
        </Button>

        {/* Resend */}
        <Typography
          align="center"
          sx={{
            mt: 3,
            color: "#64748b",
            fontSize: "0.92rem",
          }}
        >
          Didn't receive the code?{" "}

          <button
            type="button"
            onClick={() =>
              alert("A new verification code will be sent.")
            }
            style={{
              border: "none",
              background: "none",
              padding: 0,
              cursor: "pointer",
              color: "#2563eb",
              fontWeight: 600,
              fontSize: "0.92rem",
            }}
          >
            Resend Code
          </button>
        </Typography>

        {/* Back */}
        <Typography
          align="center"
          sx={{
            mt: 1.5,
            color: "#64748b",
            fontSize: "0.92rem",
          }}
        >
          <Link
            to="/forgot-password"
            style={{
              textDecoration: "none",
              color: "#1e3a8a",
              fontWeight: 600,
            }}
          >
            Back
          </Link>
        </Typography>

      </Box>
    </Paper>
  );
}

export default VerifyCodeForm;