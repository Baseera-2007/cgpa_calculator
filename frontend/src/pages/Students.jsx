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
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";

function Students() {

  const [batch, setBatch] = useState("2024-2028");

  const [students, setStudents] = useState([]);

  const [selectedStudent, setSelectedStudent] = useState(null);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchStudents(batch);
  }, []);

  const fetchStudents = async (selectedBatch) => {

    const response = await fetch(
      `http://127.0.0.1:8000/students/${selectedBatch}`
    );

    const data = await response.json();

    setStudents(data);

  };

  const handleBatchChange = (e) => {

    setBatch(e.target.value);

    fetchStudents(e.target.value);

  };

  const handleView = async (id) => {

    const response = await fetch(
      `http://127.0.0.1:8000/student/${id}`
    );

    const data = await response.json();

    setSelectedStudent(data);

    setOpen(true);

  };

  const handleClose = () => {

    setOpen(false);

    setSelectedStudent(null);

  };

  return (

    <Box>

      <Typography
        variant="h4"
        sx={{
          mb:3,
          fontWeight:"bold",
          color:"#1e3a8a",
        }}
      >
        👨‍🎓 Students
      </Typography>

      <Paper
        sx={{
          p:3,
          mb:3,
          borderRadius:3,
        }}
      >

        <FormControl
          sx={{
            width:250,
          }}
        >

          <InputLabel>
            Batch
          </InputLabel>

          <Select
            value={batch}
            label="Batch"
            onChange={handleBatchChange}
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

      </Paper>

      <TableContainer component={Paper}>

        <Table>

          <TableHead>

            <TableRow
              sx={{
                background:"#1e3a8a",
              }}
            >

              <TableCell sx={{color:"white",fontWeight:"bold"}}>
                Name
              </TableCell>

              <TableCell sx={{color:"white",fontWeight:"bold"}}>
                Register No
              </TableCell>

              <TableCell sx={{color:"white",fontWeight:"bold"}}>
                Department
              </TableCell>

              <TableCell sx={{color:"white",fontWeight:"bold"}}>
                CGPA
              </TableCell>

              <TableCell
                align="center"
                sx={{color:"white",fontWeight:"bold"}}
              >
                Action
              </TableCell>

            </TableRow>

          </TableHead>

          <TableBody>

            {students.map((student)=>(

              <TableRow
                key={student.id}
                hover
              >

                <TableCell>

                  {student.student_name}

                </TableCell>

                <TableCell>

                  {student.register_number}

                </TableCell>

                <TableCell>

                  {student.department}

                </TableCell>

                <TableCell>

                  <Chip
                    color="success"
                    label={student.current_cgpa}
                  />

                </TableCell>

                <TableCell align="center">

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
            {/* View Student Dialog */}

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
      >
        {selectedStudent && (
          <>

            <DialogTitle
              sx={{
                background: "#1e3a8a",
                color: "white",
                fontWeight: "bold",
                fontSize: 24,
              }}
            >
              👨‍🎓 Student Profile
            </DialogTitle>

            <DialogContent sx={{ p: 4 }}>

              {/* Profile Card */}

              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  mb: 4,
                  background:
                    "linear-gradient(135deg,#1e3a8a,#2563eb)",
                  color: "#fff",
                }}
              >
                <Grid container spacing={3} alignItems="center">

                  <Grid item xs={12} md={2}>

                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        bgcolor: "#fff",
                        color: "#1e3a8a",
                        mx: "auto",
                      }}
                    >
                      <PersonIcon fontSize="large" />
                    </Avatar>

                  </Grid>

                  <Grid item xs={12} md={7}>

                    <Typography variant="h5" fontWeight="bold">
                      {selectedStudent.student_name}
                    </Typography>

                    <Typography sx={{ mt: 1 }}>
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
                      Section :
                      {" "}
                      {selectedStudent.section || "-"}
                    </Typography>

                    <Typography>
                      Current Semester :
                      {" "}
                      {selectedStudent.current_semester}
                    </Typography>

                  </Grid>

                  <Grid item xs={12} md={3}>

                    <Paper
                      sx={{
                        p: 2,
                        textAlign: "center",
                        borderRadius: 3,
                      }}
                    >

                      <WorkspacePremiumIcon
                        sx={{
                          fontSize: 45,
                          color: "#FFD700",
                        }}
                      />

                      <Typography sx={{ mt: 1 }}>
                        Current CGPA
                      </Typography>

                      <Typography
                        variant="h4"
                        fontWeight="bold"
                        color="green"
                      >
                        {selectedStudent.current_cgpa}
                      </Typography>

                    </Paper>

                  </Grid>

                </Grid>

              </Paper>

              {/* Semester Results */}

              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  color: "#1e3a8a",
                  fontWeight: "bold",
                }}
              >
                <SchoolIcon sx={{ mr: 1 }} />
                Semester Wise GPA
              </Typography>

              {selectedStudent.semester_results.length === 0 ? (

                <Typography color="gray">
                  No Results Uploaded
                </Typography>

              ) : (

                selectedStudent.semester_results.map((sem) => (

                  <Paper
                    key={sem.semester}
                    elevation={2}
                    sx={{
                      p: 2,
                      mb: 2,
                      borderRadius: 3,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >

                      <AssignmentTurnedInIcon color="success" />

                      <Typography fontWeight="bold">
                        Semester {sem.semester}
                      </Typography>

                    </Box>

                    <Chip
                      label={`SGPA : ${sem.sgpa}`}
                      color="success"
                    />

                  </Paper>

                ))

              )}

            </DialogContent>

            <DialogActions sx={{ p: 3 }}>

              <Button
                variant="contained"
                color="error"
                onClick={handleClose}
              >
                Close
              </Button>

            </DialogActions>

          </>
        )}

      </Dialog>

    </Box>

  );

}

export default Students;