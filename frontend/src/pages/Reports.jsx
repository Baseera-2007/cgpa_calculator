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
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";

function Reports() {
  const [students, setStudents] = useState([]);
  const [batch, setBatch] = useState("2024-2028");
  const [cgpaFilter, setCgpaFilter] = useState("all");
  const [sort, setSort] = useState("desc");

  useEffect(() => {
    fetchStudents();
  }, [batch, cgpaFilter, sort]);

  // ==========================================================
  // LOAD REPORT DATA
  // ==========================================================

  const fetchStudents = async () => {
    try {
      const response = await fetch(
        `/api/report?batch=${batch}&filter=${cgpaFilter}&sort=${sort}`
      );

      const data = await response.json();

      setStudents(data);
    } catch (err) {
      console.log(err);
      setStudents([]);
    }
  };

  // ==========================================================
  // EXPORT PDF
  // ==========================================================

  const generatePDF = () => {
    window.open(
      `/api/export-pdf?batch=${batch}`,
      "_blank"
    );
  };

  // ==========================================================
  // EXPORT EXCEL
  // ==========================================================

  const generateExcel = () => {
    window.open(
      `/api/export-excel?batch=${batch}`,
      "_blank"
    );
  };

  // ==========================================================
  // SUMMARY CALCULATIONS
  // ==========================================================

  const totalStudents = students.length;

  const cgpaValues = students
    .map((student) => Number(student.current_cgpa))
    .filter((value) => !Number.isNaN(value));

  const averageCGPA =
    cgpaValues.length > 0
      ? (
          cgpaValues.reduce((sum, value) => sum + value, 0) /
          cgpaValues.length
        ).toFixed(2)
      : "—";

  const highestCGPA =
    cgpaValues.length > 0
      ? Math.max(...cgpaValues).toFixed(2)
      : "—";

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
        fontFamily: "Segoe UI, Inter, Arial, sans-serif",
      }}
    >
      {/* ======================================================
          PAGE HEADER
      ====================================================== */}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          mb: 3.5,
        }}
      >
        <AssessmentOutlinedIcon
          sx={{
            fontSize: 32,
            color: "#1e3a8a",
          }}
        />

        <Box>
          <Typography
            sx={{
              fontSize: "26px",
              fontWeight: 700,
              color: "#1e3a8a",
              lineHeight: 1.2,
              fontFamily:
                "Segoe UI, Inter, Arial, sans-serif",
            }}
          >
            Reports
          </Typography>

          <Typography
            sx={{
              mt: 0.6,
              fontSize: "14px",
              color: "#64748b",
              fontFamily:
                "Segoe UI, Inter, Arial, sans-serif",
            }}
          >
            View and export academic performance reports
          </Typography>
        </Box>
      </Box>

      {/* ======================================================
          FILTER CARD
      ====================================================== */}

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 3 },
          borderRadius: 3,
          border: "1px solid #e2e8f0",
          backgroundColor: "#ffffff",
          mb: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 2.5,
          }}
        >
          <Typography
            sx={{
              fontSize: "17px",
              fontWeight: 600,
              color: "#1e293b",
              fontFamily:
                "Segoe UI, Inter, Arial, sans-serif",
            }}
          >
            Report Filters
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 2,
          }}
        >
          {/* BATCH */}

          <FormControl fullWidth size="small">
            <InputLabel
              sx={{
                fontFamily:
                  "Segoe UI, Inter, Arial, sans-serif",
              }}
            >
              Batch
            </InputLabel>

            <Select
              value={batch}
              label="Batch"
              onChange={(e) => setBatch(e.target.value)}
              sx={{
                fontSize: "14px",
                fontFamily:
                  "Segoe UI, Inter, Arial, sans-serif",
                borderRadius: 2,
                "& .MuiSelect-select": {
                  fontFamily:
                    "Segoe UI, Inter, Arial, sans-serif",
                },
              }}
            >
              <MenuItem
                value="2023-2027"
                sx={{
                  fontFamily:
                    "Segoe UI, Inter, Arial, sans-serif",
                  fontSize: "14px",
                }}
              >
                2023-2027
              </MenuItem>

              <MenuItem
                value="2024-2028"
                sx={{
                  fontFamily:
                    "Segoe UI, Inter, Arial, sans-serif",
                  fontSize: "14px",
                }}
              >
                2024-2028
              </MenuItem>

              <MenuItem
                value="2025-2029"
                sx={{
                  fontFamily:
                    "Segoe UI, Inter, Arial, sans-serif",
                  fontSize: "14px",
                }}
              >
                2025-2029
              </MenuItem>
            </Select>
          </FormControl>

          {/* CGPA FILTER */}

          <FormControl fullWidth size="small">
            <InputLabel
              sx={{
                fontFamily:
                  "Segoe UI, Inter, Arial, sans-serif",
              }}
            >
              CGPA Filter
            </InputLabel>

            <Select
              value={cgpaFilter}
              label="CGPA Filter"
              onChange={(e) =>
                setCgpaFilter(e.target.value)
              }
              sx={{
                fontSize: "14px",
                fontFamily:
                  "Segoe UI, Inter, Arial, sans-serif",
                borderRadius: 2,
                "& .MuiSelect-select": {
                  fontFamily:
                    "Segoe UI, Inter, Arial, sans-serif",
                },
              }}
            >
              <MenuItem
                value="all"
                sx={{
                  fontFamily:
                    "Segoe UI, Inter, Arial, sans-serif",
                  fontSize: "14px",
                }}
              >
                All Students
              </MenuItem>

              <MenuItem
                value="9"
                sx={{
                  fontFamily:
                    "Segoe UI, Inter, Arial, sans-serif",
                  fontSize: "14px",
                }}
              >
                Above 9
              </MenuItem>

              <MenuItem
                value="8.5"
                sx={{
                  fontFamily:
                    "Segoe UI, Inter, Arial, sans-serif",
                  fontSize: "14px",
                }}
              >
                Above 8.5
              </MenuItem>

              <MenuItem
                value="8"
                sx={{
                  fontFamily:
                    "Segoe UI, Inter, Arial, sans-serif",
                  fontSize: "14px",
                }}
              >
                Above 8
              </MenuItem>

              <MenuItem
                value="7.5"
                sx={{
                  fontFamily:
                    "Segoe UI, Inter, Arial, sans-serif",
                  fontSize: "14px",
                }}
              >
                Above 7.5
              </MenuItem>

              <MenuItem
                value="below7.5"
                sx={{
                  fontFamily:
                    "Segoe UI, Inter, Arial, sans-serif",
                  fontSize: "14px",
                }}
              >
                Below 7.5
              </MenuItem>
            </Select>
          </FormControl>

          {/* SORT */}

          <FormControl fullWidth size="small">
            <InputLabel
              sx={{
                fontFamily:
                  "Segoe UI, Inter, Arial, sans-serif",
              }}
            >
              Sort By
            </InputLabel>

            <Select
              value={sort}
              label="Sort By"
              onChange={(e) => setSort(e.target.value)}
              sx={{
                fontSize: "14px",
                fontFamily:
                  "Segoe UI, Inter, Arial, sans-serif",
                borderRadius: 2,
                "& .MuiSelect-select": {
                  fontFamily:
                    "Segoe UI, Inter, Arial, sans-serif",
                },
              }}
            >
              <MenuItem
                value="desc"
                sx={{
                  fontFamily:
                    "Segoe UI, Inter, Arial, sans-serif",
                  fontSize: "14px",
                }}
              >
                Highest CGPA
              </MenuItem>

              <MenuItem
                value="asc"
                sx={{
                  fontFamily:
                    "Segoe UI, Inter, Arial, sans-serif",
                  fontSize: "14px",
                }}
              >
                Lowest CGPA
              </MenuItem>

              <MenuItem
                value="name"
                sx={{
                  fontFamily:
                    "Segoe UI, Inter, Arial, sans-serif",
                  fontSize: "14px",
                }}
              >
                Student Name
              </MenuItem>

              <MenuItem
                value="reg"
                sx={{
                  fontFamily:
                    "Segoe UI, Inter, Arial, sans-serif",
                  fontSize: "14px",
                }}
              >
                Register Number
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* ======================================================
          SUMMARY CARDS
      ====================================================== */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(3, 1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >
        {/* TOTAL STUDENTS */}

        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: 3,
            border: "1px solid #dbeafe",
            backgroundColor: "#ffffff",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              backgroundColor: "#eff6ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <GroupsOutlinedIcon
              sx={{
                color: "#2563eb",
                fontSize: 24,
              }}
            />
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: "13px",
                color: "#64748b",
                mb: 0.4,
                fontFamily:
                  "Segoe UI, Inter, Arial, sans-serif",
              }}
            >
              Total Students
            </Typography>

            <Typography
              sx={{
                fontSize: "23px",
                fontWeight: 600,
                color: "#1e293b",
                lineHeight: 1.2,
                fontFamily:
                  "Segoe UI, Inter, Arial, sans-serif",
              }}
            >
              {totalStudents}
            </Typography>
          </Box>
        </Paper>

        {/* AVERAGE CGPA */}

        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: 3,
            border: "1px solid #dbeafe",
            backgroundColor: "#ffffff",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              backgroundColor: "#eff6ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <TrendingUpOutlinedIcon
              sx={{
                color: "#2563eb",
                fontSize: 24,
              }}
            />
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: "13px",
                color: "#64748b",
                mb: 0.4,
                fontFamily:
                  "Segoe UI, Inter, Arial, sans-serif",
              }}
            >
              Average CGPA
            </Typography>

            <Typography
              sx={{
                fontSize: "23px",
                fontWeight: 600,
                color: "#1e293b",
                lineHeight: 1.2,
                fontFamily:
                  "Segoe UI, Inter, Arial, sans-serif",
              }}
            >
              {averageCGPA}
            </Typography>
          </Box>
        </Paper>

        {/* HIGHEST CGPA */}

        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: 3,
            border: "1px solid #dbeafe",
            backgroundColor: "#ffffff",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              backgroundColor: "#eff6ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <EmojiEventsOutlinedIcon
              sx={{
                color: "#2563eb",
                fontSize: 24,
              }}
            />
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: "13px",
                color: "#64748b",
                mb: 0.4,
                fontFamily:
                  "Segoe UI, Inter, Arial, sans-serif",
              }}
            >
              Highest CGPA
            </Typography>

            <Typography
              sx={{
                fontSize: "23px",
                fontWeight: 600,
                color: "#1e293b",
                lineHeight: 1.2,
                fontFamily:
                  "Segoe UI, Inter, Arial, sans-serif",
              }}
            >
              {highestCGPA}
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* ======================================================
          STUDENT REPORT SECTION
      ====================================================== */}

      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid #e2e8f0",
          backgroundColor: "#ffffff",
          overflow: "hidden",
        }}
      >
        {/* TABLE HEADER */}

        <Box
          sx={{
            px: { xs: 2, md: 3 },
            py: 2.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#1e293b",
                fontFamily:
                  "Segoe UI, Inter, Arial, sans-serif",
              }}
            >
              Student Report
            </Typography>

            <Typography
              sx={{
                mt: 0.5,
                fontSize: "13px",
                color: "#64748b",
                fontFamily:
                  "Segoe UI, Inter, Arial, sans-serif",
              }}
            >
              {totalStudents}{" "}
              {totalStudents === 1
                ? "student"
                : "students"}{" "}
              displayed
            </Typography>
          </Box>

          {/* EXPORT BUTTONS */}

          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              startIcon={<PictureAsPdfIcon />}
              onClick={generatePDF}
              sx={{
                backgroundColor: "#1e3a8a",
                borderRadius: 2,
                px: 2,
                py: 1,
                textTransform: "none",
                fontSize: "13px",
                fontWeight: 500,
                fontFamily:
                  "Segoe UI, Inter, Arial, sans-serif",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "#172554",
                  boxShadow: "none",
                },
              }}
            >
              Generate PDF
            </Button>

            <Button
              variant="contained"
              startIcon={<TableViewIcon />}
              onClick={generateExcel}
              sx={{
                backgroundColor: "#15803d",
                borderRadius: 2,
                px: 2,
                py: 1,
                textTransform: "none",
                fontSize: "13px",
                fontWeight: 500,
                fontFamily:
                  "Segoe UI, Inter, Arial, sans-serif",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "#166534",
                  boxShadow: "none",
                },
              }}
            >
              Generate Excel
            </Button>
          </Box>
        </Box>

        {/* ====================================================
            TABLE
        ==================================================== */}

        <TableContainer
          sx={{
            width: "100%",
            overflowX: "auto",
          }}
        >
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: "#1e3a8a",
                }}
              >
                <TableCell
                  sx={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#ffffff",
                    py: 1.8,
                    borderBottom:
                      "1px solid #e2e8f0",
                    whiteSpace: "nowrap",
                    fontFamily:
                      "Segoe UI, Inter, Arial, sans-serif",
                  }}
                >
                  Register No
                </TableCell>

                <TableCell
                  sx={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#ffffff",
                    py: 1.8,
                    borderBottom:
                      "1px solid #e2e8f0",
                    fontFamily:
                      "Segoe UI, Inter, Arial, sans-serif",
                  }}
                >
                  Student Name
                </TableCell>

                <TableCell
                  sx={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#ffffff",
                    py: 1.8,
                    borderBottom:
                      "1px solid #e2e8f0",
                    fontFamily:
                      "Segoe UI, Inter, Arial, sans-serif",
                  }}
                >
                  Department
                </TableCell>

                <TableCell
                  sx={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#ffffff",
                    py: 1.8,
                    borderBottom:
                      "1px solid #e2e8f0",
                    fontFamily:
                      "Segoe UI, Inter, Arial, sans-serif",
                  }}
                >
                  Batch
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#ffffff",
                    py: 1.8,
                    borderBottom:
                      "1px solid #e2e8f0",
                    fontFamily:
                      "Segoe UI, Inter, Arial, sans-serif",
                  }}
                >
                  CGPA
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {students.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    align="center"
                    sx={{
                      py: 7,
                      borderBottom: "none",
                    }}
                  >
                    <AssessmentOutlinedIcon
                      sx={{
                        fontSize: 40,
                        color: "#94a3b8",
                        mb: 1,
                      }}
                    />

                    <Typography
                      sx={{
                        fontSize: "15px",
                        fontWeight: 500,
                        color: "#475569",
                        fontFamily:
                          "Segoe UI, Inter, Arial, sans-serif",
                      }}
                    >
                      No students found
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.5,
                        fontSize: "13px",
                        color: "#94a3b8",
                        fontFamily:
                          "Segoe UI, Inter, Arial, sans-serif",
                      }}
                    >
                      Try changing the selected batch or
                      CGPA filter.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                students.map((student) => (
                  <TableRow
                    key={student.id}
                    hover
                    sx={{
                      "&:last-child td": {
                        borderBottom: 0,
                      },
                      "&:hover": {
                        backgroundColor: "#f8fafc",
                      },
                    }}
                  >
                    <TableCell
                      sx={{
                        fontSize: "14px",
                        color: "#334155",
                        py: 1.8,
                        fontFamily:
                          "Segoe UI, Inter, Arial, sans-serif",
                      }}
                    >
                      {student.register_number}
                    </TableCell>

                    <TableCell
                      sx={{
                        fontSize: "14px",
                        color: "#1e293b",
                        py: 1.8,
                        fontFamily:
                          "Segoe UI, Inter, Arial, sans-serif",
                      }}
                    >
                      {student.student_name}
                    </TableCell>

                    <TableCell
                      sx={{
                        fontSize: "14px",
                        color: "#475569",
                        py: 1.8,
                        fontFamily:
                          "Segoe UI, Inter, Arial, sans-serif",
                      }}
                    >
                      {student.department}
                    </TableCell>

                    <TableCell
                      sx={{
                        fontSize: "14px",
                        color: "#475569",
                        py: 1.8,
                        fontFamily:
                          "Segoe UI, Inter, Arial, sans-serif",
                      }}
                    >
                      {student.batch}
                    </TableCell>

                    <TableCell
                      align="center"
                      sx={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#1e3a8a",
                        py: 1.8,
                        fontFamily:
                          "Segoe UI, Inter, Arial, sans-serif",
                      }}
                    >
                      {student.current_cgpa}
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

export default Reports;