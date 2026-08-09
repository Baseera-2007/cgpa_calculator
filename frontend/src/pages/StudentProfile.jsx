import { useEffect, useState } from "react";

import {
  Paper,
  Typography,
  Grid,
  Box,
  Avatar,
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

import SchoolIcon from "@mui/icons-material/School";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

function StudentProfile() {
  const [student, setStudent] = useState(null);
  const [arrearHistory, setArrearHistory] = useState([]);

  const [openSGPA, setOpenSGPA] = useState(false);
  const [openBacklogs, setOpenBacklogs] = useState(false);

  const [selectedSemester, setSelectedSemester] = useState(null);

  const registerNumber = localStorage.getItem("register_number");

  useEffect(() => {
    fetchStudent();
  }, []);

  // ==========================================================
  // LOAD STUDENT DATA
  // ==========================================================

  const fetchStudent = async () => {
    try {
      const response = await fetch(
        "/api/students"
      );

      const students = await response.json();

      const currentStudent = students.find(
        (s) => s.register_number === registerNumber
      );

      if (!currentStudent) {
        return;
      }

      const response2 = await fetch(
        `/api/student/${currentStudent.id}`
      );

      const data = await response2.json();

      setStudent(data);

      const historyResponse = await fetch(
        `/api/student/${currentStudent.id}/arrear-history`
      );

      const historyData = await historyResponse.json();

      console.log("Arrear History:", historyData);

      setArrearHistory(historyData);
    } catch (error) {
      console.log(error);
    }
  };

  // ==========================================================
  // DELETE SEMESTER
  // ==========================================================

  const handleDeleteSemester = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this semester?"
    );

    if (!confirmDelete) return;

    await fetch(
      `/api/semester/${id}`,
      {
        method: "DELETE",
      }
    );

    window.location.reload();
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (!student) {
    return <Typography>Loading...</Typography>;
  }

  // ==========================================================
  // SUMMARY CALCULATIONS
  // ==========================================================

  const semesterResults =
    student.semester_results || [];

  const completedSemesters =
    semesterResults.length;

  const totalBacklogs =
    semesterResults.reduce(
      (total, semester) => {
        const backlogCount =
          (semester.subjects || []).filter(
            (sub) => {
              const grade =
                sub.grade?.trim().toUpperCase();

              return (
                grade === "RA" ||
                grade === "U" ||
                grade === "F" ||
                grade === "FAIL"
              );
            }
          ).length;

        return total + backlogCount;
      },
      0
    );

  // ==========================================================
  // RETURN
  // ==========================================================

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
        fontFamily:
          "Segoe UI, Inter, Arial, sans-serif",
      }}
    >

      {/* ======================================================
          PROFILE CARD
      ====================================================== */}

      <Paper
        elevation={4}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 4,
          background:
            "linear-gradient(135deg, #1e3a8a, #2563eb)",
          color: "#fff",
          mb: 3,
        }}
      >
        <Grid
          container
          spacing={3}
          alignItems="center"
        >

          {/* AVATAR */}

          <Grid item xs={12} sm={3} md={2}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: "#fff",
                color: "#1e3a8a",
                fontSize: 45,
                fontWeight: "bold",
                mx: {
                  xs: "auto",
                  sm: 0,
                },
              }}
            >
              {student.student_name?.charAt(0)}
            </Avatar>
          </Grid>

          {/* STUDENT DETAILS */}

          <Grid item xs={12} sm={9} md={10}>
            <Typography
              sx={{
                fontSize: {
                  xs: "28px",
                  md: "32px",
                },
                fontWeight: "bold",
                lineHeight: 1.2,
                mb: 1.5,
              }}
            >
              {student.student_name}
            </Typography>

            <Typography sx={{ mb: 0.5 }}>
              Register No :{" "}
              {student.register_number}
            </Typography>

            <Typography sx={{ mb: 0.5 }}>
              Department :{" "}
              {student.department}
            </Typography>

            <Typography sx={{ mb: 0.5 }}>
              Batch : {student.batch}
            </Typography>

            <Typography sx={{ mb: 0.5 }}>
              Section : A
            </Typography>

            <Typography
              sx={{
                mt: 2,
                fontSize: "22px",
                fontWeight: "bold",
                color: "#FFD54F",
              }}
            >
              CGPA :{" "}
              {Number(
                student.current_cgpa
              ).toFixed(3)}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* ======================================================
          ACADEMIC SUMMARY
      ====================================================== */}

      <Grid
        container
        spacing={2}
        sx={{
          mb: 4,
        }}
      >

        {/* SEMESTERS */}

        <Grid item xs={12} sm={4}>
          <Paper
            elevation={2}
            sx={{
              p: 2.5,
              borderRadius: 3,
              border:
                "1px solid #dbeafe",
              backgroundColor:
                "#ffffff",
              display: "flex",
              alignItems: "center",
              gap: 2,
              minHeight: 96,
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                backgroundColor:
                  "#eff6ff",
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "center",
                flexShrink: 0,
              }}
            >
              <GroupsOutlinedIcon
                sx={{
                  color: "#2563eb",
                  fontSize: 27,
                }}
              />
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: "13px",
                  color: "#64748b",
                  mb: 0.5,
                }}
              >
                Semesters
              </Typography>

              <Typography
                sx={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#1e293b",
                }}
              >
                {completedSemesters}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* CURRENT CGPA */}

        <Grid item xs={12} sm={4}>
          <Paper
            elevation={2}
            sx={{
              p: 2.5,
              borderRadius: 3,
              border:
                "1px solid #dbeafe",
              backgroundColor:
                "#ffffff",
              display: "flex",
              alignItems: "center",
              gap: 2,
              minHeight: 96,
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                backgroundColor:
                  "#eff6ff",
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "center",
                flexShrink: 0,
              }}
            >
              <TrendingUpOutlinedIcon
                sx={{
                  color: "#2563eb",
                  fontSize: 27,
                }}
              />
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: "13px",
                  color: "#64748b",
                  mb: 0.5,
                }}
              >
                Current CGPA
              </Typography>

              <Typography
                sx={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#1e3a8a",
                }}
              >
                {Number(
                  student.current_cgpa
                ).toFixed(3)}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* BACKLOGS */}

        <Grid item xs={12} sm={4}>
          <Paper
            elevation={2}
            sx={{
              p: 2.5,
              borderRadius: 3,
              border:
                "1px solid #fee2e2",
              backgroundColor:
                "#ffffff",
              display: "flex",
              alignItems: "center",
              gap: 2,
              minHeight: 96,
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                backgroundColor:
                  "#fef2f2",
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "center",
                flexShrink: 0,
              }}
            >
              <WarningAmberOutlinedIcon
                sx={{
                  color: "#dc2626",
                  fontSize: 27,
                }}
              />
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: "13px",
                  color: "#64748b",
                  mb: 0.5,
                }}
              >
                Backlogs
              </Typography>

              <Typography
                sx={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#dc2626",
                }}
              >
                {totalBacklogs}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* ======================================================
          SEMESTER PERFORMANCE
      ====================================================== */}

      <Paper
        elevation={3}
        sx={{
          p: { xs: 2.5, md: 4 },
          borderRadius: 4,
          backgroundColor: "#ffffff",
          mt: 1,
        }}
      >

        {/* SECTION HEADER */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 3,
            pb: 2,
            borderBottom:
              "2px solid #E5E7EB",
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
              fontSize: {
                xs: "23px",
                md: "28px",
              },
              fontWeight: "bold",
              color: "#1e3a8a",
            }}
          >
            Semester Performance
          </Typography>
        </Box>

        {/* SEMESTERS */}

        {[1, 2, 3, 4, 5, 6, 7, 8].map(
          (semester) => {

            const result =
              student.semester_results.find(
                (sem) =>
                  sem.semester === semester
              );

            const backlogCount =
              result
                ? result.subjects.filter(
                    (sub) => {
                      const grade =
                        sub.grade
                          ?.trim()
                          .toUpperCase();

                      return (
                        grade === "RA" ||
                        grade === "U" ||
                        grade === "F" ||
                        grade === "FAIL"
                      );
                    }
                  ).length
                : 0;

            return (
              <Paper
                key={semester}
                elevation={1}
                sx={{
                  p: {
                    xs: 2,
                    md: 2.5,
                  },
                  mb: 2,
                  borderRadius: 3,
                  border:
                    "1px solid #e2e8f0",
                  backgroundColor:
                    "#ffffff",
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                  gap: 2,
                  flexWrap: "wrap",
                  transition:
                    "all 0.2s ease",

                  "&:hover": {
                    borderColor:
                      "#bfdbfe",
                    boxShadow:
                      "0 4px 12px rgba(30,58,138,0.08)",
                  },
                }}
              >

                {/* SEMESTER NAME */}

                <Box
                  sx={{
                    display: "flex",
                    alignItems:
                      "center",
                    gap: 2,
                    minWidth: 180,
                  }}
                >
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: 2,
                      backgroundColor:
                        result
                          ? "#eff6ff"
                          : "#f8fafc",
                      display: "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                      flexShrink: 0,
                    }}
                  >
                    <AssignmentTurnedInIcon
                      sx={{
                        color:
                          result
                            ? "#2563eb"
                            : "#94a3b8",
                        fontSize: 23,
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography
                      sx={{
                        fontWeight:
                          "bold",
                        color:
                          "#1e293b",
                        fontSize:
                          "16px",
                      }}
                    >
                      Semester{" "}
                      {semester}
                    </Typography>

                    {/* COMPLETED ONLY */}
                    {result && (
                      <Typography
                        sx={{
                          fontSize:
                            "12px",
                          color:
                            "#16a34a",
                          fontWeight:
                            600,
                          mt: 0.3,
                        }}
                      >
                        Completed
                      </Typography>
                    )}
                  </Box>
                </Box>

                {/* SEMESTER ACTIONS */}

                {result ? (
                  <Box
                    sx={{
                      display:
                        "flex",
                      gap: 1,
                      alignItems:
                        "center",
                      flexWrap:
                        "wrap",
                      marginLeft:
                        "auto",
                    }}
                  >

                    {/* SGPA */}

                    <Button
                      variant="contained"
                      onClick={() => {
                        setSelectedSemester(
                          result
                        );
                        setOpenSGPA(
                          true
                        );
                      }}
                      sx={{
                        borderRadius: 5,
                        textTransform:
                          "none",
                        fontWeight:
                          "bold",
                        backgroundColor:
                          "#16a34a",
                        px: 2,

                        "&:hover": {
                          backgroundColor:
                            "#15803d",
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
                      onClick={() => {
                        setSelectedSemester(
                          result
                        );
                        setOpenBacklogs(
                          true
                        );
                      }}
                      sx={{
                        borderRadius: 5,
                        textTransform:
                          "none",
                        fontWeight:
                          "bold",
                        backgroundColor:
                          "#dc2626",
                        px: 2,

                        "&:hover": {
                          backgroundColor:
                            "#b91c1c",
                        },
                      }}
                    >
                      Backlogs :{" "}
                      {backlogCount}
                    </Button>

                    {/* DELETE */}

                    <IconButton
                      color="error"
                      onClick={() =>
                        handleDeleteSemester(
                          result.id
                        )
                      }
                      sx={{
                        ml: 0.5,
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ) : (

                  /* ONLY ONE NOT UPLOADED ON RIGHT */

                  <Typography
                    sx={{
                      color:
                        "#94a3b8",
                      fontWeight:
                        600,
                      fontSize:
                        "14px",
                      marginLeft:
                        "auto",
                      whiteSpace:
                        "nowrap",
                    }}
                  >
                    Not Uploaded
                  </Typography>

                )}

              </Paper>
            );
          }
        )}
      </Paper>

      {/* ======================================================
          SGPA DETAILS DIALOG
      ====================================================== */}

      <Dialog
        open={openSGPA}
        onClose={() =>
          setOpenSGPA(false)
        }
        fullWidth
        maxWidth="md"
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            color: "#1e3a8a",
          }}
        >
          Semester{" "}
          {selectedSemester?.semester}{" "}
          Grade Details
        </DialogTitle>

        <DialogContent>
          <Table>
            <TableHead
              sx={{
                "& .MuiTableCell-head": {
                  backgroundColor:
                    "#2563eb",
                  color: "#fff",
                  fontWeight:
                    "bold",
                },
              }}
            >
              <TableRow>
                <TableCell>
                  Subject Code
                </TableCell>

                <TableCell>
                  Subject Name
                </TableCell>

                <TableCell>
                  Grade
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {selectedSemester?.subjects.map(
                (sub, index) => (
                  <TableRow
                    key={index}
                  >
                    <TableCell>
                      {
                        sub.subject_code
                      }
                    </TableCell>

                    <TableCell>
                      {
                        sub.subject_name
                      }
                    </TableCell>

                    <TableCell
                      sx={{
                        fontWeight:
                          "bold",
                        color:
                          "#1e3a8a",
                      }}
                    >
                      {sub.grade}
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </DialogContent>

        <DialogActions>
          <Button
            variant="contained"
            color="error"
            onClick={() =>
              setOpenSGPA(false)
            }
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* ======================================================
          BACKLOG DETAILS DIALOG
      ====================================================== */}

      <Dialog
        open={openBacklogs}
        onClose={() =>
          setOpenBacklogs(false)
        }
        fullWidth
        maxWidth="md"
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            color: "#1e3a8a",
          }}
        >
          Semester{" "}
          {selectedSemester?.semester}{" "}
          Backlog Details
        </DialogTitle>

        <DialogContent
          sx={{ mt: 1 }}
        >
          <Table>
            <TableHead
              sx={{
                "& .MuiTableCell-head": {
                  backgroundColor:
                    "#2563eb",
                  color: "#fff",
                  fontWeight:
                    "bold",
                },
              }}
            >
              <TableRow>
                <TableCell>
                  Subject Code
                </TableCell>

                <TableCell>
                  Subject Name
                </TableCell>

                <TableCell>
                  Status
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>

              {/* CURRENT BACKLOGS */}

              {selectedSemester?.subjects.filter(
                (sub) => {
                  const grade =
                    sub.grade
                      ?.trim()
                      .toUpperCase();

                  return (
                    grade === "RA" ||
                    grade === "U" ||
                    grade === "F" ||
                    grade === "FAIL"
                  );
                }
              ).length > 0 ? (

                selectedSemester?.subjects
                  .filter((sub) => {
                    const grade =
                      sub.grade
                        ?.trim()
                        .toUpperCase();

                    return (
                      grade === "RA" ||
                      grade === "U" ||
                      grade === "F" ||
                      grade === "FAIL"
                    );
                  })
                  .map((sub) => (
                    <TableRow
                      key={
                        sub.subject_code
                      }
                    >
                      <TableCell>
                        {
                          sub.subject_code
                        }
                      </TableCell>

                      <TableCell>
                        {
                          sub.subject_name
                        }
                      </TableCell>

                      <TableCell
                        sx={{
                          color:
                            "red",
                          fontWeight:
                            "bold",
                        }}
                      >
                        {sub.grade}
                      </TableCell>
                    </TableRow>
                  ))

              ) : (

                <TableRow>
                  <TableCell
                    colSpan={3}
                    align="center"
                    sx={{
                      color:
                        "green",
                      fontWeight:
                        "bold",
                      fontSize:
                        "18px",
                      py: 3,
                    }}
                  >
                    🎉 No Current
                    Backlogs
                  </TableCell>
                </TableRow>

              )}

              {/* CLEARED ARREAR HISTORY */}

              {arrearHistory
                ?.filter(
                  (item) =>
                    Number(
                      item.semester
                    ) ===
                    Number(
                      selectedSemester?.semester
                    )
                )
                .length > 0 && (
                <>
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      sx={{
                        bgcolor:
                          "#E8F5E9",
                        color:
                          "#2E7D32",
                        fontWeight:
                          "bold",
                        textAlign:
                          "center",
                        fontSize:
                          "16px",
                      }}
                    >
                      Previously
                      Cleared
                      Arrears
                    </TableCell>
                  </TableRow>

                  {arrearHistory
                    .filter(
                      (item) =>
                        Number(
                          item.semester
                        ) ===
                        Number(
                          selectedSemester?.semester
                        )
                    )
                    .map(
                      (item) => (
                        <TableRow
                          key={
                            item.id
                          }
                        >
                          <TableCell>
                            {
                              item.subject_code
                            }
                          </TableCell>

                          <TableCell>
                            {
                              item.subject_name
                            }
                          </TableCell>

                          <TableCell
                            sx={{
                              color:
                                "green",
                              fontWeight:
                                "bold",
                            }}
                          >
                            {
                              item.old_grade
                            }{" "}
                            →{" "}
                            {
                              item.new_grade
                            }
                          </TableCell>
                        </TableRow>
                      )
                    )}

                  {/* ARREAR GPA */}

                  <TableRow>
                    <TableCell
                      colSpan={2}
                      align="right"
                      sx={{
                        fontWeight:
                          "bold",
                        color:
                          "#1565C0",
                        fontSize:
                          "16px",
                      }}
                    >
                      Arrear GPA
                    </TableCell>

                    <TableCell
                      sx={{
                        color:
                          "#1565C0",
                        fontWeight:
                          "bold",
                        fontSize:
                          "16px",
                      }}
                    >
                      {Number(
                        arrearHistory.find(
                          (item) =>
                            Number(
                              item.semester
                            ) ===
                            Number(
                              selectedSemester?.semester
                            )
                        )
                          ?.arrear_gpa ||
                          0
                      ).toFixed(3)}
                    </TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </DialogContent>

        <DialogActions>
          <Button
            variant="contained"
            color="error"
            onClick={() =>
              setOpenBacklogs(
                false
              )
            }
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default StudentProfile;