import React, { useEffect, useState } from "react";

const API_BASE_URL = "http://127.0.0.1:8000";

function SubjectAttendance() {
  // ==========================================================
  // STATE
  // ==========================================================

  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);

  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [attendance, setAttendance] = useState({});

  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ==========================================================
  // GET LOGGED-IN FACULTY
  // ==========================================================

  const getLoggedInFaculty = () => {
    try {
      const user =
        JSON.parse(localStorage.getItem("user")) ||
        JSON.parse(localStorage.getItem("loggedInUser"));

      if (user) {
        return user.username || user.faculty_id || "Faculty";
      }

      return "Faculty";
    } catch {
      return "Faculty";
    }
  };

  // ==========================================================
  // LOAD SUBJECTS
  // ==========================================================

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    setLoadingSubjects(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/assigned-subjects/all`
      );

      if (!response.ok) {
        throw new Error("Failed to load subjects.");
      }

      const data = await response.json();

      setSubjects(data);
    } catch (err) {
      console.error("SUBJECT LOAD ERROR:", err);
      setError("Unable to load assigned subjects.");
    } finally {
      setLoadingSubjects(false);
    }
  };

  // ==========================================================
  // LOAD STUDENTS + EXISTING ATTENDANCE
  // ==========================================================

  const loadStudents = async () => {
    if (!selectedSubject) {
      setError("Please select a subject.");
      return;
    }

    if (!selectedDate) {
      setError("Please select a date.");
      return;
    }

    setLoadingStudents(true);
    setError("");
    setMessage("");

    try {
      // ------------------------------------------------------
      // LOAD STUDENTS
      // ------------------------------------------------------

      const studentsResponse = await fetch(
        `${API_BASE_URL}/subject-attendance/students?assigned_subject_id=${selectedSubject}`
      );

      if (!studentsResponse.ok) {
        const errorData = await studentsResponse
          .json()
          .catch(() => null);

        throw new Error(
          errorData?.detail || "Failed to load students."
        );
      }

      const studentsData = await studentsResponse.json();

      // ------------------------------------------------------
      // LOAD EXISTING ATTENDANCE
      // ------------------------------------------------------

      const attendanceResponse = await fetch(
        `${API_BASE_URL}/subject-attendance?assigned_subject_id=${selectedSubject}&attendance_date=${selectedDate}`
      );

      if (!attendanceResponse.ok) {
        const errorData = await attendanceResponse
          .json()
          .catch(() => null);

        throw new Error(
          errorData?.detail ||
            "Failed to load existing attendance."
        );
      }

      const attendanceData = await attendanceResponse.json();

      // ------------------------------------------------------
      // STORE STUDENTS
      // ------------------------------------------------------

      setStudents(studentsData);

      // ------------------------------------------------------
      // CREATE ATTENDANCE MAP
      // ------------------------------------------------------

      const newAttendance = {};

      attendanceData.students.forEach((student) => {
        if (student.status) {
          newAttendance[student.student_id] = student.status;
        }
      });

      setAttendance(newAttendance);
    } catch (err) {
      console.error("STUDENT LOAD ERROR:", err);

      setStudents([]);
      setAttendance({});

      setError(
        err.message || "Unable to load students."
      );
    } finally {
      setLoadingStudents(false);
    }
  };

  // ==========================================================
  // CHANGE ATTENDANCE STATUS
  // ==========================================================

  const changeAttendance = (studentId, status) => {
    setAttendance((previous) => ({
      ...previous,
      [studentId]: status,
    }));

    setMessage("");
    setError("");
  };

  // ==========================================================
  // MARK ALL PRESENT
  // ==========================================================

  const markAllPresent = () => {
    const updated = {};

    students.forEach((student) => {
      updated[student.student_id] = "Present";
    });

    setAttendance(updated);

    setMessage("");
    setError("");
  };

  // ==========================================================
  // MARK ALL ABSENT
  // ==========================================================

  const markAllAbsent = () => {
    const updated = {};

    students.forEach((student) => {
      updated[student.student_id] = "Absent";
    });

    setAttendance(updated);

    setMessage("");
    setError("");
  };

  // ==========================================================
  // CLEAR ATTENDANCE
  // ==========================================================

  const clearAttendance = () => {
    setAttendance({});
    setMessage("");
    setError("");
  };

  // ==========================================================
  // SAVE ATTENDANCE
  // ==========================================================

  const saveAttendance = async () => {
    if (!selectedSubject) {
      setError("Please select a subject.");
      return;
    }

    if (!selectedDate) {
      setError("Please select a date.");
      return;
    }

    if (students.length === 0) {
      setError("No students available.");
      return;
    }

    // --------------------------------------------------------
    // CHECK UNMARKED STUDENTS
    // --------------------------------------------------------

    const unmarkedStudents = students.filter(
      (student) => !attendance[student.student_id]
    );

    if (unmarkedStudents.length > 0) {
      setError(
        `Please mark attendance for all students. ${unmarkedStudents.length} student(s) are still unmarked.`
      );
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const attendanceList = students.map((student) => ({
        student_id: student.student_id,
        status: attendance[student.student_id],
      }));

      const response = await fetch(
        `${API_BASE_URL}/subject-attendance/bulk`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            assigned_subject_id: Number(selectedSubject),
            attendance_date: selectedDate,
            marked_by: getLoggedInFaculty(),
            attendance: attendanceList,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail || "Failed to save attendance."
        );
      }

      setMessage(
        `Attendance saved successfully! ${data.total} record(s) processed.`
      );
    } catch (err) {
      console.error("SAVE ATTENDANCE ERROR:", err);

      setError(
        err.message || "Unable to save attendance."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================================
  // WHATSAPP SHARE
  // ==========================================================

  const shareWhatsApp = () => {
    if (!selectedSubject) {
      setError("Please select a subject.");
      return;
    }

    if (students.length === 0) {
      setError("Please load students first.");
      return;
    }

    const subject = subjects.find(
      (item) =>
        String(item.id) === String(selectedSubject)
    );

    if (!subject) {
      setError("Subject information not found.");
      return;
    }

    const presentCount = students.filter(
      (student) =>
        attendance[student.student_id] === "Present"
    ).length;

    const absentCount = students.filter(
      (student) =>
        attendance[student.student_id] === "Absent"
    ).length;

    const odCount = students.filter(
      (student) =>
        attendance[student.student_id] === "OD"
    ).length;

    const message = `
📚 Subject Attendance

Subject: ${subject.subject_name}
Code: ${subject.subject_code}
Date: ${selectedDate}
Batch: ${subject.batch}
Semester: ${subject.semester}

Total Students: ${students.length}
🟢 Present: ${presentCount}
🔴 Absent: ${absentCount}
🟠 OD: ${odCount}

Attendance has been recorded successfully.
`.trim();

    const whatsappUrl =
      `https://wa.me/?text=${encodeURIComponent(message)}`;

    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // ==========================================================
  // SELECTED SUBJECT
  // ==========================================================

  const selectedSubjectData = subjects.find(
    (subject) =>
      String(subject.id) === String(selectedSubject)
  );

  // ==========================================================
  // COUNTS
  // ==========================================================

  const presentCount = students.filter(
    (student) =>
      attendance[student.student_id] === "Present"
  ).length;

  const absentCount = students.filter(
    (student) =>
      attendance[student.student_id] === "Absent"
  ).length;

  const odCount = students.filter(
    (student) =>
      attendance[student.student_id] === "OD"
  ).length;

  const unmarkedCount =
    students.length -
    presentCount -
    absentCount -
    odCount;

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div style={styles.page}>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            Subject Attendance
          </h1>

          <p style={styles.subtitle}>
            Manage attendance for individual subjects
          </p>
        </div>
      </div>


      {/* =====================================================
          SELECTION CARD
      ===================================================== */}

      <div style={styles.card}>

        <h2 style={styles.cardTitle}>
          Attendance Details
        </h2>

        <div style={styles.formGrid}>

          {/* SUBJECT */}

          <div style={styles.formGroup}>

            <label style={styles.label}>
              Subject
            </label>

            <select
              value={selectedSubject}
              onChange={(e) => {
                setSelectedSubject(e.target.value);
                setStudents([]);
                setAttendance({});
                setMessage("");
                setError("");
              }}
              style={styles.select}
              disabled={loadingSubjects}
            >

              <option value="">
                {loadingSubjects
                  ? "Loading subjects..."
                  : "Select Subject"}
              </option>

              {subjects.map((subject) => (
                <option
                  key={subject.id}
                  value={subject.id}
                >
                  {subject.subject_code} -{" "}
                  {subject.subject_name}
                </option>
              ))}

            </select>

          </div>


          {/* DATE */}

          <div style={styles.formGroup}>

            <label style={styles.label}>
              Date
            </label>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setStudents([]);
                setAttendance({});
                setMessage("");
                setError("");
              }}
              style={styles.input}
            />

          </div>

        </div>


        {/* SELECTED SUBJECT INFO */}

        {selectedSubjectData && (
          <div style={styles.subjectInfo}>

            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>
                Subject
              </span>

              <span style={styles.infoValue}>
                {selectedSubjectData.subject_name}
              </span>
            </div>

            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>
                Code
              </span>

              <span style={styles.infoValue}>
                {selectedSubjectData.subject_code}
              </span>
            </div>

            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>
                Batch
              </span>

              <span style={styles.infoValue}>
                {selectedSubjectData.batch}
              </span>
            </div>

            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>
                Semester
              </span>

              <span style={styles.infoValue}>
                {selectedSubjectData.semester}
              </span>
            </div>

          </div>
        )}


        {/* LOAD + CLEAR */}

        <div style={styles.selectionActions}>

          <button
            onClick={loadStudents}
            disabled={
              loadingStudents ||
              !selectedSubject ||
              !selectedDate
            }
            style={{
              ...styles.primaryButton,
              opacity:
                loadingStudents ||
                !selectedSubject ||
                !selectedDate
                  ? 0.6
                  : 1,
            }}
          >
            {loadingStudents
              ? "Loading Students..."
              : "Load Students"}
          </button>

          <button
            onClick={() => {
              setStudents([]);
              setAttendance({});
              setMessage("");
              setError("");
            }}
            style={styles.topClearButton}
          >
            Clear
          </button>

        </div>

      </div>


      {/* =====================================================
          MESSAGE
      ===================================================== */}

      {message && (
        <div style={styles.successMessage}>
          <span style={styles.messageIcon}>✓</span>
          {message}
        </div>
      )}

      {error && (
        <div style={styles.errorMessage}>
          <span style={styles.messageIcon}>!</span>
          {error}
        </div>
      )}


      {/* =====================================================
          STUDENTS SECTION
      ===================================================== */}

      {students.length > 0 && (

        <div style={styles.card}>

          {/* HEADER */}

          <div style={styles.tableHeader}>

            <div>
              <h2 style={styles.cardTitle}>
                Student Attendance
              </h2>

              <p style={styles.studentCount}>
                {students.length} students
              </p>
            </div>


            {/* QUICK ACTIONS */}

            <div style={styles.quickActions}>

              <button
                onClick={markAllPresent}
                style={styles.presentButton}
              >
                ✓ Mark All Present
              </button>

              <button
                onClick={markAllAbsent}
                style={styles.absentButton}
              >
                ✕ Mark All Absent
              </button>

              <button
                onClick={clearAttendance}
                style={styles.clearButton}
              >
                Clear
              </button>

            </div>

          </div>


          {/* =================================================
              SUMMARY
          ================================================= */}

          <div style={styles.summaryContainer}>

            <div style={styles.summaryPresent}>
              <span>Present</span>
              <strong>{presentCount}</strong>
            </div>

            <div style={styles.summaryAbsent}>
              <span>Absent</span>
              <strong>{absentCount}</strong>
            </div>

            <div style={styles.summaryOD}>
              <span>OD</span>
              <strong>{odCount}</strong>
            </div>

            <div style={styles.summaryUnmarked}>
              <span>Unmarked</span>
              <strong>{unmarkedCount}</strong>
            </div>

          </div>


          {/* =================================================
              TABLE
          ================================================= */}

          <div style={styles.tableWrapper}>

            <table style={styles.table}>

              <thead>

                <tr>

                  <th
                    style={{
                      ...styles.th,
                      width: "55px",
                    }}
                  >
                    #
                  </th>

                  <th
                    style={{
                      ...styles.th,
                      width: "180px",
                    }}
                  >
                    Register Number
                  </th>

                  <th style={styles.th}>
                    Student Name
                  </th>

                  <th
                    style={{
                      ...styles.th,
                      minWidth: "350px",
                    }}
                  >
                    Attendance
                  </th>

                </tr>

              </thead>


              <tbody>

                {students.map((student, index) => {

                  const currentStatus =
                    attendance[student.student_id];

                  return (

                    <tr
                      key={student.student_id}
                      style={styles.tr}
                    >

                      {/* # */}

                      <td style={styles.td}>
                        {index + 1}
                      </td>


                      {/* REGISTER NUMBER */}

                      <td
                        style={{
                          ...styles.td,
                          fontWeight: "500",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {student.register_number}
                      </td>


                      {/* STUDENT NAME */}

                      <td
                        style={{
                          ...styles.td,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {student.student_name}
                      </td>


                      {/* ATTENDANCE */}

                      <td
                        style={{
                          ...styles.td,
                          paddingLeft: "24px",
                          paddingRight: "18px",
                        }}
                      >

                        <div style={styles.statusContainer}>

                          {/* PRESENT */}

                          <button
                            onClick={() =>
                              changeAttendance(
                                student.student_id,
                                "Present"
                              )
                            }
                            style={{
                              ...styles.statusButton,
                              ...(currentStatus ===
                              "Present"
                                ? styles.presentSelected
                                : {}),
                            }}
                          >
                            ✓ Present
                          </button>


                          {/* ABSENT */}

                          <button
                            onClick={() =>
                              changeAttendance(
                                student.student_id,
                                "Absent"
                              )
                            }
                            style={{
                              ...styles.statusButton,
                              ...(currentStatus ===
                              "Absent"
                                ? styles.absentSelected
                                : {}),
                            }}
                          >
                            ✕ Absent
                          </button>


                          {/* OD */}

                          <button
                            onClick={() =>
                              changeAttendance(
                                student.student_id,
                                "OD"
                              )
                            }
                            style={{
                              ...styles.statusButton,
                              ...(currentStatus === "OD"
                                ? styles.odSelected
                                : {}),
                            }}
                          >
                            ● OD
                          </button>

                        </div>

                      </td>

                    </tr>

                  );
                })}

              </tbody>

            </table>

          </div>


          {/* =================================================
              FOOTER ACTIONS
          ================================================= */}

          <div style={styles.footerActions}>

            <button
              onClick={saveAttendance}
              disabled={saving}
              style={{
                ...styles.saveButton,
                opacity: saving ? 0.6 : 1,
              }}
            >
              {saving
                ? "Saving..."
                : "Save Attendance"}
            </button>


            <button
              onClick={shareWhatsApp}
              style={styles.whatsappButton}
            >
              Share WhatsApp
            </button>

          </div>

        </div>

      )}


      {/* =====================================================
          NO STUDENTS
      ===================================================== */}

      {!loadingStudents &&
        selectedSubject &&
        students.length === 0 && (
          <div style={styles.emptyState}>

            <div style={styles.emptyIcon}>
              👥
            </div>

            <h3 style={styles.emptyTitle}>
              No Students Loaded
            </h3>

            <p style={styles.emptyText}>
              Select a subject and date, then click
              "Load Students".
            </p>

          </div>
        )}

    </div>
  );
}


// ==========================================================
// STYLES
// ==========================================================

const styles = {

  page: {
    minHeight: "100vh",
    padding: "28px 30px 40px",
    background: "#f5f7fb",
    boxSizing: "border-box",
    fontFamily:
      '"Segoe UI", "Inter", Arial, sans-serif',
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },

  title: {
    margin: 0,
    fontSize: "28px",
    fontWeight: "650",
    color: "#1e3a8a",
    letterSpacing: "-0.3px",
  },

  subtitle: {
    marginTop: "6px",
    marginBottom: 0,
    color: "#6b7280",
    fontSize: "14px",
  },

  card: {
    background: "#ffffff",
    borderRadius: "14px",
    padding: "24px",
    marginBottom: "22px",
    boxShadow:
      "0 2px 10px rgba(15, 23, 42, 0.06)",
    border: "1px solid #eef2f7",
  },

  cardTitle: {
    margin: 0,
    color: "#1f2937",
    fontSize: "19px",
    fontWeight: "600",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "18px",
    marginTop: "20px",
    marginBottom: "18px",
  },

  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },

  label: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#374151",
  },

  select: {
    width: "100%",
    height: "44px",
    padding: "0 12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    background: "#ffffff",
    color: "#111827",
    fontSize: "14px",
    fontFamily:
      '"Segoe UI", "Inter", Arial, sans-serif',
    outline: "none",
    boxSizing: "border-box",
    cursor: "pointer",
  },

  input: {
  width: "100%",
  height: "44px",
  padding: "0 12px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  background: "#ffffff",
  color: "#111827",
  fontSize: "14px",
  fontFamily: '"Segoe UI", "Inter", "Arial", sans-serif',
  outline: "none",
  boxSizing: "border-box",
},

  subjectInfo: {
    display: "grid",
    gridTemplateColumns:
      "minmax(220px, 2fr) repeat(3, minmax(120px, 1fr))",
    gap: "14px",
    background: "#f8fafc",
    borderRadius: "10px",
    padding: "15px 16px",
    marginBottom: "18px",
    border: "1px solid #eef2f7",
  },

  infoItem: {
    minWidth: 0,
  },

  infoLabel: {
    display: "block",
    fontSize: "11px",
    color: "#6b7280",
    marginBottom: "4px",
  },

  infoValue: {
    display: "block",
    color: "#374151",
    fontSize: "13px",
    fontWeight: "500",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  selectionActions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
  },

  primaryButton: {
    border: "none",
    borderRadius: "8px",
    padding: "11px 20px",
    background: "#1e3a8a",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "500",
    fontFamily:
      '"Segoe UI", "Inter", Arial, sans-serif',
    cursor: "pointer",
    transition: "0.2s",
  },

  topClearButton: {
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    padding: "10px 19px",
    background: "#ffffff",
    color: "#4b5563",
    fontSize: "13px",
    fontWeight: "500",
    fontFamily:
      '"Segoe UI", "Inter", Arial, sans-serif',
    cursor: "pointer",
  },

  successMessage: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    background: "#ecfdf5",
    color: "#047857",
    border: "1px solid #a7f3d0",
    borderRadius: "8px",
    padding: "12px 15px",
    marginBottom: "18px",
    fontSize: "13px",
  },

  errorMessage: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    background: "#fef2f2",
    color: "#b91c1c",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    padding: "12px 15px",
    marginBottom: "18px",
    fontSize: "13px",
  },

  messageIcon: {
    fontWeight: "700",
  },

  tableHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "18px",
    marginBottom: "18px",
    flexWrap: "wrap",
  },

  studentCount: {
    margin: "5px 0 0",
    color: "#6b7280",
    fontSize: "12px",
  },

  quickActions: {
    display: "flex",
    gap: "9px",
    flexWrap: "wrap",
  },

  presentButton: {
    border: "1px solid #86efac",
    background: "#f0fdf4",
    color: "#15803d",
    padding: "8px 12px",
    borderRadius: "7px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "500",
    fontFamily:
      '"Segoe UI", "Inter", Arial, sans-serif',
  },

  absentButton: {
    border: "1px solid #fca5a5",
    background: "#fef2f2",
    color: "#dc2626",
    padding: "8px 12px",
    borderRadius: "7px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "500",
    fontFamily:
      '"Segoe UI", "Inter", Arial, sans-serif',
  },

  clearButton: {
    border: "1px solid #d1d5db",
    background: "#ffffff",
    color: "#4b5563",
    padding: "8px 13px",
    borderRadius: "7px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "500",
    fontFamily:
      '"Segoe UI", "Inter", Arial, sans-serif',
  },

  summaryContainer: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(120px, 1fr))",
    gap: "12px",
    marginBottom: "20px",
  },

  summaryPresent: {
    padding: "12px 14px",
    borderRadius: "9px",
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    color: "#15803d",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "13px",
  },

  summaryAbsent: {
    padding: "12px 14px",
    borderRadius: "9px",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#dc2626",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "13px",
  },

  summaryOD: {
    padding: "12px 14px",
    borderRadius: "9px",
    background: "#fff7ed",
    border: "1px solid #fed7aa",
    color: "#ea580c",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "13px",
  },

  summaryUnmarked: {
    padding: "12px 14px",
    borderRadius: "9px",
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    color: "#6b7280",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "13px",
  },

  tableWrapper: {
    width: "100%",
    overflowX: "auto",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "850px",
  },

  th: {
    padding: "13px 14px",
    textAlign: "left",
    background: "#f8fafc",
    color: "#374151",
    fontSize: "12px",
    fontWeight: "600",
    borderBottom: "1px solid #e5e7eb",
  },

  td: {
    padding: "14px",
    color: "#374151",
    fontSize: "13px",
    borderBottom: "1px solid #f1f5f9",
    textAlign: "left",
    verticalAlign: "middle",
  },

  tr: {
    background: "#ffffff",
    transition: "background 0.15s",
  },

  statusContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "nowrap",
  },

  statusButton: {
    minWidth: "88px",
    padding: "8px 12px",
    borderRadius: "7px",
    border: "1px solid #d1d5db",
    background: "#ffffff",
    color: "#4b5563",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "500",
    fontFamily:
      '"Segoe UI", "Inter", Arial, sans-serif',
    transition:
      "background 0.15s, border-color 0.15s, transform 0.15s",
  },

  presentSelected: {
    background: "#22c55e",
    borderColor: "#22c55e",
    color: "#ffffff",
  },

  absentSelected: {
    background: "#ef4444",
    borderColor: "#ef4444",
    color: "#ffffff",
  },

  odSelected: {
    background: "#f97316",
    borderColor: "#f97316",
    color: "#ffffff",
  },

  footerActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "20px",
    flexWrap: "wrap",
  },

  saveButton: {
    border: "none",
    borderRadius: "8px",
    padding: "11px 21px",
    background: "#1e3a8a",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "500",
    fontFamily:
      '"Segoe UI", "Inter", Arial, sans-serif',
    cursor: "pointer",
  },

  whatsappButton: {
    border: "none",
    borderRadius: "8px",
    padding: "11px 21px",
    background: "#25d366",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "500",
    fontFamily:
      '"Segoe UI", "Inter", Arial, sans-serif',
    cursor: "pointer",
  },

  emptyState: {
    background: "#ffffff",
    borderRadius: "14px",
    padding: "45px 25px",
    textAlign: "center",
    boxShadow:
      "0 2px 10px rgba(15, 23, 42, 0.05)",
    border: "1px solid #eef2f7",
    color: "#6b7280",
  },

  emptyIcon: {
    fontSize: "36px",
    marginBottom: "8px",
  },

  emptyTitle: {
    margin: "0 0 6px",
    color: "#374151",
    fontSize: "17px",
    fontWeight: "600",
  },

  emptyText: {
    margin: 0,
    color: "#6b7280",
    fontSize: "13px",
  },
};

export default SubjectAttendance;