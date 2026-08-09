import { useEffect, useMemo, useState } from "react";

import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Avatar,
  Divider,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BadgeIcon from "@mui/icons-material/Badge";
import BusinessIcon from "@mui/icons-material/Business";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import MenuBookIcon from "@mui/icons-material/MenuBook";

function Students() {
  const BLUE = "#1e3a8a";
  const BLUE_LIGHT = "#2563eb";
  const PAGE_BG = "#f5f7fb";

  const FONT_FAMILY =
    "'Poppins', 'Segoe UI', sans-serif";

  const [students, setStudents] = useState([]);
  const [batch, setBatch] = useState("2024-2028");

  const [sortBy, setSortBy] = useState("register");
  const [search, setSearch] = useState("");

  const [selectedStudent, setSelectedStudent] =
    useState(null);

  const [showStudentDetails, setShowStudentDetails] =
    useState(false);

  const [gradeModalOpen, setGradeModalOpen] =
    useState(false);

  const [backlogModalOpen, setBacklogModalOpen] =
    useState(false);

  const [selectedSemester, setSelectedSemester] =
    useState(null);

  const [loading, setLoading] = useState(true);

  // ---------------------------------------------------------
  // FETCH STUDENTS
  // ---------------------------------------------------------

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:8000/students"
      );

      const data = await response.json();

      setStudents(data);
    } catch (error) {
      console.error(
        "Error fetching students:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // FILTER + SEARCH + SORT
  // ---------------------------------------------------------

  const filteredStudents = useMemo(() => {
    let result = students.filter(
      (student) => student.batch === batch
    );

    const searchValue =
      search.trim().toLowerCase();

    if (searchValue) {
      result = result.filter((student) => {
        const name =
          student.student_name?.toLowerCase() ||
          "";

        const registerNumber =
          student.register_number?.toLowerCase() ||
          "";

        return (
          name.includes(searchValue) ||
          registerNumber.includes(searchValue)
        );
      });
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "nameAsc":
          return (
            a.student_name || ""
          ).localeCompare(
            b.student_name || ""
          );

        case "nameDesc":
          return (
            b.student_name || ""
          ).localeCompare(
            a.student_name || ""
          );

        case "cgpaHigh":
          return (
            Number(b.current_cgpa || 0) -
            Number(a.current_cgpa || 0)
          );

        case "cgpaLow":
          return (
            Number(a.current_cgpa || 0) -
            Number(b.current_cgpa || 0)
          );

        case "register":
        default:
          return (
            a.register_number || ""
          ).localeCompare(
            b.register_number || ""
          );
      }
    });

    return result;
  }, [
    students,
    batch,
    search,
    sortBy,
  ]);

  // ---------------------------------------------------------
  // VIEW STUDENT
  // ---------------------------------------------------------

  const handleView = async (id) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/student/${id}`
      );

      const data = await response.json();

      setSelectedStudent(data);
      setShowStudentDetails(true);
    } catch (error) {
      console.error(
        "Error fetching student:",
        error
      );
    }
  };

  // ---------------------------------------------------------
  // BACK TO STUDENTS
  // ---------------------------------------------------------

  const handleBackToStudents = () => {
    setShowStudentDetails(false);
    setSelectedStudent(null);
    setGradeModalOpen(false);
    setBacklogModalOpen(false);
    setSelectedSemester(null);
  };

  // ---------------------------------------------------------
  // OPEN SGPA DETAILS
  // ---------------------------------------------------------

  const handleOpenGradeDetails = (result) => {
    setSelectedSemester(result);
    setGradeModalOpen(true);
  };

  // ---------------------------------------------------------
  // OPEN BACKLOG DETAILS
  // ---------------------------------------------------------

  const handleOpenBacklogDetails = (result) => {
    setSelectedSemester(result);
    setBacklogModalOpen(true);
  };

  // ---------------------------------------------------------
  // BACKLOG SUBJECTS
  // ---------------------------------------------------------

  const getBacklogSubjects = (result) => {
    if (!result?.subjects) {
      return [];
    }

    return result.subjects.filter(
      (subject) =>
        subject.grade === "RA" ||
        subject.grade === "U"
    );
  };

  // =========================================================
  // STUDENT DETAILS
  // =========================================================

  if (
    showStudentDetails &&
    selectedStudent
  ) {
    return (
      <Box
        sx={{
          backgroundColor: PAGE_BG,
          minHeight: "100%",
          fontFamily: FONT_FAMILY,
        }}
      >
        {/* BACK */}

        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBackToStudents}
          sx={{
            mb: 2.5,
            color: BLUE,
            fontWeight: 600,
            textTransform: "none",
            fontSize: 14,
            fontFamily: FONT_FAMILY,
            "&:hover": {
              backgroundColor:
                "rgba(30,58,138,0.08)",
            },
          }}
        >
          Back to Students
        </Button>

        {/* ================================================= */}
        {/* PROFILE CARD */}
        {/* ================================================= */}

        <Paper
          elevation={0}
          sx={{
            p: {
              xs: 3,
              md: 4,
            },
            borderRadius: 4,
            background:
              "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
            color: "#fff",
            mb: 4,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative circles */}

          <Box
            sx={{
              position: "absolute",
              width: 220,
              height: 220,
              borderRadius: "50%",
              backgroundColor:
                "rgba(255,255,255,0.06)",
              right: -70,
              top: -80,
            }}
          />

          <Box
            sx={{
              position: "absolute",
              width: 130,
              height: 130,
              borderRadius: "50%",
              backgroundColor:
                "rgba(255,255,255,0.05)",
              right: 100,
              bottom: -80,
            }}
          />

          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              alignItems: "center",
              gap: 3,
              flexWrap: "wrap",
            }}
          >
            {/* Avatar */}

            <Avatar
              sx={{
                width: 92,
                height: 92,
                backgroundColor: "#fff",
                color: BLUE,
                fontSize: 34,
                fontWeight: 600,
                fontFamily: FONT_FAMILY,
                boxShadow:
                  "0 6px 18px rgba(0,0,0,0.18)",
              }}
            >
              {selectedStudent.student_name
                ?.charAt(0)
                ?.toUpperCase() || "S"}
            </Avatar>

            {/* Student information */}

            <Box
              sx={{
                flex: 1,
                minWidth: 240,
              }}
            >
              <Typography
                sx={{
                  fontFamily: FONT_FAMILY,
                  fontSize: {
                    xs: 23,
                    md: 28,
                  },
                  fontWeight: 700,
                  lineHeight: 1.2,
                  mb: 1,
                }}
              >
                {selectedStudent.student_name}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 0.8,
                }}
              >
                <BadgeIcon
                  sx={{
                    fontSize: 18,
                  }}
                />

                <Typography
                  sx={{
                    fontFamily: FONT_FAMILY,
                    fontSize: 13,
                    opacity: 0.95,
                  }}
                >
                  {selectedStudent.register_number}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  mt: 1.5,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.7,
                  }}
                >
                  <BusinessIcon
                    sx={{
                      fontSize: 17,
                    }}
                  />

                  <Typography
                    sx={{
                      fontFamily: FONT_FAMILY,
                      fontSize: 13,
                    }}
                  >
                    {selectedStudent.department}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.7,
                  }}
                >
                  <CalendarMonthIcon
                    sx={{
                      fontSize: 17,
                    }}
                  />

                  <Typography
                    sx={{
                      fontFamily: FONT_FAMILY,
                      fontSize: 13,
                    }}
                  >
                    {selectedStudent.batch}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* CGPA */}

            <Box
              sx={{
                minWidth: 150,
                textAlign: {
                  xs: "left",
                  md: "right",
                },
                mt: {
                  xs: 1,
                  md: 0,
                },
              }}
            >
              <Typography
                sx={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 13,
                  opacity: 0.85,
                  mb: 0.4,
                }}
              >
                CGPA
              </Typography>

              <Typography
                sx={{
                  fontFamily: FONT_FAMILY,
                  fontSize: {
                    xs: 30,
                    md: 36,
                  },
                  fontWeight: 700,
                  lineHeight: 1,
                  color: "#fff",
                }}
              >
                {Number(
                  selectedStudent.current_cgpa ||
                    0
                ).toFixed(3)}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* ================================================= */}
        {/* SEMESTER PERFORMANCE */}
        {/* ================================================= */}

        <Paper
          elevation={0}
          sx={{
            p: {
              xs: 2.5,
              md: 3,
            },
            borderRadius: 4,
            backgroundColor: "#fff",
          }}
        >
          {/* Heading */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.2,
              mb: 2,
            }}
          >
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: 2,
                backgroundColor:
                  "#eaf0ff",
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "center",
              }}
            >
              <SchoolIcon
                sx={{
                  color: BLUE,
                  fontSize: 24,
                }}
              />
            </Box>

            <Box>
              <Typography
                sx={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 22,
                  fontWeight: 700,
                  color: BLUE,
                  lineHeight: 1.2,
                }}
              >
                Semester Performance
              </Typography>

              <Typography
                sx={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 12.5,
                  color: "#6b7280",
                  mt: 0.3,
                }}
              >
                View semester SGPA and
                backlog details
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 2.5 }} />

          {/* SEMESTERS */}

          {[1, 2, 3, 4, 5, 6, 7, 8].map(
            (semester) => {
              const result =
                selectedStudent.semester_results?.find(
                  (sem) =>
                    Number(
                      sem.semester
                    ) === semester
                );

              const backlogSubjects =
                getBacklogSubjects(
                  result
                );

              const backlogCount =
                backlogSubjects.length;

              return (
                <Paper
                  key={semester}
                  elevation={0}
                  sx={{
                    p: {
                      xs: 2,
                      md: 2.2,
                    },
                    mb: 1.5,
                    borderRadius: 3,
                    border:
                      "1px solid #e5e7eb",
                    transition:
                      "all 0.25s ease",
                    "&:hover": {
                      borderColor:
                        "#b8c7ef",
                      boxShadow:
                        "0 5px 16px rgba(30,58,138,0.08)",
                      transform:
                        "translateY(-1px)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "space-between",
                      gap: 2,
                      flexWrap:
                        "wrap",
                    }}
                  >
                    {/* Semester */}

                    <Box
                      sx={{
                        display: "flex",
                        alignItems:
                          "center",
                        gap: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          width: 38,
                          height: 38,
                          borderRadius:
                            "50%",
                          backgroundColor:
                            result
                              ? "#eaf7ee"
                              : "#f1f3f5",
                          display:
                            "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                        }}
                      >
                        {result ? (
                          <CheckCircleIcon
                            sx={{
                              color:
                                "#2e7d32",
                              fontSize:
                                21,
                            }}
                          />
                        ) : (
                          <AssignmentTurnedInIcon
                            sx={{
                              color:
                                "#a0a4aa",
                              fontSize:
                                21,
                            }}
                          />
                        )}
                      </Box>

                      <Typography
                        sx={{
                          fontFamily:
                            FONT_FAMILY,
                          fontSize: 15,
                          fontWeight: 600,
                          color:
                            "#1f2937",
                        }}
                      >
                        Semester{" "}
                        {semester}
                      </Typography>
                    </Box>

                    {/* Actions */}

                    {result ? (
                      <Box
                        sx={{
                          display:
                            "flex",
                          alignItems:
                            "center",
                          gap: 1,
                          flexWrap:
                            "wrap",
                        }}
                      >
                        {/* SGPA */}

                        <Button
                          variant="contained"
                          onClick={() =>
                            handleOpenGradeDetails(
                              result
                            )
                          }
                          sx={{
                            minWidth: 125,
                            borderRadius: 2.5,
                            backgroundColor:
                              "#2e7d32",
                            textTransform:
                              "none",
                            fontWeight: 700,
                            fontSize: 12.5,
                            fontFamily:
                              FONT_FAMILY,
                            boxShadow:
                              "none",
                            "&:hover":
                              {
                                backgroundColor:
                                  "#256b29",
                                boxShadow:
                                  "0 4px 10px rgba(46,125,50,0.2)",
                              },
                          }}
                        >
                          SGPA :{" "}
                          {Number(
                            result.sgpa
                          ).toFixed(3)}
                        </Button>

                        {/* BACKLOGS */}

                        <Button
                          variant="contained"
                          onClick={() =>
                            handleOpenBacklogDetails(
                              result
                            )
                          }
                          startIcon={
                            backlogCount >
                            0 ? (
                              <WarningAmberIcon
                                sx={{
                                  fontSize:
                                    17,
                                }}
                              />
                            ) : null
                          }
                          sx={{
                            minWidth: 125,
                            borderRadius: 2.5,
                            backgroundColor:
                              backlogCount >
                              0
                                ? "#dc2626"
                                : "#64748b",
                            textTransform:
                              "none",
                            fontWeight: 700,
                            fontSize: 12.5,
                            fontFamily:
                              FONT_FAMILY,
                            boxShadow:
                              "none",
                            "&:hover":
                              {
                                backgroundColor:
                                  backlogCount >
                                  0
                                    ? "#b91c1c"
                                    : "#475569",
                                boxShadow:
                                  "0 4px 10px rgba(0,0,0,0.12)",
                              },
                          }}
                        >
                          Backlogs :{" "}
                          {backlogCount}
                        </Button>
                      </Box>
                    ) : (
                      <Typography
                        sx={{
                          fontFamily:
                            FONT_FAMILY,
                          color:
                            "#9ca3af",
                          fontSize: 13,
                          fontStyle:
                            "italic",
                        }}
                      >
                        Not Uploaded
                      </Typography>
                    )}
                  </Box>
                </Paper>
              );
            }
          )}
        </Paper>

        {/* ================================================= */}
        {/* GRADE DETAILS MODAL */}
        {/* ================================================= */}

        <Dialog
          open={gradeModalOpen}
          onClose={() =>
            setGradeModalOpen(false)
          }
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              overflow: "hidden",
              fontFamily:
                FONT_FAMILY,
            },
          }}
        >
          <DialogTitle
            sx={{
              color: BLUE,
              fontWeight: 700,
              fontSize: 21,
              fontFamily:
                FONT_FAMILY,
              display: "flex",
              alignItems:
                "center",
              justifyContent:
                "space-between",
              borderBottom:
                "1px solid #e5e7eb",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems:
                  "center",
                gap: 1,
              }}
            >
              <MenuBookIcon
                sx={{
                  color: BLUE,
                }}
              />

              {selectedSemester
                ? `Semester ${selectedSemester.semester} Grade Details`
                : "Grade Details"}
            </Box>

            <IconButton
              onClick={() =>
                setGradeModalOpen(
                  false
                )
              }
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent
            sx={{
              p: {
                xs: 2,
                md: 3,
              },
            }}
          >
            {selectedSemester
              ?.subjects?.length >
            0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow
                      sx={{
                        backgroundColor:
                          BLUE_LIGHT,
                      }}
                    >
                      <TableCell
                        sx={{
                          color: "#fff",
                          fontWeight: 700,
                          fontFamily:
                            FONT_FAMILY,
                        }}
                      >
                        Subject Code
                      </TableCell>

                      <TableCell
                        sx={{
                          color: "#fff",
                          fontWeight: 700,
                          fontFamily:
                            FONT_FAMILY,
                        }}
                      >
                        Subject Name
                      </TableCell>

                      <TableCell
                        sx={{
                          color: "#fff",
                          fontWeight: 700,
                          textAlign:
                            "center",
                          fontFamily:
                            FONT_FAMILY,
                        }}
                      >
                        Grade
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {selectedSemester.subjects.map(
                      (
                        subject,
                        index
                      ) => (
                        <TableRow
                          key={`${subject.subject_code}-${index}`}
                          hover
                        >
                          <TableCell
                            sx={{
                              fontSize: 13,
                              fontWeight: 600,
                              color:
                                "#374151",
                              fontFamily:
                                FONT_FAMILY,
                            }}
                          >
                            {
                              subject.subject_code
                            }
                          </TableCell>

                          <TableCell
                            sx={{
                              fontSize: 13,
                              color:
                                "#374151",
                              fontFamily:
                                FONT_FAMILY,
                            }}
                          >
                            {
                              subject.subject_name
                            }
                          </TableCell>

                          <TableCell
                            sx={{
                              textAlign:
                                "center",
                              fontWeight: 700,
                              color:
                                subject.grade ===
                                  "RA" ||
                                subject.grade ===
                                  "U"
                                  ? "#dc2626"
                                  : BLUE,
                              fontFamily:
                                FONT_FAMILY,
                            }}
                          >
                            {
                              subject.grade
                            }
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box
                sx={{
                  py: 6,
                  textAlign:
                    "center",
                  color:
                    "#6b7280",
                }}
              >
                <MenuBookIcon
                  sx={{
                    fontSize: 48,
                    color:
                      "#cbd5e1",
                    mb: 1,
                  }}
                />

                <Typography
                  sx={{
                    fontFamily:
                      FONT_FAMILY,
                    fontWeight: 600,
                  }}
                >
                  No Subject Details
                  Found
                </Typography>
              </Box>
            )}
          </DialogContent>

          <DialogActions
            sx={{
              p: 2,
              borderTop:
                "1px solid #e5e7eb",
            }}
          >
            <Button
              variant="contained"
              onClick={() =>
                setGradeModalOpen(
                  false
                )
              }
              sx={{
                backgroundColor:
                  BLUE,
                textTransform:
                  "none",
                fontWeight: 600,
                fontFamily:
                  FONT_FAMILY,
                borderRadius: 2,
                px: 3,
                "&:hover": {
                  backgroundColor:
                    "#172f70",
                },
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* ================================================= */}
        {/* BACKLOG DETAILS MODAL */}
        {/* ================================================= */}

        <Dialog
          open={backlogModalOpen}
          onClose={() =>
            setBacklogModalOpen(
              false
            )
          }
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              overflow: "hidden",
              fontFamily:
                FONT_FAMILY,
            },
          }}
        >
          <DialogTitle
            sx={{
              color: BLUE,
              fontWeight: 700,
              fontSize: 21,
              fontFamily:
                FONT_FAMILY,
              display: "flex",
              alignItems:
                "center",
              justifyContent:
                "space-between",
              borderBottom:
                "1px solid #e5e7eb",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems:
                  "center",
                gap: 1,
              }}
            >
              <WarningAmberIcon
                sx={{
                  color:
                    selectedSemester &&
                    getBacklogSubjects(
                      selectedSemester
                    ).length > 0
                      ? "#dc2626"
                      : "#64748b",
                }}
              />

              {selectedSemester
                ? `Semester ${selectedSemester.semester} Backlogs`
                : "Backlogs"}
            </Box>

            <IconButton
              onClick={() =>
                setBacklogModalOpen(
                  false
                )
              }
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent
            sx={{
              p: {
                xs: 2,
                md: 3,
              },
            }}
          >
            {selectedSemester &&
            getBacklogSubjects(
              selectedSemester
            ).length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow
                      sx={{
                        backgroundColor:
                          BLUE_LIGHT,
                      }}
                    >
                      <TableCell
                        sx={{
                          color: "#fff",
                          fontWeight: 700,
                          fontFamily:
                            FONT_FAMILY,
                        }}
                      >
                        Subject Code
                      </TableCell>

                      <TableCell
                        sx={{
                          color: "#fff",
                          fontWeight: 700,
                          fontFamily:
                            FONT_FAMILY,
                        }}
                      >
                        Subject Name
                      </TableCell>

                      <TableCell
                        sx={{
                          color: "#fff",
                          fontWeight: 700,
                          textAlign:
                            "center",
                          fontFamily:
                            FONT_FAMILY,
                        }}
                      >
                        Grade
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {getBacklogSubjects(
                      selectedSemester
                    ).map(
                      (
                        subject,
                        index
                      ) => (
                        <TableRow
                          key={`${subject.subject_code}-${index}`}
                          hover
                        >
                          <TableCell
                            sx={{
                              fontSize: 13,
                              fontWeight: 600,
                              color:
                                "#374151",
                              fontFamily:
                                FONT_FAMILY,
                            }}
                          >
                            {
                              subject.subject_code
                            }
                          </TableCell>

                          <TableCell
                            sx={{
                              fontSize: 13,
                              color:
                                "#374151",
                              fontFamily:
                                FONT_FAMILY,
                            }}
                          >
                            {
                              subject.subject_name
                            }
                          </TableCell>

                          <TableCell
                            sx={{
                              textAlign:
                                "center",
                              fontWeight: 700,
                              color:
                                "#dc2626",
                              fontFamily:
                                FONT_FAMILY,
                            }}
                          >
                            {
                              subject.grade
                            }
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box
                sx={{
                  py: 6,
                  textAlign:
                    "center",
                }}
              >
                <Box
                  sx={{
                    width: 65,
                    height: 65,
                    borderRadius:
                      "50%",
                    backgroundColor:
                      "#eaf7ee",
                    display: "flex",
                    alignItems:
                      "center",
                    justifyContent:
                      "center",
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  <CheckCircleIcon
                    sx={{
                      fontSize: 38,
                      color:
                        "#2e7d32",
                    }}
                  />
                </Box>

                <Typography
                  sx={{
                    fontFamily:
                      FONT_FAMILY,
                    fontSize: 19,
                    fontWeight: 700,
                    color:
                      "#1f2937",
                  }}
                >
                  No Backlogs Found
                </Typography>

                <Typography
                  sx={{
                    fontFamily:
                      FONT_FAMILY,
                    fontSize: 13,
                    color:
                      "#6b7280",
                    mt: 0.8,
                  }}
                >
                  This semester has
                  no pending
                  backlogs.
                </Typography>
              </Box>
            )}
          </DialogContent>

          <DialogActions
            sx={{
              p: 2,
              borderTop:
                "1px solid #e5e7eb",
            }}
          >
            <Button
              variant="contained"
              onClick={() =>
                setBacklogModalOpen(
                  false
                )
              }
              sx={{
                backgroundColor:
                  BLUE,
                textTransform:
                  "none",
                fontWeight: 600,
                fontFamily:
                  FONT_FAMILY,
                borderRadius: 2,
                px: 3,
                "&:hover": {
                  backgroundColor:
                    "#172f70",
                },
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }

  // =========================================================
  // STUDENTS LIST
  // =========================================================

  return (
    <Box
      sx={{
        backgroundColor: PAGE_BG,
        minHeight: "100%",
        fontFamily: FONT_FAMILY,
      }}
    >
      {/* PAGE HEADER */}

      <Box
        sx={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontFamily:
                FONT_FAMILY,
              fontSize: 27,
              fontWeight: 700,
              color: BLUE,
              lineHeight: 1.2,
            }}
          >
            Students
          </Typography>

          <Typography
            sx={{
              fontFamily:
                FONT_FAMILY,
              fontSize: 13,
              color: "#6b7280",
              mt: 0.6,
            }}
          >
            View and manage student
            academic records
          </Typography>
        </Box>

        <Box
          sx={{
            backgroundColor:
              "#eaf0ff",
            px: 2,
            py: 1,
            borderRadius: 2.5,
          }}
        >
          <Typography
            sx={{
              fontFamily:
                FONT_FAMILY,
              fontSize: 13,
              fontWeight: 600,
              color: BLUE,
            }}
          >
            {filteredStudents.length}{" "}
            Students
          </Typography>
        </Box>
      </Box>

      {/* ================================================= */}
      {/* FILTERS */}
      {/* ================================================= */}

      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          mb: 3,
          borderRadius: 3,
          border:
            "1px solid #e5e7eb",
          backgroundColor: "#fff",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems:
              "center",
            flexWrap: "wrap",
          }}
        >
          {/* BATCH */}

          <FormControl
            size="small"
            sx={{
              minWidth: 190,

              "& .MuiInputLabel-root": {
                fontFamily:
                  FONT_FAMILY,
                fontSize: 13,
              },

              "& .MuiSelect-select": {
                fontFamily:
                  FONT_FAMILY,
                fontSize: 13.5,
                fontWeight: 500,
              },

              "& .MuiMenuItem-root": {
                fontFamily:
                  FONT_FAMILY,
                fontSize: 13.5,
              },
            }}
          >
            <InputLabel>
              Select Batch
            </InputLabel>

            <Select
              value={batch}
              label="Select Batch"
              onChange={(e) =>
                setBatch(
                  e.target.value
                )
              }
              sx={{
                borderRadius: 2,
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    borderRadius: 2,
                    mt: 0.5,

                    "& .MuiMenuItem-root": {
                      fontFamily:
                        FONT_FAMILY,
                      fontSize: 13.5,
                      minHeight: 40,
                    },

                    "& .MuiMenuItem-root.Mui-selected":
                      {
                        backgroundColor:
                          "#eaf0ff",
                        color: BLUE,
                        fontWeight: 600,
                      },

                    "& .MuiMenuItem-root:hover":
                      {
                        backgroundColor:
                          "#f1f5ff",
                      },
                  },
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
            </Select>
          </FormControl>

          {/* SORT */}

          <FormControl
            size="small"
            sx={{
              minWidth: 210,

              "& .MuiInputLabel-root": {
                fontFamily:
                  FONT_FAMILY,
                fontSize: 13,
              },

              "& .MuiSelect-select": {
                fontFamily:
                  FONT_FAMILY,
                fontSize: 13.5,
                fontWeight: 500,
              },

              "& .MuiMenuItem-root": {
                fontFamily:
                  FONT_FAMILY,
                fontSize: 13.5,
              },
            }}
          >
            <InputLabel>
              Sort By
            </InputLabel>

            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) =>
                setSortBy(
                  e.target.value
                )
              }
              sx={{
                borderRadius: 2,
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    borderRadius: 2,
                    mt: 0.5,

                    "& .MuiMenuItem-root": {
                      fontFamily:
                        FONT_FAMILY,
                      fontSize: 13.5,
                      minHeight: 40,
                    },

                    "& .MuiMenuItem-root.Mui-selected":
                      {
                        backgroundColor:
                          "#eaf0ff",
                        color: BLUE,
                        fontWeight: 600,
                      },

                    "& .MuiMenuItem-root:hover":
                      {
                        backgroundColor:
                          "#f1f5ff",
                      },
                  },
                },
              }}
            >
              <MenuItem value="register">
                Register Number
              </MenuItem>

              <MenuItem value="nameAsc">
                Name A → Z
              </MenuItem>

              <MenuItem value="nameDesc">
                Name Z → A
              </MenuItem>

              <MenuItem value="cgpaHigh">
                CGPA High → Low
              </MenuItem>

              <MenuItem value="cgpaLow">
                CGPA Low → High
              </MenuItem>
            </Select>
          </FormControl>

          {/* SEARCH */}

          <TextField
            size="small"
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            placeholder="Search student..."
            sx={{
              flex: 1,
              minWidth: 240,

              "& .MuiInputBase-input": {
                fontFamily:
                  FONT_FAMILY,
                fontSize: 13.5,
              },

              "& .MuiInputBase-input::placeholder":
                {
                  fontFamily:
                    FONT_FAMILY,
                  opacity: 0.65,
                },

              "& .MuiOutlinedInput-root":
                {
                  borderRadius: 2,
                },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    sx={{
                      color:
                        "#6b7280",
                      fontSize: 21,
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />

          {/* CLEAR */}

          {search && (
            <Button
              onClick={() =>
                setSearch("")
              }
              sx={{
                textTransform:
                  "none",
                color: BLUE,
                fontWeight: 600,
                fontFamily:
                  FONT_FAMILY,
                fontSize: 13,
              }}
            >
              Clear
            </Button>
          )}
        </Box>
      </Paper>

      {/* ================================================= */}
      {/* TABLE */}
      {/* ================================================= */}

      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border:
            "1px solid #e5e7eb",
          overflow: "hidden",
          backgroundColor: "#fff",
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor:
                    BLUE,
                }}
              >
                <TableCell
                  sx={{
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 13,
                    fontFamily:
                      FONT_FAMILY,
                  }}
                >
                  Register No
                </TableCell>

                <TableCell
                  sx={{
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 13,
                    fontFamily:
                      FONT_FAMILY,
                  }}
                >
                  Student
                </TableCell>

                <TableCell
                  sx={{
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 13,
                    fontFamily:
                      FONT_FAMILY,
                  }}
                >
                  Department
                </TableCell>

                <TableCell
                  sx={{
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 13,
                    fontFamily:
                      FONT_FAMILY,
                  }}
                >
                  CGPA
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 13,
                    fontFamily:
                      FONT_FAMILY,
                  }}
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    align="center"
                    sx={{
                      py: 7,
                    }}
                  >
                    <CircularProgress
                      size={32}
                      sx={{
                        color:
                          BLUE,
                      }}
                    />

                    <Typography
                      sx={{
                        fontFamily:
                          FONT_FAMILY,
                        mt: 1.5,
                        fontSize: 13,
                        color:
                          "#6b7280",
                      }}
                    >
                      Loading students...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : filteredStudents.length ===
                0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    align="center"
                    sx={{
                      py: 7,
                    }}
                  >
                    <SearchIcon
                      sx={{
                        fontSize: 46,
                        color:
                          "#cbd5e1",
                        mb: 1,
                      }}
                    />

                    <Typography
                      sx={{
                        fontFamily:
                          FONT_FAMILY,
                        fontSize: 17,
                        fontWeight: 600,
                        color:
                          "#374151",
                      }}
                    >
                      No Students Found
                    </Typography>

                    <Typography
                      sx={{
                        fontFamily:
                          FONT_FAMILY,
                        fontSize: 13,
                        color:
                          "#6b7280",
                        mt: 0.5,
                      }}
                    >
                      Try changing the
                      batch, search or
                      sorting option.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map(
                  (student) => (
                    <TableRow
                      key={student.id}
                      hover
                      sx={{
                        "&:last-child td":
                          {
                            borderBottom: 0,
                          },
                      }}
                    >
                      {/* REGISTER */}

                      <TableCell
                        sx={{
                          fontSize: 13,
                          fontWeight: 600,
                          color:
                            "#374151",
                          fontFamily:
                            FONT_FAMILY,
                        }}
                      >
                        {
                          student.register_number
                        }
                      </TableCell>

                      {/* STUDENT */}

                      <TableCell>
                        <Box
                          sx={{
                            display:
                              "flex",
                            alignItems:
                              "center",
                            gap: 1.3,
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 36,
                              height: 36,
                              backgroundColor:
                                "#eaf0ff",
                              color: BLUE,
                              fontSize: 15,
                              fontWeight: 700,
                              fontFamily:
                                FONT_FAMILY,
                            }}
                          >
                            {student.student_name
                              ?.charAt(
                                0
                              )
                              ?.toUpperCase() ||
                              "S"}
                          </Avatar>

                          <Typography
                            sx={{
                              fontSize: 13,
                              fontWeight: 600,
                              color:
                                "#1f2937",
                              fontFamily:
                                FONT_FAMILY,
                            }}
                          >
                            {
                              student.student_name
                            }
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* DEPARTMENT */}

                      <TableCell
                        sx={{
                          fontSize: 13,
                          color:
                            "#4b5563",
                          fontFamily:
                            FONT_FAMILY,
                        }}
                      >
                        {
                          student.department
                        }
                      </TableCell>

                      {/* CGPA */}

                      <TableCell
                        sx={{
                          fontSize: 15,
                          fontWeight: 700,
                          color: BLUE,
                          fontFamily:
                            FONT_FAMILY,
                        }}
                      >
                        {Number(
                          student.current_cgpa ||
                            0
                        ).toFixed(3)}
                      </TableCell>

                      {/* VIEW */}

                      <TableCell align="center">
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() =>
                            handleView(
                              student.id
                            )
                          }
                          sx={{
                            minWidth: 75,
                            borderRadius: 2,
                            backgroundColor:
                              BLUE,
                            textTransform:
                              "none",
                            fontWeight: 600,
                            fontFamily:
                              FONT_FAMILY,
                            boxShadow:
                              "none",
                            "&:hover":
                              {
                                backgroundColor:
                                  "#172f70",
                                boxShadow:
                                  "0 4px 10px rgba(30,58,138,0.2)",
                              },
                          }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

export default Students;