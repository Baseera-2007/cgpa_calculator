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
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignin = (e) => {
    e.preventDefault();

    // Backend Login API will be connected later

    if (formData.role === "staff") {
      navigate("/staff");
    } else {
      navigate("/student");
    }
  };

  return (
    <Paper
      elevation={5}
      sx={{
        width: 450,
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
        Sign In
      </Typography>

      <Box component="form" onSubmit={handleSignin}>

        <FormControl fullWidth margin="normal">
          <InputLabel>Login As</InputLabel>

          <Select
            name="role"
            label="Login As"
            value={formData.role}
            onChange={handleChange}
          >
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
          label="Password"
          type={showPassword ? "text" : "password"}
          name="password"
          value={formData.password}
          onChange={handleChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
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

        <Button
          fullWidth
          variant="contained"
          type="submit"
          sx={{
            mt: 3,
            py: 1.5,
            background: "#1e3a8a",
            fontWeight: "bold",
          }}
        >
          Sign In
        </Button>

        <Typography
          align="center"
          sx={{ mt: 3 }}
        >
          Don't have an account?{" "}
          <Link
            to="/signup"
            style={{
              textDecoration: "none",
              color: "#1e3a8a",
              fontWeight: "bold",
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