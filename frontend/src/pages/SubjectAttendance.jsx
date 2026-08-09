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

  const [section, setSection] = useState("");

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
        `${API_BASE_URL}/subject-attendance/students?assigned_subject_id=${selectedSubject}${
          section ? `&section=${encodeURIComponent(section)}` : ""
        }`
      );

      if (!studentsResponse.ok) {
        const errorData = await studentsResponse.json().catch(() => null);

        throw new Error(
          errorData?.detail || "Failed to load students."
        );
      }

      const studentsData = await studentsResponse.json();

      // ------------------------------------------------------
      // LOAD EXISTING ATTENDANCE
      // ------------------------------------------------------

      const attendanceResponse = await fetch(
        `${API_BASE_URL}/subject-attendance?assigned_subject_id=${selectedSubject}&attendance_date=${selectedDate}${
          section ? `&section=${encodeURIComponent(section)}` : ""
        }`
      );

      if (!attendanceResponse.ok) {
        const errorData = await attendanceResponse.json().catch(() => null);

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
      (item) => String(item.id) === String(selectedSubject)
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

  const unmarkedCount = students.length -
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


          {/* SECTION */}

          <div style={styles.formGroup}>

            <label style={styles.label}>
              Section
            </label>

            <select
              value={section}
              onChange={(e) => {
                setSection(e.target.value);
                setStudents([]);
                setAttendance({});
                setMessage("");
                setError("");
              }}
              style={styles.select}
            >

              <option value="">
                All Sections
              </option>

              <option value="A">
                Section A
              </option>

              <option value="B">
                Section B
              </option>

              <option value="C">
                Section C
              </option>

              <option value="D">
                Section D
              </option>

            </select>

          </div>

        </div>


        {/* SELECTED SUBJECT INFO */}

        {selectedSubjectData && (
          <div style={styles.subjectInfo}>

            <div>
              <span style={styles.infoLabel}>
                Subject
              </span>

              <strong>
                {selectedSubjectData.subject_name}
              </strong>
            </div>

            <div>
              <span style={styles.infoLabel}>
                Code
              </span>

              <strong>
                {selectedSubjectData.subject_code}
              </strong>
            </div>

            <div>
              <span style={styles.infoLabel}>
                Batch
              </span>

              <strong>
                {selectedSubjectData.batch}
              </strong>
            </div>

            <div>
              <span style={styles.infoLabel}>
                Semester
              </span>

              <strong>
                {selectedSubjectData.semester}
              </strong>
            </div>

          </div>
        )}


        {/* LOAD BUTTON */}

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

      </div>


      {/* =====================================================
          MESSAGE
      ===================================================== */}

      {message && (
        <div style={styles.successMessage}>
          ✓ {message}
        </div>
      )}

      {error && (
        <div style={styles.errorMessage}>
          ⚠ {error}
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

                  <th style={styles.th}>
                    #
                  </th>

                  <th style={styles.th}>
                    Register Number
                  </th>

                  <th style={styles.th}>
                    Student Name
                  </th>

                  <th style={styles.th}>
                    Section
                  </th>

                  <th style={styles.th}>
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

                      <td style={styles.td}>
                        {index + 1}
                      </td>

                      <td
                        style={{
                          ...styles.td,
                          fontWeight: "600",
                        }}
                      >
                        {student.register_number}
                      </td>

                      <td style={styles.td}>
                        {student.student_name}
                      </td>

                      <td style={styles.td}>
                        {student.section || "-"}
                      </td>

                      <td style={styles.td}>

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
                              ...(
                                currentStatus ===
                                "Present"
                                  ? styles.presentSelected
                                  : {}
                              ),
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
                              ...(
                                currentStatus ===
                                "Absent"
                                  ? styles.absentSelected
                                  : {}
                              ),
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
                              ...(
                                currentStatus === "OD"
                                  ? styles.odSelected
                                  : {}
                              ),
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

            <h3>
              No Students Loaded
            </h3>

            <p>
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
    padding: "30px",
    background: "#f5f7fb",
    boxSizing: "border-box",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
  },

  title: {
    margin: 0,
    fontSize: "30px",
    fontWeight: "700",
    color: "#1f2937",
  },

  subtitle: {
    marginTop: "7px",
    marginBottom: 0,
    color: "#6b7280",
    fontSize: "15px",
  },

  card: {
    background: "#ffffff",
    borderRadius: "14px",
    padding: "25px",
    marginBottom: "25px",
    boxShadow:
      "0 2px 10px rgba(0, 0, 0, 0.06)",
  },

  cardTitle: {
    margin: 0,
    color: "#1f2937",
    fontSize: "20px",
    fontWeight: "650",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginTop: "22px",
    marginBottom: "20px",
  },

  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
  },

  select: {
    width: "100%",
    padding: "12px 14px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    background: "#ffffff",
    color: "#111827",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },

  input: {
    width: "100%",
    padding: "11px 14px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    background: "#ffffff",
    color: "#111827",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },

  subjectInfo: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "15px",
    background: "#f8fafc",
    borderRadius: "10px",
    padding: "16px",
    marginBottom: "20px",
  },

  infoLabel: {
    display: "block",
    fontSize: "12px",
    color: "#6b7280",
    marginBottom: "4px",
  },

  primaryButton: {
    border: "none",
    borderRadius: "8px",
    padding: "12px 22px",
    background: "#2563eb",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },

  successMessage: {
    background: "#ecfdf5",
    color: "#047857",
    border: "1px solid #a7f3d0",
    borderRadius: "8px",
    padding: "13px 16px",
    marginBottom: "20px",
    fontSize: "14px",
    fontWeight: "500",
  },

  errorMessage: {
    background: "#fef2f2",
    color: "#b91c1c",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    padding: "13px 16px",
    marginBottom: "20px",
    fontSize: "14px",
    fontWeight: "500",
  },

  tableHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },

  studentCount: {
    margin: "5px 0 0",
    color: "#6b7280",
    fontSize: "13px",
  },

  quickActions: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },

  presentButton: {
    border: "1px solid #86efac",
    background: "#f0fdf4",
    color: "#15803d",
    padding: "9px 13px",
    borderRadius: "7px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
  },

  absentButton: {
    border: "1px solid #fca5a5",
    background: "#fef2f2",
    color: "#dc2626",
    padding: "9px 13px",
    borderRadius: "7px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
  },

  clearButton: {
    border: "1px solid #d1d5db",
    background: "#ffffff",
    color: "#4b5563",
    padding: "9px 13px",
    borderRadius: "7px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
  },

  summaryContainer: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(130px, 1fr))",
    gap: "12px",
    marginBottom: "22px",
  },

  summaryPresent: {
    padding: "14px",
    borderRadius: "9px",
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    color: "#15803d",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  summaryAbsent: {
    padding: "14px",
    borderRadius: "9px",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#dc2626",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  summaryOD: {
    padding: "14px",
    borderRadius: "9px",
    background: "#fff7ed",
    border: "1px solid #fed7aa",
    color: "#ea580c",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  summaryUnmarked: {
    padding: "14px",
    borderRadius: "9px",
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    color: "#6b7280",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
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
    minWidth: "800px",
  },

  th: {
    padding: "14px 12px",
    textAlign: "left",
    background: "#f8fafc",
    color: "#374151",
    fontSize: "13px",
    fontWeight: "700",
    borderBottom: "1px solid #e5e7eb",
  },

  td: {
    padding: "13px 12px",
    color: "#374151",
    fontSize: "14px",
    borderBottom: "1px solid #f1f5f9",
  },

  tr: {
    background: "#ffffff",
  },

  statusContainer: {
    display: "flex",
    gap: "7px",
    flexWrap: "wrap",
  },

  statusButton: {
    padding: "7px 11px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    background: "#ffffff",
    color: "#4b5563",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
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
    gap: "12px",
    marginTop: "22px",
    flexWrap: "wrap",
  },

  saveButton: {
    border: "none",
    borderRadius: "8px",
    padding: "12px 24px",
    background: "#2563eb",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
  },

  whatsappButton: {
    border: "none",
    borderRadius: "8px",
    padding: "12px 24px",
    background: "#25d366",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
  },

  emptyState: {
    background: "#ffffff",
    borderRadius: "14px",
    padding: "50px 25px",
    textAlign: "center",
    boxShadow:
      "0 2px 10px rgba(0, 0, 0, 0.05)",
    color: "#6b7280",
  },

  emptyIcon: {
    fontSize: "40px",
    marginBottom: "10px",
  },
};

export default SubjectAttendance;