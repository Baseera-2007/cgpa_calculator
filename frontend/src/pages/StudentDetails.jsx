import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function StudentDetails() {
  return (
    <>
      <Navbar />

      <div style={{ display: "flex" }}>
        <Sidebar />

        <div
          style={{
            flex: 1,
            padding: "30px",
            background: "#f5f7fb",
            minHeight: "100vh",
          }}
        >
          <h1 style={{ color: "#1e3a8a" }}>
            👨‍🎓 Student Academic Profile
          </h1>

          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "12px",
              marginTop: "20px",
              boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
            }}
          >
            <h2>Personal Information</h2>

            <hr />

            <p><b>Name:</b> Baseera Banu S</p>

            <p><b>Register Number:</b> 921724113006</p>

            <p><b>Department:</b> CSBS</p>

            <p><b>Batch:</b> 2024-2028</p>

            <p><b>Section:</b> A</p>

            <p><b>Current Semester:</b> Semester 4</p>

            <p><b>Current CGPA:</b> 8.95</p>
          </div>

          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "12px",
              marginTop: "25px",
              boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
            }}
          >
            <h2>Semester Results</h2>

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "20px",
              }}
            >
              <thead
                style={{
                  background: "#1e3a8a",
                  color: "white",
                }}
              >
                <tr>
                  <th style={{ padding: "12px" }}>Semester</th>
                  <th>SGPA</th>
                  <th>Result PDF</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td style={{ padding: "12px" }}>Semester 1</td>
                  <td>9.12</td>
                  <td>
                    <button>View PDF</button>
                  </td>
                </tr>

                <tr>
                  <td style={{ padding: "12px" }}>Semester 2</td>
                  <td>8.94</td>
                  <td>
                    <button>View PDF</button>
                  </td>
                </tr>

                <tr>
                  <td style={{ padding: "12px" }}>Semester 3</td>
                  <td>8.80</td>
                  <td>
                    <button>View PDF</button>
                  </td>
                </tr>

                <tr>
                  <td style={{ padding: "12px" }}>Semester 4</td>
                  <td>8.95</td>
                  <td>
                    <button>View PDF</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default StudentDetails;