import { Button, Paper, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ResultPreview from "../components/ResultPreview";

function UploadResult() {
  return (
    <>
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          borderRadius: 3,
          marginTop: 3,
        }}
      >
        <Typography variant="h4" fontWeight="bold" color="#1e3a8a">
          Upload Semester Result
        </Typography>

        <Typography sx={{ mt: 2, mb: 3 }}>
          Upload the official semester result PDF. The system will extract
          student grades automatically and generate a preview before importing.
        </Typography>

        <Button
          variant="contained"
          component="label"
          startIcon={<CloudUploadIcon />}
          sx={{
            backgroundColor: "#1e3a8a",
            padding: "10px 25px",
          }}
        >
          Upload Result PDF
          <input hidden accept=".pdf" type="file" />
        </Button>
      </Paper>

      <ResultPreview />
    </>
  );
}

export default UploadResult;