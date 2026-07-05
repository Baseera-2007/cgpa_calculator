import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";

import DescriptionIcon from "@mui/icons-material/Description";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function UploadResult() {
  const navigate = useNavigate();

  const [batch, setBatch] = useState("");
  const [semester, setSemester] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!batch || !semester || !selectedFile) {
      alert("Please select Batch, Semester and PDF.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("file", selectedFile);
      formData.append("batch", batch);
      formData.append("semester", semester);

      const response = await fetch(
        "http://127.0.0.1:8000/upload-pdf",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Upload Failed");
        setLoading(false);
        return;
      }

      alert("Result Uploaded Successfully!");

// Student profile-ku redirect
navigate("/student/profile");

    } catch (error) {
      console.error(error);
      alert("Cannot connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 2,
        }}
      >
        <DescriptionIcon
          sx={{
            fontSize: 45,
            color: "#1e3a8a",
          }}
        />

        <Typography
          variant="h3"
          sx={{
            color: "#1e3a8a",
            fontWeight: "bold",
          }}
        >
          Upload Semester Result
        </Typography>
      </Box>

      <Typography
        sx={{
          color: "#555",
          fontSize: "17px",
          mb: 4,
        }}
      >
        Upload the official Anna University Result PDF. The system
        automatically extracts student grades, calculates SGPA &
        CGPA and stores them in PostgreSQL.
      </Typography>

      <Paper
        elevation={4}
        sx={{
          p: 5,
          borderRadius: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 3,
            mb: 4,
            flexWrap: "wrap",
          }}
        >
          <FormControl sx={{ minWidth: 220 }}>
            <InputLabel>Batch</InputLabel>

            <Select
              value={batch}
              label="Batch"
              onChange={(e) => setBatch(e.target.value)}
            >
              <MenuItem value="2023-2027">2023-2027</MenuItem>
              <MenuItem value="2024-2028">2024-2028</MenuItem>
              <MenuItem value="2025-2029">2025-2029</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 220 }}>
            <InputLabel>Semester</InputLabel>

            <Select
              value={semester}
              label="Semester"
              onChange={(e) => setSemester(e.target.value)}
            >
              <MenuItem value="1">Semester 1</MenuItem>
              <MenuItem value="2">Semester 2</MenuItem>
              <MenuItem value="3">Semester 3</MenuItem>
              <MenuItem value="4">Semester 4</MenuItem>
              <MenuItem value="5">Semester 5</MenuItem>
              <MenuItem value="6">Semester 6</MenuItem>
              <MenuItem value="7">Semester 7</MenuItem>
              <MenuItem value="8">Semester 8</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Paper
          variant="outlined"
          sx={{
            border: "2px dashed #1e3a8a",
            borderRadius: 3,
            background: "#f8f9fc",
            textAlign: "center",
            p: 6,
          }}
        >
          <CloudUploadIcon
            sx={{
              fontSize: 70,
              color: "#1e3a8a",
            }}
          />

          <Typography variant="h4" sx={{ mt: 2 }}>
            Drag & Drop Result PDF Here
          </Typography>

          <Typography sx={{ my: 2 }}>
            OR
          </Typography>

          <Button
            variant="contained"
            component="label"
            sx={{
              background: "#1e3a8a",
              px: 5,
              py: 1.5,
            }}
          >
            Choose PDF

            <input
              hidden
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
            />
          </Button>

          {selectedFile && (
            <Box
              sx={{
                mt: 4,
                borderTop: "1px solid #ddd",
                pt: 3,
              }}
            >
              <Typography
                sx={{
                  color: "green",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 1,
                  fontWeight: "bold",
                }}
              >
                <CheckCircleIcon />
                Selected File : {selectedFile.name}
              </Typography>

              <Button
                variant="contained"
                color="success"
                sx={{
                  mt: 3,
                  px: 5,
                  py: 1.5,
                }}
                onClick={handleUpload}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <CircularProgress
                      size={22}
                      color="inherit"
                      sx={{ mr: 1 }}
                    />
                    Uploading...
                  </>
                ) : (
                  "Upload Result"
                )}
              </Button>
            </Box>
          )}
        </Paper>
      </Paper>
    </div>
  );
}

export default UploadResult;