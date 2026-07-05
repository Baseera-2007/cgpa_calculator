import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
} from "@mui/material";

function SignupForm() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    department: "",
    registerNumber: "",
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
      alert("Passwords do not match.");
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
            register_number: formData.registerNumber,
            email: formData.email,
            password: formData.password,
            role: "student",
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

    } catch (error) {
      console.log(error);
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

        <TextField
          fullWidth
          label="Username"
          name="username"
          margin="normal"
          value={formData.username}
          onChange={handleChange}
        />

        <TextField
          fullWidth
          label="Department"
          name="department"
          margin="normal"
          value={formData.department}
          onChange={handleChange}
        />

        <TextField
          fullWidth
          label="Register Number"
          name="registerNumber"
          margin="normal"
          value={formData.registerNumber}
          onChange={handleChange}
        />

        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          margin="normal"
          value={formData.email}
          onChange={handleChange}
        />

        <TextField
          fullWidth
          label="Create Password"
          name="password"
          type="password"
          margin="normal"
          value={formData.password}
          onChange={handleChange}
        />

        <TextField
          fullWidth
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          margin="normal"
          value={formData.confirmPassword}
          onChange={handleChange}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            py: 1.5,
            background: "#1e3a8a",
            fontWeight: "bold",
          }}
        >
          Sign Up
        </Button>

        <Typography
          align="center"
          sx={{ mt: 3 }}
        >
          Already have an account?{" "}
          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: "#1e3a8a",
              fontWeight: "bold",
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