import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Paper,
  Typography,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";

import DescriptionIcon from "@mui/icons-material/Description";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function UploadResult() {
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please choose a PDF.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("file", selectedFile);

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
        mb: 3,
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
      Upload your official semester result PDF. The system will automatically
      extract your semester, subjects, SGPA and update your CGPA.
    </Typography>

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
    </div>
  );
}

export default UploadResult;