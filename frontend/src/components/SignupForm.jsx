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
} from "@mui/material";

function SignupForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    department: "",
    role: "",

    registerNumber: "",
    facultyId: "",

    batch: "",
    section: "",
    gender: "",

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

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            username: formData.username,
            department: formData.department,
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

            section:
              formData.role === "student"
                ? formData.section
                : null,

            gender:
              formData.role === "student"
                ? formData.gender
                : null,

            email:
              formData.role === "staff"
                ? formData.email
                : null,

            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Signup Successful 🎉");
        navigate("/");
      } else {
        alert(data.detail);
      }
    } catch (err) {
      console.log(err);
      alert("Server Error");
    }
  };

  return (
    <Paper
      elevation={5}
      sx={{
        width: 500,
        p: 5,
        borderRadius: 4,
      }}
    >
      <Typography
        variant="h4"
        align="center"
        sx={{
          color: "#1e3a8a",
          fontWeight: "bold",
          mb: 4,
        }}
      >
        Sign Up
      </Typography>

      <Box component="form" onSubmit={handleSignup}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Register As</InputLabel>

          <Select
            name="role"
            value={formData.role}
            label="Register As"
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>Select Role</em>
            </MenuItem>

            <MenuItem value="student">Student</MenuItem>

            <MenuItem value="staff">Staff</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          margin="normal"
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Department"
          name="department"
          value={formData.department}
          onChange={handleChange}
        />

        {formData.role === "student" && (
          <>
            <TextField
              fullWidth
              margin="normal"
              label="Register Number"
              name="registerNumber"
              value={formData.registerNumber}
              onChange={handleChange}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Academic Batch</InputLabel>

              <Select
                name="batch"
                value={formData.batch}
                label="Academic Batch"
                onChange={handleChange}
              >
                <MenuItem value="">
                  <em>Select Batch</em>
                </MenuItem>

                <MenuItem value="2023-2027">2023-2027</MenuItem>
                <MenuItem value="2024-2028">2024-2028</MenuItem>
                <MenuItem value="2025-2029">2025-2029</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Lab Batch</InputLabel>

              <Select
                name="section"
                value={formData.section}
                label="Lab Batch"
                onChange={handleChange}
              >
                <MenuItem value="">
                  <em>Select Lab Batch</em>
                </MenuItem>

                <MenuItem value="Batch 1">Batch 1</MenuItem>
                <MenuItem value="Batch 2">Batch 2</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Gender</InputLabel>

              <Select
                name="gender"
                value={formData.gender}
                label="Gender"
                onChange={handleChange}
              >
                <MenuItem value="">
                  <em>Select Gender</em>
                </MenuItem>

                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </>
        )}

        {formData.role === "staff" && (
          <>
            <TextField
              fullWidth
              margin="normal"
              label="Faculty ID"
              name="facultyId"
              value={formData.facultyId}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </>
        )}

        <TextField
          fullWidth
          margin="normal"
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
        />

        <Button
          fullWidth
          variant="contained"
          type="submit"
          sx={{
            mt: 3,
            py: 1.5,
            background: "#1e3a8a",
            "&:hover": {
              background: "#163172",
            },
          }}
        >
          Sign Up
        </Button>

        <Typography align="center" sx={{ mt: 3 }}>
          Already have an account?{" "}
          <Link to="/">Sign In</Link>
        </Typography>
      </Box>
    </Paper>
  );
}

export default SignupForm;