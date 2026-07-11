import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TableViewIcon from "@mui/icons-material/TableView";

function Reports() {
  const [students, setStudents] = useState([]);
  const [batch, setBatch] = useState("2024-2028");
  const [cgpaFilter, setCgpaFilter] = useState("all");
  const [sort, setSort] = useState("desc");

  useEffect(() => {
    fetchStudents();
  }, [batch, cgpaFilter, sort]);

  const fetchStudents = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/report?batch=${batch}&filter=${cgpaFilter}&sort=${sort}`
      );

      const data = await response.json();
      setStudents(data);
    } catch (err) {
      console.log(err);
    }
  };

  const generatePDF = () => {
    window.open(
      `http://127.0.0.1:8000/export-pdf?batch=${batch}`,
      "_blank"
    );
  };

  const generateExcel = () => {
    window.open(
      `http://127.0.0.1:8000/export-excel?batch=${batch}`,
      "_blank"
    );
  };
    return (
    <Box sx={{ p: 4 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h4" fontWeight="bold" color="#1e3a8a">
          Academic Report Generator
        </Typography>

        <Typography sx={{ color: "#666", mt: 1, mb: 4 }}>
          Generate PDF and Excel reports batch-wise.
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 3,
            mb: 4,
          }}
        >
          <FormControl fullWidth>
            <InputLabel>Batch</InputLabel>

            <Select
              value={batch}
              label="Batch"
              onChange={(e) => setBatch(e.target.value)}
            >
              <MenuItem value="2023-2027">2023-2027</MenuItem>
              <MenuItem value="2024-2028">2024-2028</MenuItem>
              <MenuItem value="2025-2029">2025-2029</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>CGPA Filter</InputLabel>

            <Select
              value={cgpaFilter}
              label="CGPA Filter"
              onChange={(e) => setCgpaFilter(e.target.value)}
            >
              <MenuItem value="all">All Students</MenuItem>
              <MenuItem value="9">Above 9</MenuItem>
              <MenuItem value="8.5">Above 8.5</MenuItem>
              <MenuItem value="8">Above 8</MenuItem>
              <MenuItem value="7.5">Above 7.5</MenuItem>
              <MenuItem value="below7.5">Below 7.5</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Sort</InputLabel>

            <Select
              value={sort}
              label="Sort"
              onChange={(e) => setSort(e.target.value)}
            >
              <MenuItem value="desc">Highest CGPA</MenuItem>
              <MenuItem value="asc">Lowest CGPA</MenuItem>
              <MenuItem value="name">Student Name</MenuItem>
              <MenuItem value="reg">Register Number</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 3,
            mb: 4,
          }}
        >
          <Button
            variant="contained"
            startIcon={<PictureAsPdfIcon />}
            onClick={generatePDF}
          >
            Generate PDF
          </Button>

          <Button
            variant="contained"
            color="success"
            startIcon={<TableViewIcon />}
            onClick={generateExcel}
          >
            Generate Excel
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Register No</b></TableCell>
                <TableCell><b>Name</b></TableCell>
                <TableCell><b>Department</b></TableCell>
                <TableCell><b>Batch</b></TableCell>
                <TableCell><b>CGPA</b></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.register_number}</TableCell>
                  <TableCell>{student.student_name}</TableCell>
                  <TableCell>{student.department}</TableCell>
                  <TableCell>{student.batch}</TableCell>
                  <TableCell>{student.current_cgpa}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

export default Reports;