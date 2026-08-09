import { useState, useEffect } from "react";

import {
  Typography,
  Paper,
  Box,
  Button,
  TextField,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
} from "@mui/material";

import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

function MySubjects() {
  const [batch, setBatch] = useState("");
  const [semester, setSemester] = useState("");

  const [subjects, setSubjects] = useState([]);
  const [subject, setSubject] = useState("");

  const [mySubjects, setMySubjects] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);

  // --------------------------------------------------
  // Common styles
  // --------------------------------------------------

  const fontFamily =
    '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif';

  const primaryBlue = "#1e3a8a";

  // --------------------------------------------------
  // Load Subject Master
  // --------------------------------------------------

  useEffect(() => {
    if (!semester) {
      setSubjects([]);
      setSubject("");
      return;
    }

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
        setSubject("");
      })
      .catch((error) => {
        console.error("Error loading subjects:", error);
        setSubjects([]);
        setSubject("");
      });
  }, [semester]);

  // --------------------------------------------------
  // Load Assigned Subjects
  // --------------------------------------------------

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

  // --------------------------------------------------
  // Load All Assigned Subjects
  // --------------------------------------------------

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

  // --------------------------------------------------
  // Add Subject
  // --------------------------------------------------

  const handleAdd = async () => {
    if (!batch || !semester || !subject) {
      alert("Please fill all fields.");
      return;
    }

    const selectedSubject = subjects.find(
      (item) => item.code === subject
    );

    if (!selectedSubject) {
      alert("Please select a valid subject.");
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
            subject_code: selectedSubject.code,
            subject_name: selectedSubject.name,
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

      setSubject("");
    } catch (error) {
      console.error("Error adding subject:", error);
      alert("Something went wrong while adding the subject.");
    }
  };

  // --------------------------------------------------
  // Delete Subject
  // --------------------------------------------------

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
    <Box
      sx={{
        p: {
          xs: 2,
          sm: 3,
          md: 4,
        },
        fontFamily,
      }}
    >
      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <Box sx={{ mb: 3.5 }}>
        <Typography
          sx={{
            fontFamily,
            fontSize: {
              xs: 26,
              md: 30,
            },
            fontWeight: 700,
            color: primaryBlue,
            lineHeight: 1.25,
          }}
        >
          My Subjects
        </Typography>

        <Typography
          sx={{
            mt: 0.6,
            fontFamily,
            fontSize: 14,
            fontWeight: 400,
            color: "#64748b",
          }}
        >
          Manage subjects assigned to each batch and semester
        </Typography>
      </Box>

      {/* ==================================================
          ASSIGN SUBJECT SECTION
      ================================================== */}

      <Paper
        elevation={0}
        sx={{
          p: {
            xs: 2,
            sm: 2.5,
            md: 3,
          },
          borderRadius: 3,
          mb: 3.5,
          backgroundColor: "#ffffff",
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 16px rgba(15, 23, 42, 0.05)",
        }}
      >
        <Typography
          sx={{
            fontFamily,
            fontSize: 16,
            fontWeight: 600,
            color: "#334155",
            mb: 2.2,
          }}
        >
          Assign Subject
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            flexWrap: "wrap",
          }}
        >
          {/* Batch */}

          <TextField
            select
            label="Batch"
            value={batch}
            onChange={(e) => setBatch(e.target.value)}
            sx={{
              width: {
                xs: "100%",
                sm: 175,
              },

              "& .MuiInputBase-root": {
                fontFamily,
                fontSize: 14,
                borderRadius: 2,
              },

              "& .MuiInputLabel-root": {
                fontFamily,
                fontSize: 14,
              },

              "& .MuiMenuItem-root": {
                fontFamily,
                fontSize: 14,
              },
            }}
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
          </TextField>

          {/* Semester */}

          <TextField
            select
            label="Semester"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            sx={{
              width: {
                xs: "100%",
                sm: 175,
              },

              "& .MuiInputBase-root": {
                fontFamily,
                fontSize: 14,
                borderRadius: 2,
              },

              "& .MuiInputLabel-root": {
                fontFamily,
                fontSize: 14,
              },

              "& .MuiMenuItem-root": {
                fontFamily,
                fontSize: 14,
              },
            }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <MenuItem
                key={sem}
                value={sem}
                sx={{
                  fontFamily,
                  fontSize: 14,
                }}
              >
                Semester {sem}
              </MenuItem>
            ))}
          </TextField>

          {/* Select Subject */}

          <TextField
            select
            label="Select Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={!semester}
            sx={{
              flex: 1,
              minWidth: {
                xs: "100%",
                sm: 280,
              },

              "& .MuiInputBase-root": {
                fontFamily,
                fontSize: 14,
                borderRadius: 2,
              },

              "& .MuiInputLabel-root": {
                fontFamily,
                fontSize: 14,
              },

              "& .MuiMenuItem-root": {
                fontFamily,
                fontSize: 14,
              },
            }}
          >
            {!semester ? (
              <MenuItem
                disabled
                value=""
                sx={{
                  fontFamily,
                  fontSize: 14,
                }}
              >
                Select semester first
              </MenuItem>
            ) : subjects.length === 0 ? (
              <MenuItem
                disabled
                value=""
                sx={{
                  fontFamily,
                  fontSize: 14,
                }}
              >
                No subjects available
              </MenuItem>
            ) : (
              subjects.map((item) => (
                <MenuItem
                  key={item.code}
                  value={item.code}
                  sx={{
                    fontFamily,
                    fontSize: 14,
                  }}
                >
                  {item.code} - {item.name}
                </MenuItem>
              ))
            )}
          </TextField>

          {/* Add Subject */}

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            sx={{
              height: 56,
              minWidth: {
                xs: "100%",
                sm: 145,
              },
              px: 2.5,
              borderRadius: 2,
              backgroundColor: primaryBlue,
              fontFamily,
              fontSize: 14,
              fontWeight: 600,
              textTransform: "none",
              boxShadow: "none",

              "&:hover": {
                backgroundColor: "#172d6b",
                boxShadow: "none",
              },
            }}
          >
            Add Subject
          </Button>
        </Box>
      </Paper>

      {/* ==================================================
          ASSIGNED SUBJECTS
      ================================================== */}

      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          backgroundColor: "#ffffff",
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 16px rgba(15, 23, 42, 0.05)",
        }}
      >
        {/* Section Heading */}

        <Box
          sx={{
            px: {
              xs: 2,
              sm: 2.5,
              md: 3,
            },
            py: 2,
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <Typography
            sx={{
              fontFamily,
              fontSize: 17,
              fontWeight: 600,
              color: "#334155",
            }}
          >
            Assigned Subjects
          </Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: primaryBlue,

                  "& th": {
                    color: "#ffffff",
                    fontFamily,
                    fontSize: 13.5,
                    fontWeight: 600,
                    py: 1.7,
                  },
                }}
              >
                <TableCell
                  sx={{
                    width: "24%",
                  }}
                >
                  Subject Code
                </TableCell>

                <TableCell>
                  Subject Name
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    width: "18%",
                  }}
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {/* ==================================================
                  EMPTY STATE
              ================================================== */}

              {allSubjects.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    align="center"
                    sx={{
                      py: 6,
                      borderBottom: "none",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <MenuBookRoundedIcon
                        sx={{
                          fontSize: 36,
                          color: "#94a3b8",
                          mb: 1.2,
                        }}
                      />

                      <Typography
                        sx={{
                          fontFamily,
                          fontSize: 16,
                          fontWeight: 600,
                          color: "#475569",
                          mb: 0.5,
                        }}
                      >
                        No Subjects Added
                      </Typography>

                      <Typography
                        sx={{
                          fontFamily,
                          fontSize: 13.5,
                          fontWeight: 400,
                          color: "#94a3b8",
                        }}
                      >
                        No subjects have been assigned yet.
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                /* ==================================================
                   SUBJECT ROWS
                ================================================== */

                allSubjects.map((sub) => (
                  <TableRow
                    key={sub.id}
                    hover
                    sx={{
                      "&:hover": {
                        backgroundColor: "#f8fafc",
                      },

                      "& td": {
                        fontFamily,
                        fontSize: 14,
                        color: "#475569",
                        py: 1.8,
                        borderBottom: "1px solid #edf1f5",
                      },

                      "&:last-child td": {
                        borderBottom: "none",
                      },
                    }}
                  >
                    {/* Subject Code */}

                    <TableCell>
                      <Typography
                        sx={{
                          display: "inline-block",
                          px: 1.2,
                          py: 0.45,
                          borderRadius: 1.5,
                          backgroundColor: "#eff4ff",
                          color: primaryBlue,
                          fontFamily,
                          fontSize: 13,
                          fontWeight: 500,
                        }}
                      >
                        {sub.subject_code}
                      </Typography>
                    </TableCell>

                    {/* Subject Name */}

                    <TableCell>
                      <Typography
                        sx={{
                          fontFamily,
                          fontSize: 14,
                          fontWeight: 400,
                          color: "#334155",
                        }}
                      >
                        {sub.subject_name}
                      </Typography>
                    </TableCell>

                    {/* Delete */}

                    <TableCell align="center">
                      <Button
                        color="error"
                        startIcon={
                          <DeleteOutlineRoundedIcon
                            sx={{ fontSize: 19 }}
                          />
                        }
                        onClick={() =>
                          handleDelete(sub.id)
                        }
                        sx={{
                          fontFamily,
                          fontSize: 13.5,
                          fontWeight: 500,
                          textTransform: "none",
                          borderRadius: 1.5,
                          px: 1.5,

                          "&:hover": {
                            backgroundColor: "#fff1f2",
                          },
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