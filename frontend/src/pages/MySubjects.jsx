import { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  Box,
  Button,
  TextField,
  MenuItem,
  Autocomplete,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Chip,
} from "@mui/material";

import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

function MySubjects() {
  const [batch, setBatch] = useState("");
  const [semester, setSemester] = useState("");

  const [subjects, setSubjects] = useState([]);
  const [subject, setSubject] = useState(null);

  const [mySubjects, setMySubjects] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);

  // ----------------------------------
  // Load Subject Master
  // ----------------------------------
  useEffect(() => {
    if (!semester) return;

    fetch(`http://127.0.0.1:8000/subjects/${semester}`)
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((item) => {
          const parts = item.split(" - ");

          return {
            code: parts[0],
            name: parts.slice(1).join(" - "),
          };
        });

        setSubjects(formatted);
        setSubject(null);
      })
      .catch((error) => {
        console.error("Error loading subjects:", error);
        setSubjects([]);
      });
  }, [semester]);

  // ----------------------------------
  // Load Assigned Subjects
  // ----------------------------------
  useEffect(() => {
    if (!batch || !semester) {
      setMySubjects([]);
      return;
    }

    fetch(
      `http://127.0.0.1:8000/assigned-subjects?batch=${batch}&semester=${semester}`
    )
      .then((res) => res.json())
      .then((data) => {
        setMySubjects(data);
      })
      .catch((error) => {
        console.error("Error loading assigned subjects:", error);
        setMySubjects([]);
      });
  }, [batch, semester]);

  // ----------------------------------
  // Load All Assigned Subjects
  // ----------------------------------
  const loadAllSubjects = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/assigned-subjects/all"
      );

      const data = await response.json();

      setAllSubjects(data);
    } catch (error) {
      console.error("Error loading all subjects:", error);
      setAllSubjects([]);
    }
  };

  useEffect(() => {
    loadAllSubjects();
  }, []);

  // ----------------------------------
  // Add Subject
  // ----------------------------------
  const handleAdd = async () => {
    if (!batch || !semester || !subject) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/assigned-subjects",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            batch,
            semester,
            subject_code: subject.code,
            subject_name: subject.name,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Unable to add subject.");
        return;
      }

      alert("Subject Added Successfully");

      const updated = await fetch(
        `http://127.0.0.1:8000/assigned-subjects?batch=${batch}&semester=${semester}`
      );

      const updatedData = await updated.json();

      setMySubjects(updatedData);

      await loadAllSubjects();

      setSubject(null);
    } catch (error) {
      console.error("Error adding subject:", error);
      alert("Something went wrong while adding the subject.");
    }
  };

  // ----------------------------------
  // Delete Subject
  // ----------------------------------
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this subject?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/assigned-subjects/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Unable to delete subject.");
        return;
      }

      const updated = await fetch(
        `http://127.0.0.1:8000/assigned-subjects?batch=${batch}&semester=${semester}`
      );

      const updatedData = await updated.json();

      setMySubjects(updatedData);

      await loadAllSubjects();

      alert("Subject deleted successfully.");
    } catch (error) {
      console.error("Error deleting subject:", error);
      alert("Something went wrong while deleting the subject.");
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      {/* ----------------------------------
          Page Header
      ---------------------------------- */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          mb: 4,
        }}
      >
        <MenuBookRoundedIcon
          sx={{
            fontSize: 38,
            color: "#1e3a8a",
          }}
        />

        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "#1e3a8a",
          }}
        >
          My Subjects
        </Typography>
      </Box>

      {/* ----------------------------------
          Add Subject Section
      ---------------------------------- */}
      <Paper
        elevation={4}
        sx={{
          p: 4,
          borderRadius: 4,
          mb: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {/* Batch */}
          <TextField
            select
            label="Batch"
            value={batch}
            onChange={(e) => setBatch(e.target.value)}
            sx={{ width: 180 }}
          >
            <MenuItem value="2023-2027">2023-2027</MenuItem>
            <MenuItem value="2024-2028">2024-2028</MenuItem>
            <MenuItem value="2025-2029">2025-2029</MenuItem>
          </TextField>

          {/* Semester */}
          <TextField
            select
            label="Semester"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            sx={{ width: 180 }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <MenuItem key={sem} value={sem}>
                Semester {sem}
              </MenuItem>
            ))}
          </TextField>

          {/* Subject */}
          <Autocomplete
            sx={{ width: 430 }}
            options={subjects}
            value={subject}
            onChange={(event, newValue) => setSubject(newValue)}
            getOptionLabel={(option) =>
              `${option.code} - ${option.name}`
            }
            isOptionEqualToValue={(option, value) =>
              option.code === value?.code
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Subject"
                placeholder="Type subject code or name..."
              />
            )}
          />

          {/* Add Button */}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            sx={{
              height: 56,
              px: 4,
              borderRadius: 3,
              background: "#1e3a8a",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                background: "#172d6b",
              },
            }}
          >
            Add Subject
          </Button>
        </Box>
      </Paper>

      {/* ----------------------------------
          Assigned Subjects Table
      ---------------------------------- */}
      <Paper
        elevation={4}
        sx={{
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  background: "#1e3a8a",
                  "& th": {
                    color: "#fff",
                    fontWeight: "bold",
                  },
                }}
              >
                <TableCell>Subject Code</TableCell>

                <TableCell>Subject Name</TableCell>

                <TableCell align="center">
                  Action
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {allSubjects.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    align="center"
                    sx={{
                      py: 5,
                    }}
                  >
                    No Subjects Assigned
                  </TableCell>
                </TableRow>
              ) : (
                allSubjects.map((sub) => (
                  <TableRow
                    key={sub.id}
                    hover
                  >
                    <TableCell>
                      <Chip
                        label={sub.subject_code}
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>

                    <TableCell>
                      {sub.subject_name}
                    </TableCell>

                    <TableCell align="center">
                      <Button
                        color="error"
                        startIcon={
                          <DeleteOutlineRoundedIcon />
                        }
                        onClick={() =>
                          handleDelete(sub.id)
                        }
                        sx={{
                          textTransform: "none",
                          borderRadius: 2,
                        }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

export default MySubjects;