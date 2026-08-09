import { useState } from "react";
import "../styles/Attendance.css";

const API_BASE_URL = "http://127.0.0.1:8000";

function Attendance() {
  // ==========================================================
  // STATE
  // ==========================================================

  const [students, setStudents] = useState([]);

  const [batch, setBatch] = useState("");
  const [classBatch, setClassBatch] = useState("All");
  const [gender, setGender] = useState("All");

  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [attendance, setAttendance] = useState({});

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [saved, setSaved] = useState(false);
  const [attendanceMessage, setAttendanceMessage] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // ==========================================================
  // LOAD STUDENTS
  // ==========================================================

  const loadStudents = async () => {
    if (!batch) {
      setError("Please select a batch.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");
    setSaved(false);
    setAttendanceMessage("");
    setAttendance({});
    setStudents([]);

    try {
      const response = await fetch(
        `${API_BASE_URL}/students`
      );

      if (!response.ok) {
        throw new Error("Unable to load students.");
      }

      let data = await response.json();

      // Batch filter
      if (batch !== "") {
        data = data.filter(
          (student) => student.batch === batch
        );
      }

      // Class batch filter
      if (classBatch !== "All") {
        data = data.filter(
          (student) =>
            student.class_batch === classBatch
        );
      }

      // Gender filter
      if (gender !== "All") {
        data = data.filter(
          (student) =>
            student.gender === gender
        );
      }

      setStudents(data);

      if (data.length === 0) {
        setMessage(
          "No students found for the selected filters."
        );
      }
    } catch (error) {
      console.error("LOAD STUDENTS ERROR:", error);

      setStudents([]);
      setAttendance({});

      setError(
        error.message ||
          "Unable to load students."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // CHANGE ATTENDANCE
  // ==========================================================

  const markAttendance = (studentId, status) => {
    setAttendance((previous) => ({
      ...previous,
      [studentId]: status,
    }));

    setSaved(false);
    setAttendanceMessage("");
    setMessage("");
    setError("");
  };

  // ==========================================================
  // CLEAR ATTENDANCE
  // ==========================================================

  const clearAttendance = () => {
    setAttendance({});
    setSaved(false);
    setAttendanceMessage("");
    setMessage("");
    setError("");
  };

  // ==========================================================
  // SAVE ATTENDANCE
  // ==========================================================

  const saveAttendance = async () => {
    if (students.length === 0) {
      setError("Please load students first.");
      return;
    }

    // --------------------------------------------------------
    // Check unmarked students
    // --------------------------------------------------------

    const unmarkedStudents = students.filter(
      (student) =>
        !attendance[student.id]
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

    // --------------------------------------------------------
    // Attendance counts
    // --------------------------------------------------------

    const present = students.filter(
      (student) =>
        attendance[student.id] === "Present"
    );

    const absent = students.filter(
      (student) =>
        attendance[student.id] === "Absent"
    );

    const od = students.filter(
      (student) =>
        attendance[student.id] === "OD"
    );

    try {
      // ------------------------------------------------------
      // Save each student's attendance
      // ------------------------------------------------------

      for (const student of students) {
        const status =
          attendance[student.id];

        await fetch(
          `${API_BASE_URL}/attendance`,
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              student_id: student.id,
              attendance_date:
                attendanceDate,
              status: status,
              marked_by: "Staff",
            }),
          }
        );
      }

      // ------------------------------------------------------
      // Create WhatsApp message
      // ------------------------------------------------------

      const whatsappMessage = `📅 Attendance Report

Date: ${attendanceDate}
Batch: ${batch}
Class Batch: ${
        classBatch === "All"
          ? "All"
          : classBatch
      }
Gender: ${
        gender === "All"
          ? "All"
          : gender
      }

Total Students: ${students.length}

✅ Present (${present.length})
${present
  .map(
    (student) =>
      `${student.register_number} - ${student.student_name}`
  )
  .join("\n")}

❌ Absent (${absent.length})
${absent
  .map(
    (student) =>
      `${student.register_number} - ${student.student_name}`
  )
  .join("\n")}

🟠 OD (${od.length})
${od
  .map(
    (student) =>
      `${student.register_number} - ${student.student_name}`
  )
  .join("\n")}

Attendance has been recorded successfully.`;

      setAttendanceMessage(
        whatsappMessage
      );

      setSaved(true);

      setMessage(
        `Attendance saved successfully! ${students.length} record(s) processed.`
      );
    } catch (error) {
      console.error(
        "SAVE ATTENDANCE ERROR:",
        error
      );

      setError(
        error.message ||
          "Unable to save attendance."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================================
  // SHARE WHATSAPP
  // ==========================================================

  const shareWhatsApp = async () => {
    if (!attendanceMessage) {
      setError(
        "Please save attendance before sharing."
      );
      return;
    }

    try {
      await navigator.clipboard.writeText(
        attendanceMessage
      );
    } catch (error) {
      console.log(
        "Clipboard permission unavailable."
      );
    }

    const whatsappUrl =
      `https://web.whatsapp.com/send?text=${encodeURIComponent(
        attendanceMessage
      )}`;

    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // ==========================================================
  // COUNTS
  // ==========================================================

  const presentCount = students.filter(
    (student) =>
      attendance[student.id] === "Present"
  ).length;

  const absentCount = students.filter(
    (student) =>
      attendance[student.id] === "Absent"
  ).length;

  const odCount = students.filter(
    (student) =>
      attendance[student.id] === "OD"
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

      {/* ====================================================
          HEADER
      ==================================================== */}

      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            Attendance
          </h1>

          <p style={styles.subtitle}>
            Manage and record student attendance
          </p>
        </div>
      </div>


      {/* ====================================================
          FILTER CARD
      ==================================================== */}

      <div style={styles.card}>

        <h2 style={styles.cardTitle}>
          Attendance Details
        </h2>

        <div style={styles.formGrid}>

          {/* BATCH */}

          <div style={styles.formGroup}>
            <label style={styles.label}>
              Batch
            </label>

            <select
              value={batch}
              onChange={(e) => {
                setBatch(e.target.value);
                setStudents([]);
                setAttendance({});
                setSaved(false);
                setMessage("");
                setError("");
              }}
              style={styles.select}
            >
              <option value="">
                Select Batch
              </option>

              <option value="2023-2027">
                2023-2027
              </option>

              <option value="2024-2028">
                2024-2028
              </option>

              <option value="2025-2029">
                2025-2029
              </option>
            </select>
          </div>


          {/* CLASS BATCH */}

          <div style={styles.formGroup}>
            <label style={styles.label}>
              Class Batch
            </label>

            <select
              value={classBatch}
              onChange={(e) => {
                setClassBatch(
                  e.target.value
                );
                setStudents([]);
                setAttendance({});
                setSaved(false);
                setMessage("");
                setError("");
              }}
              style={styles.select}
            >
              <option value="All">
                All
              </option>

              <option value="Batch I">
                Batch I
              </option>

              <option value="Batch II">
                Batch II
              </option>
            </select>
          </div>


          {/* GENDER */}

          <div style={styles.formGroup}>
            <label style={styles.label}>
              Gender
            </label>

            <select
              value={gender}
              onChange={(e) => {
                setGender(e.target.value);
                setStudents([]);
                setAttendance({});
                setSaved(false);
                setMessage("");
                setError("");
              }}
              style={styles.select}
            >
              <option value="All">
                All
              </option>

              <option value="Female">
                Girls
              </option>

              <option value="Male">
                Boys
              </option>
            </select>
          </div>


          {/* DATE */}

          <div style={styles.formGroup}>
            <label style={styles.label}>
              Date
            </label>

            <input
              type="date"
              value={attendanceDate}
              onChange={(e) => {
                setAttendanceDate(
                  e.target.value
                );
                setStudents([]);
                setAttendance({});
                setSaved(false);
                setMessage("");
                setError("");
              }}
              style={styles.input}
            />
          </div>

        </div>


        {/* LOAD BUTTON */}

        <button
          onClick={loadStudents}
          disabled={loading}
          style={{
            ...styles.primaryButton,
            opacity: loading ? 0.65 : 1,
          }}
        >
          {loading
            ? "Loading Students..."
            : "Load Students"}
        </button>

      </div>


      {/* ====================================================
          MESSAGES
      ==================================================== */}

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


      {/* ====================================================
          STUDENT ATTENDANCE
      ==================================================== */}

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
                onClick={() => {
                  const updated = {};

                  students.forEach(
                    (student) => {
                      updated[
                        student.id
                      ] = "Present";
                    }
                  );

                  setAttendance(updated);
                  setSaved(false);
                  setMessage("");
                  setError("");
                }}
                style={styles.presentButton}
              >
                ✓ Mark All Present
              </button>


              <button
                onClick={() => {
                  const updated = {};

                  students.forEach(
                    (student) => {
                      updated[
                        student.id
                      ] = "Absent";
                    }
                  );

                  setAttendance(updated);
                  setSaved(false);
                  setMessage("");
                  setError("");
                }}
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
              <strong>
                {presentCount}
              </strong>
            </div>

            <div style={styles.summaryAbsent}>
              <span>Absent</span>
              <strong>
                {absentCount}
              </strong>
            </div>

            <div style={styles.summaryOD}>
              <span>OD</span>
              <strong>
                {odCount}
              </strong>
            </div>

            <div style={styles.summaryUnmarked}>
              <span>Unmarked</span>
              <strong>
                {unmarkedCount}
              </strong>
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

                  <th
                    style={{
                      ...styles.th,
                      textAlign: "center",
                    }}
                  >
                    Attendance
                  </th>

                </tr>
              </thead>


              <tbody>

                {students.map(
                  (student, index) => {

                    const currentStatus =
                      attendance[
                        student.id
                      ];

                    return (
                      <tr
                        key={student.id}
                        style={styles.tr}
                      >

                        <td style={styles.td}>
                          {index + 1}
                        </td>


                        <td
                          style={{
                            ...styles.td,
                            fontWeight: 600,
                          }}
                        >
                          {
                            student.register_number
                          }
                        </td>


                        <td style={styles.td}>
                          {
                            student.student_name
                          }
                        </td>


                        <td style={styles.td}>

                          <div
                            style={
                              styles.statusContainer
                            }
                          >

                            {/* PRESENT */}

                            <button
                              onClick={() =>
                                markAttendance(
                                  student.id,
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
                                markAttendance(
                                  student.id,
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
                                markAttendance(
                                  student.id,
                                  "OD"
                                )
                              }
                              style={{
                                ...styles.statusButton,
                                ...(currentStatus ===
                                "OD"
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
                  }
                )}

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
                opacity: saving
                  ? 0.65
                  : 1,
              }}
            >
              {saving
                ? "Saving..."
                : "Save Attendance"}
            </button>


            {/* WHATSAPP */}

            {saved && (
              <button
                onClick={shareWhatsApp}
                style={
                  styles.whatsappButton
                }
              >
                Share WhatsApp
              </button>
            )}

          </div>

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
    fontFamily:
      '"Segoe UI", "Inter", Arial, sans-serif',
  },

  header: {
    display: "flex",
    alignItems: "center",
    marginBottom: "25px",
  },

  title: {
    margin: 0,
    fontSize: "30px",
    fontWeight: 700,
    color: "#1e3a8a",
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
    padding: "25px",
    marginBottom: "24px",
    boxShadow:
      "0 2px 10px rgba(0, 0, 0, 0.06)",
  },

  cardTitle: {
    margin: 0,
    color: "#1f2937",
    fontSize: "20px",
    fontWeight: 650,
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(210px, 1fr))",
    gap: "18px",
    marginTop: "22px",
    marginBottom: "20px",
  },

  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },

  label: {
    fontSize: "13px",
    fontWeight: 600,
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
    fontFamily:
      '"Segoe UI", "Inter", Arial, sans-serif',
    outline: "none",
    boxSizing: "border-box",
  },

  primaryButton: {
    border: "none",
    borderRadius: "8px",
    padding: "11px 22px",
    background: "#1e3a8a",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: 600,
    fontFamily:
      '"Segoe UI", "Inter", Arial, sans-serif',
    cursor: "pointer",
  },

  successMessage: {
    background: "#ecfdf5",
    color: "#047857",
    border: "1px solid #a7f3d0",
    borderRadius: "8px",
    padding: "12px 15px",
    marginBottom: "20px",
    fontSize: "14px",
    fontWeight: 500,
  },

  errorMessage: {
    background: "#fef2f2",
    color: "#b91c1c",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    padding: "12px 15px",
    marginBottom: "20px",
    fontSize: "14px",
    fontWeight: 500,
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
    fontWeight: 600,
    fontFamily:
      '"Segoe UI", "Inter", Arial, sans-serif',
  },

  absentButton: {
    border: "1px solid #fca5a5",
    background: "#fef2f2",
    color: "#dc2626",
    padding: "9px 13px",
    borderRadius: "7px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 600,
    fontFamily:
      '"Segoe UI", "Inter", Arial, sans-serif',
  },

  clearButton: {
    border: "1px solid #d1d5db",
    background: "#ffffff",
    color: "#4b5563",
    padding: "9px 13px",
    borderRadius: "7px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 600,
    fontFamily:
      '"Segoe UI", "Inter", Arial, sans-serif',
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
    fontSize: "14px",
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
    fontSize: "14px",
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
    fontSize: "14px",
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
    fontSize: "14px",
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
    minWidth: "780px",
  },

  th: {
    padding: "14px 14px",
    textAlign: "left",
    background: "#f8fafc",
    color: "#374151",
    fontSize: "13px",
    fontWeight: 700,
    borderBottom: "1px solid #e5e7eb",
  },

  td: {
    padding: "14px 14px",
    textAlign: "left",
    color: "#374151",
    fontSize: "14px",
    borderBottom:
      "1px solid #f1f5f9",
    verticalAlign: "middle",
  },

  tr: {
    background: "#ffffff",
  },

  statusContainer: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
    paddingLeft: "8px",
  },

  statusButton: {
    minWidth: "92px",
    padding: "7px 11px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    background: "#ffffff",
    color: "#4b5563",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 600,
    fontFamily:
      '"Segoe UI", "Inter", Arial, sans-serif',
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
    alignItems: "center",
    gap: "12px",
    marginTop: "22px",
    flexWrap: "wrap",
  },

  saveButton: {
    border: "none",
    borderRadius: "8px",
    padding: "11px 24px",
    background: "#1e3a8a",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: 600,
    fontFamily:
      '"Segoe UI", "Inter", Arial, sans-serif',
    cursor: "pointer",
  },

  whatsappButton: {
    border: "none",
    borderRadius: "8px",
    padding: "11px 24px",
    background: "#25d366",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: 600,
    fontFamily:
      '"Segoe UI", "Inter", Arial, sans-serif',
    cursor: "pointer",
  },
};

export default Attendance;