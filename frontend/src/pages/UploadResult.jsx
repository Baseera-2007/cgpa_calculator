import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Paper,
  Typography,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";

import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";

function UploadResult() {
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // ==========================================================
  // FILE SELECTION
  // ==========================================================

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // ==========================================================
  // UPLOAD RESULT
  // ==========================================================

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
        "/api/upload-pdf",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Upload Failed");
        return;
      }

      alert("Result Uploaded Successfully 🎉");

      navigate("/student/profile");
    } catch (error) {
      console.error(error);
      alert("Cannot connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      {/* PAGE HEADER */}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          mb: 1,
        }}
      >
        <DescriptionOutlinedIcon
          sx={{
            fontSize: 34,
            color: "#1e3a8a",
          }}
        />

        <Typography
          sx={{
            fontSize: {
              xs: "24px",
              md: "28px",
            },
            fontWeight: "bold",
            color: "#1e3a8a",
          }}
        >
          Upload Semester Result
        </Typography>
      </Box>

      {/* DESCRIPTION */}

      <Typography
        sx={{
          color: "#64748b",
          fontSize: "14px",
          lineHeight: 1.6,
          mb: 3,
          maxWidth: "800px",
        }}
      >
        Upload your official semester result PDF. The system will
        automatically extract your semester, subjects, grades, SGPA
        and update your CGPA.
      </Typography>

      {/* UPLOAD CARD */}

      <Paper
        elevation={2}
        sx={{
          border: "2px dashed #93c5fd",
          borderRadius: 4,
          backgroundColor: "#ffffff",
          textAlign: "center",
          p: {
            xs: 3,
            md: 5,
          },
          maxWidth: "900px",
          mx: "auto",
        }}
      >
        {/* ICON */}

        <Box
          sx={{
            width: 70,
            height: 70,
            borderRadius: "50%",
            backgroundColor: "#eff6ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
          }}
        >
          <CloudUploadOutlinedIcon
            sx={{
              fontSize: 38,
              color: "#2563eb",
            }}
          />
        </Box>

        {/* TITLE */}

        <Typography
          sx={{
            mt: 2,
            fontSize: {
              xs: "20px",
              md: "22px",
            },
            fontWeight: "bold",
            color: "#1e293b",
          }}
        >
          Upload Result PDF
        </Typography>

        {/* SMALL DESCRIPTION */}

        <Typography
          sx={{
            mt: 0.8,
            color: "#64748b",
            fontSize: "13px",
          }}
        >
          Select the semester result PDF from your device
        </Typography>

        {/* CHOOSE PDF */}

        <Button
          variant="contained"
          component="label"
          sx={{
            mt: 3,
            px: 4,
            py: 1.2,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: "bold",
            fontSize: "14px",
            backgroundColor: "#1e3a8a",
            "&:hover": {
              backgroundColor: "#1e40af",
            },
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

        {/* SELECTED FILE */}

        {selectedFile && (
          <Box
            sx={{
              mt: 3,
              pt: 2.5,
              borderTop: "1px solid #e2e8f0",
            }}
          >
            <Typography
              sx={{
                color: "#16a34a",
                fontSize: "14px",
                fontWeight: "bold",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 0.8,
                wordBreak: "break-word",
              }}
            >
              <CheckCircleOutlinedIcon
                sx={{ fontSize: 20 }}
              />

              {selectedFile.name}
            </Typography>

            {/* UPLOAD BUTTON */}

            <Button
              variant="contained"
              color="success"
              sx={{
                mt: 2.5,
                px: 4,
                py: 1.2,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: "bold",
                fontSize: "14px",
              }}
              onClick={handleUpload}
              disabled={loading}
            >
              {loading ? (
                <>
                  <CircularProgress
                    size={20}
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
    </Box>
  );
}

export default UploadResult;