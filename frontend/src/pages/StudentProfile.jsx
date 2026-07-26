import { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Grid,
  Box,
  Avatar,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";

function StudentProfile() {

  const [student, setStudent] = useState(null);

const [openSGPA, setOpenSGPA] = useState(false);
const [openBacklogs, setOpenBacklogs] = useState(false);
const [selectedSemester, setSelectedSemester] = useState(null);

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
            CGPA : {Number(student.current_cgpa).toFixed(3)}
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
  <Box
    sx={{
      display: "flex",
      gap: 1,
      alignItems: "center",
    }}
  >
    <Button
      variant="contained"
      color="success"
      onClick={() => {
        setSelectedSemester(result);
        setOpenSGPA(true);
      }}
      sx={{
        borderRadius: 5,
        textTransform: "none",
        fontWeight: "bold",
      }}
    >
      SGPA : {Number(result.sgpa).toFixed(3)}
    </Button>

    <Button
      variant="contained"
      color="error"
      onClick={() => {
        setSelectedSemester(result);
        setOpenBacklogs(true);
      }}
      sx={{
        borderRadius: 5,
        textTransform: "none",
        fontWeight: "bold",
      }}
    >
      Backlogs : {
        result.subjects.filter((sub) => {
  const grade = sub.grade?.trim().toUpperCase();

  return (
    grade === "RA" ||
    grade === "U" ||
    grade === "F" ||
    grade === "FAIL"
  );
}).length
      }
    </Button>
  </Box>
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

<Dialog
open={openSGPA}
onClose={() => setOpenSGPA(false)}
maxWidth="md"
fullWidth
>

<DialogTitle>

Semester {selectedSemester?.semester} Grade Details

</DialogTitle>

<DialogContent>

<Table>

<TableHead
  sx={{
    "& .MuiTableCell-head": {
      backgroundColor: "#2563eb",
      color: "#ffffff",
      fontWeight: "bold",
      fontSize: 15,
    },
  }}
>

<TableRow>

<TableCell><b>Subject Code</b></TableCell>

<TableCell><b>Subject Name</b></TableCell>

<TableCell><b>Grade</b></TableCell>

</TableRow>

</TableHead>

<TableBody>

{selectedSemester?.subjects.map((sub,index)=>(

<TableRow key={index}>

<TableCell>{sub.subject_code}</TableCell>

<TableCell>{sub.subject_name}</TableCell>

<TableCell>{sub.grade}</TableCell>

</TableRow>

))}

</TableBody>

</Table>

</DialogContent>

<DialogActions>

<Button
  variant="contained"
  color="error"
  onClick={() => setOpenSGPA(false)}
  sx={{
    borderRadius: 2,
    px: 3,
    textTransform: "none",
    fontWeight: "bold",
  }}
>
  Close
</Button>

</DialogActions>

</Dialog>

<Dialog
open={openBacklogs}
onClose={()=>setOpenBacklogs(false)}
maxWidth="md"
fullWidth
>

<DialogTitle>

Backlog Details

</DialogTitle>

<DialogContent>

<Table>

<TableHead
  sx={{
    "& .MuiTableCell-head": {
      backgroundColor: "#2563eb",
      color: "#ffffff",
      fontWeight: "bold",
      fontSize: 15,
    },
  }}
>


<TableRow>

<TableCell><b>Subject Code</b></TableCell>

<TableCell><b>Subject Name</b></TableCell>

<TableCell><b>Status</b></TableCell>

</TableRow>

</TableHead>

<TableBody>

{selectedSemester?.subjects
.filter((sub) => {
  const grade = sub.grade?.trim().toUpperCase();

  return (
    grade === "RA" ||
    grade === "U" ||
    grade === "F" ||
    grade === "FAIL"
  );
})
.length===0 ? (

<TableRow>

<TableCell colSpan={3} align="center">

No Backlogs Found 🎉

</TableCell>

</TableRow>

) : (

selectedSemester?.subjects
.filter(
sub =>
sub.grade==="RA" ||
sub.grade==="U" ||
sub.grade==="F"
)
.map((sub,index)=>(

<TableRow key={index}>

<TableCell>{sub.subject_code}</TableCell>

<TableCell>{sub.subject_name}</TableCell>

<TableCell>{sub.grade}</TableCell>

</TableRow>

))

)}

</TableBody>

</Table>

</DialogContent>

<DialogActions>

<Button
  variant="contained"
  color="error"
  onClick={() => setOpenBacklogs(false)}
  sx={{
    borderRadius: 2,
    px: 3,
    textTransform: "none",
    fontWeight: "bold",
  }}
>
  Close
</Button>

</DialogActions>

</Dialog>

</Box>
);
}

export default StudentProfile;