import { useState } from "react";
import {
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
} from "@mui/material";

import DescriptionIcon from "@mui/icons-material/Description";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function UploadResult() {
  const [batch, setBatch] = useState("");
  const [semester, setSemester] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!batch || !semester || !selectedFile) {
      alert("Please select Batch, Semester and PDF.");
      return;
    }

    alert("PDF uploaded successfully!");
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Title */}
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
        automatically extracts student grades, calculates SGPA & CGPA and
        prepares the data for database import.
      </Typography>

      {/* Main Card */}
      <Paper
        elevation={4}
        sx={{
          p: 5,
          borderRadius: 4,
        }}
      >
        {/* Batch & Semester */}
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

        {/* Upload Area */}
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

          <Typography sx={{ my: 2 }}>OR</Typography>

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
            <>
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
                >
                  Upload Result
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </Paper>
    </div>
  );
}

export default UploadResult;