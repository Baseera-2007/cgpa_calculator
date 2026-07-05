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
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
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

          <Typography>
            Section : {student.section}
          </Typography>

          <Typography>
            Current Semester : Semester {student.current_semester}
          </Typography>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper
            sx={{
              p: 3,
              textAlign: "center",
              borderRadius: 3,
              bgcolor: "#fff",
            }}
          >
            <WorkspacePremiumIcon
              sx={{
                color: "#FFD700",
                fontSize: 50,
              }}
            />

            <Typography
              sx={{
                color: "#444",
                mt: 1,
              }}
            >
              Current CGPA
            </Typography>

            <Typography
              variant="h3"
              fontWeight="bold"
              color="green"
            >
              {student.current_cgpa}
            </Typography>
          </Paper>
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
      <Typography
        variant="h5"
        fontWeight="bold"
        color="#1e3a8a"
        mb={3}
      >
        <SchoolIcon sx={{ mr: 1 }} />
        Semester Performance
      </Typography>

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