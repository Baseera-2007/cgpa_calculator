import { useEffect, useState } from "react";

import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Box,
  Grid,
  Avatar,
  Divider,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";

function Students() {

  const [students, setStudents] = useState([]);
  const [batch, setBatch] = useState("2024-2028");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const response = await fetch("http://127.0.0.1:8000/students");
    const data = await response.json();
    setStudents(data);
  };

  const filteredStudents = students.filter(
    (student) => student.batch === batch
  );

  const handleView = async (id) => {
    const response = await fetch(
      `http://127.0.0.1:8000/student/${id}`
    );

    const data = await response.json();

    setSelectedStudent(data);
    setOpen(true);
  };

  return (
    <Paper
      sx={{
        p: 4,
        borderRadius: 4,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          color: "#1e3a8a",
          fontWeight: "bold",
          mb: 3,
        }}
      >
        Students
      </Typography>

      <FormControl
        sx={{
          width: 250,
          mb: 3,
        }}
      >
        <InputLabel>Select Batch</InputLabel>

        <Select
          value={batch}
          label="Select Batch"
          onChange={(e) => setBatch(e.target.value)}
        >
          <MenuItem value="2023-2027">
            2023-2027
          </MenuItem>

          <MenuItem value="2024-2028">
            2024-2028
          </MenuItem>

          <MenuItem value="2025-2029">
            2025-2029
          </MenuItem>

        </Select>
      </FormControl>

      <TableContainer component={Paper} elevation={3}>
        <Table>

          <TableHead
            sx={{
              background: "#1e3a8a",
            }}
          >
            <TableRow>

              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Name
              </TableCell>

              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Register No
              </TableCell>

              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Department
              </TableCell>

              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                CGPA
              </TableCell>

              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Action
              </TableCell>

            </TableRow>
          </TableHead>

          <TableBody>

            {filteredStudents.map((student) => (
              <TableRow key={student.id} hover>

                <TableCell>{student.student_name}</TableCell>

                <TableCell>{student.register_number}</TableCell>

                <TableCell>{student.department}</TableCell>

                <TableCell>{student.current_cgpa}</TableCell>

                <TableCell>
                  <Button
                    variant="contained"
                    onClick={() => handleView(student.id)}
                  >
                    View
                  </Button>
                </TableCell>

              </TableRow>
            ))}

          </TableBody>

        </Table>
      </TableContainer>
            {/* Student Details Dialog */}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            fontSize: 28,
            fontWeight: "bold",
            color: "#1e3a8a",
          }}
        >
          Student Details
        </DialogTitle>

        <DialogContent sx={{ p: 4 }}>

          {selectedStudent && (

            <>

              {/* Profile Card */}

              <Paper
                elevation={5}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  background:
                    "linear-gradient(135deg,#1e3a8a,#2563eb)",
                  color: "#fff",
                  mb: 4,
                }}
              >

                <Grid container spacing={3} alignItems="center">

                  <Grid item xs={12} md={2}>

                    <Avatar
                      sx={{
                        width: 100,
                        height: 100,
                        bgcolor: "#fff",
                        color: "#1e3a8a",
                        mx: "auto",
                      }}
                    >
                      <PersonIcon sx={{ fontSize: 50 }} />
                    </Avatar>

                  </Grid>

                  <Grid item xs={12} md={10}>

                    <Typography
                      variant="h4"
                      fontWeight="bold"
                    >
                      {selectedStudent.student_name}
                    </Typography>

                    <Typography sx={{ mt: 2 }}>
                      Register No :
                      {" "}
                      {selectedStudent.register_number}
                    </Typography>

                    <Typography>
                      Department :
                      {" "}
                      {selectedStudent.department}
                    </Typography>

                    <Typography>
                      Batch :
                      {" "}
                      {selectedStudent.batch}
                    </Typography>

                    <Typography>
                      Section : A
                    </Typography>

                    <Typography
                      sx={{
                        mt: 2,
                        fontSize: 24,
                        fontWeight: "bold",
                        color: "#FFD54F",
                      }}
                    >
                      CGPA :
                      {" "}
                      {selectedStudent.current_cgpa}
                    </Typography>

                  </Grid>

                </Grid>

              </Paper>

              {/* Semester Heading */}

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 3,
                  pb: 2,
                  borderBottom:
                    "2px solid #E5E7EB",
                }}
              >

                <SchoolIcon
                  sx={{
                    color: "#1e3a8a",
                    fontSize: 32,
                  }}
                />

                <Typography
                  sx={{
                    fontSize: 28,
                    fontWeight: "bold",
                    color: "#1e3a8a",
                  }}
                >
                  Semester Performance
                </Typography>

              </Box>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((semester) => {

                const result = selectedStudent.semester_results.find(
                  (sem) => sem.semester === semester
                );

                return (

                  <Paper
                    key={semester}
                    elevation={2}
                    sx={{
                      p: 2,
                      mb: 2,
                      borderRadius: 3,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      transition: "0.3s",
                      "&:hover": {
                        transform: "scale(1.01)",
                      },
                    }}
                  >

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >

                      <AssignmentTurnedInIcon
                        color={result ? "success" : "disabled"}
                      />

                      <Typography fontWeight="bold">
                        Semester {semester}
                      </Typography>

                    </Box>

                    {result ? (

                      <Chip
                        label={`SGPA : ${result.sgpa}`}
                        color="success"
                      />

                    ) : (

                      <Chip
                        label="Not Uploaded"
                        color="default"
                      />

                    )}

                  </Paper>

                );

              })}

            </>

          )}

        </DialogContent>

        <DialogActions>

          <Button
            variant="contained"
            color="error"
            onClick={() => setOpen(false)}
          >
            Close
          </Button>

        </DialogActions>

      </Dialog>

    </Paper>

  );

}

export default Students;