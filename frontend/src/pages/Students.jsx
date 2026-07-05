import { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  Box,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

function Students() {
  const [students, setStudents] = useState([]);

  const loadStudents = async () => {
    const res = await fetch("http://127.0.0.1:8000/students");
    const data = await res.json();
    setStudents(data);
  };

  useEffect(() => {
    loadStudents();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        color="#1e3a8a"
        mb={4}
      >
        Student Records
      </Typography>

      <Grid container spacing={3}>
        {students.map((student) => (
          <Grid item xs={12} md={6} lg={4} key={student.id}>
            <Card
              elevation={6}
              sx={{
                borderRadius: 4,
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-6px)",
                },
              }}
            >
              <CardContent>

                <Box
                  display="flex"
                  justifyContent="center"
                  mb={2}
                >
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: "#1e3a8a",
                    }}
                  >
                    <PersonIcon sx={{ fontSize: 45 }} />
                  </Avatar>
                </Box>

                <Typography
                  align="center"
                  fontWeight="bold"
                  fontSize={22}
                >
                  {student.student_name}
                </Typography>

                <Typography
                  align="center"
                  color="gray"
                  mb={2}
                >
                  {student.register_number}
                </Typography>

                <Chip
                  icon={<SchoolIcon />}
                  label={student.department}
                  color="primary"
                  sx={{ mb: 1 }}
                />

                <Typography mt={2}>
                  <b>Batch :</b> {student.batch}
                </Typography>

                <Typography>
                  <b>Section :</b> {student.section}
                </Typography>

                <Typography>
                  <b>Semester :</b> {student.current_semester}
                </Typography>

                <Typography
                  fontWeight="bold"
                  color="green"
                  mt={1}
                >
                  CGPA : {student.current_cgpa}
                </Typography>

                <Box
                  display="flex"
                  gap={2}
                  mt={3}
                >
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<EditIcon />}
                    sx={{
                      bgcolor: "#1976d2",
                    }}
                  >
                    Edit
                  </Button>

                  <Button
                    fullWidth
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon />}
                  >
                    Delete
                  </Button>
                </Box>

              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Students;