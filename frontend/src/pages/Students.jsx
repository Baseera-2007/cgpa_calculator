import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

function Students() {
  return (
    <MainLayout>
      <div style={{ padding: "30px" }}>
        <h1>Students</h1>

        <table
          border="1"
          cellPadding="10"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr>
              <th>Register No</th>
              <th>Name</th>
              <th>Section</th>
              <th>CGPA</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>921724113001</td>
              <td>Aisha</td>
              <td>A</td>
              <td>9.15</td>
              <td>
                <Link to="/student/101">
                  <button>View</button>
                </Link>
              </td>
            </tr>

            <tr>
              <td>921724113002</td>
              <td>Rahul</td>
              <td>A</td>
              <td>8.92</td>
              <td>
                <Link to="/student/102">
                  <button>View</button>
                </Link>
              </td>
            </tr>

            <tr>
              <td>921724113003</td>
              <td>Priya</td>
              <td>A</td>
              <td>9.41</td>
              <td>
                <Link to="/student/103">
                  <button>View</button>
                </Link>
              </td>
            </tr>

            <tr>
              <td>921724113004</td>
              <td>Arun</td>
              <td>A</td>
              <td>8.80</td>
              <td>
                <Link to="/student/104">
                  <button>View</button>
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
}

export default Students;