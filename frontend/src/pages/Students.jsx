import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Paper,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
} from "@mui/material";

const studentsData = [
  {
    regNo: "921723104001",
    name: "Aisha",
    batch: "2023-2027",
    cgpa: "9.12",
  },
  {
    regNo: "921723104002",
    name: "Rahul",
    batch: "2023-2027",
    cgpa: "8.87",
  },
  {
    regNo: "921723104003",
    name: "Priya",
    batch: "2023-2027",
    cgpa: "9.44",
  },
  {
    regNo: "921723104004",
    name: "Arun",
    batch: "2023-2027",
    cgpa: "8.66",
  },
];

function Students() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const filteredStudents = studentsData.filter(
    (student) =>
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.regNo.includes(search)
  );

  return (
    <div style={{ padding: "20px" }}>
      <Typography
        variant="h4"
        sx={{
          color: "#1e3a8a",
          fontWeight: "bold",
          mb: 3,
        }}
      >
        👨‍🎓 Students
      </Typography>

      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <TextField
            label="Search Student"
            placeholder="Enter Register No or Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: 350 }}
          />

          <Typography
            sx={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#1e3a8a",
            }}
          >
            Total Students : {filteredStudents.length}
          </Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ background: "#1e3a8a" }}>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Register No
                </TableCell>

                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Student Name
                </TableCell>

                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Batch
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
                <TableRow key={student.regNo} hover>
                  <TableCell>{student.regNo}</TableCell>

                  <TableCell>{student.name}</TableCell>

                  <TableCell>{student.batch}</TableCell>

                  <TableCell>{student.cgpa}</TableCell>

                  <TableCell>
                    <Button
                      variant="contained"
                      sx={{
                        background: "#1e3a8a",
                      }}
                      onClick={() =>
                        navigate("/student-details", {
                          state: student,
                        })
                      }
                    >
                      VIEW
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}

export default Students;