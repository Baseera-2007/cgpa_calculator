import { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Grid,
  Box,
  Avatar,
  Chip,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";

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
    console.log("All Students:", students);
    console.log("Register Number from Login:", registerNumber);

    const currentStudent = students.find(
      (s) => s.register_number === registerNumber
    );

    if (!currentStudent) return;

    // Get full student details
    const response2 = await fetch(
      `http://127.0.0.1:8000/student/${currentStudent.id}`
    );

    const data = await response2.json();
    console.log("Student Details:", data);
    console.log("Semester Results:", data.semester_results);

    setStudent(data);
  };

  if (!student) {
    return <Typography>Loading...</Typography>;
  }

  return (
  <Box sx={{ p: 3 }}>
    {/* Profile Card */}
    <Paper
      elevation={5}
      sx={{
        p: 4,
        borderRadius: 4,
        background: "linear-gradient(135deg,#1e3a8a,#2563eb)",
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
              fontSize: 45,
              mx: "auto",
            }}
          >
            <PersonIcon fontSize="large" />
          </Avatar>
        </Grid>

        <Grid item xs={12} md={7}>
          <Typography variant="h4" fontWeight="bold">
            {student.student_name}
          </Typography>

          <Typography sx={{ mt: 1 }}>
            Register No : {student.register_number}
          </Typography>

          <Typography>
            Department : {student.department}
          </Typography>

          <Typography>
            Batch : {student.batch}
          </Typography>

          <Typography sx={{ mt: 0.5 }}>
            Section : A
          </Typography>

          <Typography
            sx={{
            mt: 2,
            fontSize: "22px",
            fontWeight: "bold",
            color: "#FFD54F",
            }}>
            CGPA : {student.current_cgpa}
          </Typography>
        </Grid>
      </Grid>
    </Paper>

    {/* Semester Results */}
    <Paper
      elevation={4}
      sx={{
        p: 4,
        borderRadius: 4,
      }}
    >
      <Box
  sx={{
    display: "flex",
    alignItems: "center",
    gap: 1,
    mb: 3,
    pb: 2,
    borderBottom: "2px solid #E5E7EB",
  }}
>
  <SchoolIcon
    sx={{
      color: "#1e3a8a",
      fontSize: 34,
    }}
  />

  <Typography
    sx={{
      fontSize: "28px",
      fontWeight: "bold",
      color: "#1e3a8a",
      fontFamily: "Poppins",
    }}
  >
    Semester Performance
  </Typography>
</Box>

      {[1,2,3,4,5,6,7,8].map((semester)=>{

        const result = student.semester_results.find(
          (sem)=>sem.semester===semester
        );

        return(
          <Paper
            key={semester}
            elevation={2}
            sx={{
              p:2,
              mb:2,
              borderRadius:3,
              display:"flex",
              justifyContent:"space-between",
              alignItems:"center",
              transition:"0.3s",
              "&:hover":{
                transform:"scale(1.01)",
              }
            }}
          >
            <Box sx={{display:"flex",alignItems:"center",gap:2}}>
              <AssignmentTurnedInIcon
                color={result ? "success":"disabled"}
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

    </Paper>
  </Box>
);
}

export default StudentProfile;