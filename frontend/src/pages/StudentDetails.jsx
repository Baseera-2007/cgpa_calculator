import { useLocation } from "react-router-dom";
import {
  Paper,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
} from "@mui/material";

import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

function StudentDetails() {
  const { state } = useLocation();

  const student = state || {
    regNo: "921723104001",
    name: "Aisha",
    batch: "2023-2027",
    cgpa: "9.12",
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Page Title */}
      <Typography
        variant="h4"
        sx={{
          color: "#1e3a8a",
          fontWeight: "bold",
          mb: 3,
        }}
      >
        👨‍🎓 Student Academic Profile
      </Typography>

      {/* Student Information */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          mb: 3,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "#1e3a8a",
            fontWeight: "bold",
            mb: 3,
          }}
        >
          Student Information
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography>
              <b>Name :</b> {student.name}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>
              <b>Register Number :</b> {student.regNo}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>
              <b>Department :</b> CSBS
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>
              <b>Batch :</b> {student.batch}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>
              <b>Section :</b> A
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>
              <b>Current CGPA :</b> {student.cgpa}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Academic Summary */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          mb: 3,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "#1e3a8a",
            fontWeight: "bold",
            mb: 3,
          }}
        >
          Academic Summary
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                background: "#f5f7fb",
                p: 3,
                borderRadius: 2,
                textAlign: "center",
              }}
            >
              <Typography variant="h6">Highest SGPA</Typography>

              <Typography
                variant="h4"
                sx={{
                  color: "#1e3a8a",
                  fontWeight: "bold",
                }}
              >
                9.12
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box
              sx={{
                background: "#f5f7fb",
                p: 3,
                borderRadius: 2,
                textAlign: "center",
              }}
            >
              <Typography variant="h6">Lowest SGPA</Typography>

              <Typography
                variant="h4"
                sx={{
                  color: "#1e3a8a",
                  fontWeight: "bold",
                }}
              >
                8.80
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box
              sx={{
                background: "#f5f7fb",
                p: 3,
                borderRadius: 2,
                textAlign: "center",
              }}
            >
              <Typography variant="h6">Current CGPA</Typography>

              <Typography
                variant="h4"
                sx={{
                  color: "#1e3a8a",
                  fontWeight: "bold",
                }}
              >
                {student.cgpa}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Semester Results */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "#1e3a8a",
            fontWeight: "bold",
            mb: 3,
          }}
        >
          Semester-wise Performance
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ background: "#1e3a8a" }}>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Semester
                </TableCell>

                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  SGPA
                </TableCell>

                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Result PDF
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              <TableRow>
                <TableCell>Semester 1</TableCell>
                <TableCell>9.12</TableCell>
                <TableCell>
                  <Button startIcon={<PictureAsPdfIcon />} variant="outlined">
                    View PDF
                  </Button>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Semester 2</TableCell>
                <TableCell>8.94</TableCell>
                <TableCell>
                  <Button startIcon={<PictureAsPdfIcon />} variant="outlined">
                    View PDF
                  </Button>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Semester 3</TableCell>
                <TableCell>8.80</TableCell>
                <TableCell>
                  <Button startIcon={<PictureAsPdfIcon />} variant="outlined">
                    View PDF
                  </Button>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Semester 4</TableCell>
                <TableCell>8.95</TableCell>
                <TableCell>
                  <Button startIcon={<PictureAsPdfIcon />} variant="outlined">
                    View PDF
                  </Button>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Semester 5</TableCell>
                <TableCell>-</TableCell>
                <TableCell>Not Uploaded</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Semester 6</TableCell>
                <TableCell>-</TableCell>
                <TableCell>Not Uploaded</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Semester 7</TableCell>
                <TableCell>-</TableCell>
                <TableCell>Not Uploaded</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Semester 8</TableCell>
                <TableCell>-</TableCell>
                <TableCell>Not Uploaded</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}

export default StudentDetails;