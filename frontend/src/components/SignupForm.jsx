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

function SignupForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    role: "",

    registerNumber: "",
    facultyId: "",

    batch: "",
    gender: "",

    department: "",
    email: "",

    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!formData.role) {
      alert("Please select your role");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          username: formData.username,

          role: formData.role,

          register_number:
            formData.role === "student"
              ? formData.registerNumber
              : null,

          faculty_id:
            formData.role === "staff"
              ? formData.facultyId
              : null,

          batch:
            formData.role === "student"
              ? formData.batch
              : null,

          gender:
            formData.role === "student"
              ? formData.gender
              : null,

          department:
            formData.role === "student"
              ? "CSBS"
              : null,

          email: formData.email,

          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Signup Successful 🎉");
        navigate("/");
      } else {
        const errorMessage =
          typeof data.detail === "string"
            ? data.detail
            : "Signup failed. Please check your details.";

        alert(errorMessage);
      }
    } catch (err) {
      console.log(err);
      alert("Server Error. Please try again.");
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        width: 480,
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
        Create Account
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
        Register to access your academic dashboard
      </Typography>

      <Box component="form" onSubmit={handleSignup}>

        {/* Role */}
        <FormControl
          fullWidth
          sx={{
            mb: 2,
          }}
        >
          <InputLabel>Register As</InputLabel>

          <Select
            name="role"
            value={formData.role}
            label="Register As"
            onChange={handleChange}
            required
            sx={{
              borderRadius: 2,
              backgroundColor: "#fbfdff",
            }}
          >
            <MenuItem value="">
              <em>Select Role</em>
            </MenuItem>

            <MenuItem value="student">
              Student
            </MenuItem>

            <MenuItem value="staff">
              Faculty
            </MenuItem>
          </Select>
        </FormControl>

        {/* Name */}
        <TextField
          fullWidth
          label={
            formData.role === "staff"
              ? "Faculty Name"
              : "Student Name"
          }
          name="username"
          value={formData.username}
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

        {/* Student Fields */}
        {formData.role === "student" && (
          <>
            <TextField
              fullWidth
              label="Register Number"
              name="registerNumber"
              value={formData.registerNumber}
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

            <FormControl
              fullWidth
              sx={{
                mb: 2,
              }}
            >
              <InputLabel>Academic Batch</InputLabel>

              <Select
                name="batch"
                value={formData.batch}
                label="Academic Batch"
                onChange={handleChange}
                required
                sx={{
                  borderRadius: 2,
                  backgroundColor: "#fbfdff",
                }}
              >
                <MenuItem value="">
                  <em>Select Batch</em>
                </MenuItem>

                <MenuItem value="2023-2027">
                  2023-2027
                </MenuItem>

                <MenuItem value="2024-2028">
                  2024-2028
                </MenuItem>

                <MenuItem value="2025-2029">
                  2025-2029
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl
              fullWidth
              sx={{
                mb: 2,
              }}
            >
              <InputLabel>Gender</InputLabel>

              <Select
                name="gender"
                value={formData.gender}
                label="Gender"
                onChange={handleChange}
                required
                sx={{
                  borderRadius: 2,
                  backgroundColor: "#fbfdff",
                }}
              >
                <MenuItem value="">
                  <em>Select Gender</em>
                </MenuItem>

                <MenuItem value="Male">
                  Male
                </MenuItem>

                <MenuItem value="Female">
                  Female
                </MenuItem>

                <MenuItem value="Other">
                  Other
                </MenuItem>
              </Select>
            </FormControl>
          </>
        )}

        {/* Faculty Fields */}
        {formData.role === "staff" && (
          <TextField
            fullWidth
            label="Faculty ID"
            name="facultyId"
            value={formData.facultyId}
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

        {/* Email */}
        <TextField
          fullWidth
          label="Email"
          type="email"
          name="email"
          value={formData.email}
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
            mb: 2,
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

        {/* Confirm Password */}
        <TextField
          fullWidth
          label="Confirm Password"
          type={
            showConfirmPassword
              ? "text"
              : "password"
          }
          name="confirmPassword"
          value={formData.confirmPassword}
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
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  edge="end"
                >
                  {showConfirmPassword ? (
                    <VisibilityOff />
                  ) : (
                    <Visibility />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Sign Up Button */}
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
          Create Account
        </Button>

        {/* Sign In */}
        <Typography
          align="center"
          sx={{
            mt: 3,
            color: "#64748b",
            fontSize: "0.92rem",
          }}
        >
          Already have an account?{" "}

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

export default SignupForm;