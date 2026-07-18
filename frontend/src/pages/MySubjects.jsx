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

  // ----------------------------
  // Load Subject Master
  // ----------------------------

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
      });
  }, [semester]);

  // ----------------------------
  // Load Assigned Subjects
  // ----------------------------

  useEffect(() => {
    if (!batch || !semester) return;

    fetch(
      `http://127.0.0.1:8000/assigned-subjects?batch=${batch}&semester=${semester}`
    )
      .then((res) => res.json())
      .then((data) => setMySubjects(data));
  }, [batch, semester]);

  // ----------------------------
  // Add Subject
  // ----------------------------

  const handleAdd = async () => {
    if (!batch || !semester || !subject) {
      alert("Please fill all fields.");
      return;
    }

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
      alert(data.detail);
      return;
    }

    alert("Subject Added Successfully");

    const updated = await fetch(
      `http://127.0.0.1:8000/assigned-subjects?batch=${batch}&semester=${semester}`
    );

    setMySubjects(await updated.json());

    setSubject(null);
  };

  // ----------------------------
  // Delete Subject
  // ----------------------------

  const handleDelete = async (id) => {
    await fetch(`http://127.0.0.1:8000/assigned-subjects/${id}`, {
      method: "DELETE",
    });

    const updated = await fetch(
      `http://127.0.0.1:8000/assigned-subjects?batch=${batch}&semester=${semester}`
    );

    setMySubjects(await updated.json());
  };

  return (
    <Box sx={{ p: 4 }}>

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

          <TextField
            select
            label="Semester"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            sx={{ width: 180 }}
          >
            {[1,2,3,4,5,6,7,8].map((sem)=>(
              <MenuItem key={sem} value={sem}>
                Semester {sem}
              </MenuItem>
            ))}
          </TextField>

          <Autocomplete
            sx={{ width: 430 }}
            options={subjects}
            value={subject}
            onChange={(e, newValue) => setSubject(newValue)}
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
            }}
          >
            Add Subject
          </Button>
        </Box>
      </Paper>

      <Paper
        elevation={4}
        sx={{
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            background: "#1e3a8a",
            color: "white",
            px: 3,
            py: 2,
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
          >
            My Subjects
          </Typography>
        </Box>

        <TableContainer>
          <Table>

            <TableHead>

              <TableRow
                sx={{
                  background: "#f4f6fb",
                }}
              >
                <TableCell sx={{ fontWeight: "bold" }}>
                  Subject Code
                </TableCell>

                <TableCell sx={{ fontWeight: "bold" }}>
                  Subject Name
                </TableCell>

                <TableCell
                  align="center"
                  sx={{ fontWeight: "bold" }}
                >
                  Action
                </TableCell>
              </TableRow>

            </TableHead>

            <TableBody>

              {mySubjects.length === 0 ? (
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
                mySubjects.map((sub) => (
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
                        startIcon={<DeleteOutlineRoundedIcon />}
                        onClick={() => handleDelete(sub.id)}
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