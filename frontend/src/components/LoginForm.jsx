import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
} from "@mui/material";

function LoginForm() {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail);
        return;
      }

      console.log(data);

      // Save Login Details
      localStorage.setItem("username", data.username);
      localStorage.setItem("role", data.role);
      localStorage.setItem(
        "register_number",
        data.register_number
      );

      // Check immediately
      console.log(
        "Saved Register Number :",
        localStorage.getItem("register_number")
      );

      alert("Login Successful 🎉");

      if (data.role === "staff") {
        navigate("/home");
      } else {
        navigate("/upload-results");
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
        width: 420,
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

      <Box component="form" onSubmit={handleLogin}>

        <TextField
          fullWidth
          label="Username"
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <TextField
          fullWidth
          type="password"
          label="Password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            py: 1.5,
            background: "#1e3a8a",
          }}
        >
          Sign In
        </Button>

        <Typography
          align="center"
          sx={{ mt: 3 }}
        >
          Don't have an account?{" "}
          <Link to="/signup">
            Sign Up
          </Link>
        </Typography>

      </Box>
    </Paper>
  );
}

export default LoginForm;