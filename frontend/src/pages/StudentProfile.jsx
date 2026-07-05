import { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Grid,
  Divider,
} from "@mui/material";

function StudentProfile() {

  const [student, setStudent] = useState(null);

  const registerNumber = localStorage.getItem("register_number");

  useEffect(() => {
    fetchStudent();
  }, []);

  const fetchStudent = async () => {

    // Get all students
    const response = await fetch("http://127.0.0.1:8000/students");

    const students = await response.json();

    const currentStudent = students.find(
      (s) => s.register_number === registerNumber
    );

    if (!currentStudent) return;

    // Get full student details
    const response2 = await fetch(
      `http://127.0.0.1:8000/student/${currentStudent.id}`
    );

    const data = await response2.json();

    setStudent(data);
  };

  if (!student) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Paper
      sx={{
        p: 4,
        borderRadius: 3,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          color: "#1e3a8a",
          fontWeight: "bold",
        }}
      >
        My Profile
      </Typography>

      <Grid container spacing={2}>

        <Grid item xs={6}>
          <Typography><b>Name :</b> {student.student_name}</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography><b>Register No :</b> {student.register_number}</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography><b>Department :</b> {student.department}</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography><b>Batch :</b> {student.batch}</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography><b>Section :</b> {student.section}</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography><b>Current Semester :</b> {student.current_semester}</Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography
            sx={{
              fontSize: 24,
              color: "green",
              fontWeight: "bold",
            }}
          >
            CGPA : {student.current_cgpa}
          </Typography>
        </Grid>

      </Grid>

      <Divider sx={{ my: 4 }} />

      <Typography
        variant="h5"
        sx={{
          mb: 2,
          color: "#1e3a8a",
          fontWeight: "bold",
        }}
      >
        Semester Results
      </Typography>

      {student.semester_results.map((sem) => (
        <Paper
          key={sem.semester}
          sx={{
            p: 2,
            mb: 3,
            background: "#f8fafc",
          }}
        >
          <Typography variant="h6">
            Semester {sem.semester}
          </Typography>

          <Typography
            sx={{
              mb: 2,
            }}
          >
            SGPA : {sem.sgpa}
          </Typography>

          {sem.subjects.map((sub) => (
            <Typography key={sub.subject_code}>
              {sub.subject_code} - {sub.subject_name} ({sub.grade})
            </Typography>
          ))}
        </Paper>
      ))}

    </Paper>
  );
}

export default StudentProfile;