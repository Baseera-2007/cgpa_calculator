import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
} from "@mui/material";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

function SigninForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    role: "student",
    register_number: "",
    faculty_id: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          password: formData.password,
          role: formData.role,

          register_number:
            formData.role === "student"
              ? formData.register_number
              : null,

          faculty_id:
            formData.role === "staff"
              ? formData.faculty_id
              : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage =
          typeof data.detail === "string"
            ? data.detail
            : "Login failed";

        alert(errorMessage);
        return;
      }

      localStorage.setItem("username", data.username);
      localStorage.setItem("role", data.role);

      if (data.register_number) {
        localStorage.setItem(
          "register_number",
          data.register_number
        );
      }

      if (data.faculty_id) {
        localStorage.setItem(
          "faculty_id",
          data.faculty_id
        );
      }

      alert("Login Successful 🎉");

      if (data.role === "staff") {
        navigate("/staff");
      } else {
        navigate("/student/profile");
      }

    } catch (err) {
      console.log("LOGIN ERROR:", err);
      alert("Server Error");
    }
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
        Sign In
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
        Access your academic dashboard
      </Typography>

      <Box component="form" onSubmit={handleSignin}>

        {/* Login As */}
        <FormControl
          fullWidth
          sx={{
            mb: 2,
          }}
        >
          <InputLabel>Login As</InputLabel>

          <Select
            name="role"
            label="Login As"
            value={formData.role}
            onChange={handleChange}
            sx={{
              borderRadius: 2,
              backgroundColor: "#fbfdff",
            }}
          >
            <MenuItem value="student">
              Student
            </MenuItem>

            <MenuItem value="staff">
              Faculty
            </MenuItem>
          </Select>
        </FormControl>

        {/* Student Register Number */}
        {formData.role === "student" && (
          <TextField
            fullWidth
            label="Register Number"
            name="register_number"
            value={formData.register_number}
            onChange={handleChange}
            required
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "#fbfdff",
              },
            }}
          />
        )}

        {/* Faculty ID */}
        {formData.role === "staff" && (
          <TextField
            fullWidth
            label="Faculty ID"
            name="faculty_id"
            value={formData.faculty_id}
            onChange={handleChange}
            required
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "#fbfdff",
              },
            }}
          />
        )}

        {/* Password */}
        <TextField
          fullWidth
          label="Password"
          type={showPassword ? "text" : "password"}
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              backgroundColor: "#fbfdff",
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  edge="end"
                >
                  {showPassword ? (
                    <VisibilityOff />
                  ) : (
                    <Visibility />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Forgot Password */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mt: 1,
          }}
        >
          <Link
            to="/forgot-password"
            style={{
              textDecoration: "none",
              color: "#2563eb",
              fontSize: "0.88rem",
              fontWeight: 500,
            }}
          >
            Forgot Password?
          </Link>
        </Box>

        {/* Sign In Button */}
        <Button
          fullWidth
          variant="contained"
          type="submit"
          sx={{
            mt: 3,
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
          Sign In
        </Button>

        {/* Sign Up */}
        <Typography
          align="center"
          sx={{
            mt: 3,
            color: "#64748b",
            fontSize: "0.92rem",
          }}
        >
          Don't have an account?{" "}

          <Link
            to="/signup"
            style={{
              textDecoration: "none",
              color: "#1e3a8a",
              fontWeight: 600,
            }}
          >
            Sign Up
          </Link>
        </Typography>

      </Box>
    </Paper>
  );
}

export default SigninForm;