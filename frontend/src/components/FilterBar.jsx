import { useState } from "react";
import "../styles/FilterBar.css";

function FilterBar() {

  const semesterData = {
    "2023-2027": [
      "Semester 1",
      "Semester 2",
      "Semester 3",
      "Semester 4",
      "Semester 5",
    ],

    "2024-2028": [
      "Semester 1",
      "Semester 2",
      "Semester 3",
    ],

    "2025-2029": [
      "Semester 1",
    ],
  };

  const [batch, setBatch] = useState("2023-2027");

  const [semester, setSemester] = useState("Semester 5");

  const semesters = semesterData[batch];

  return (
    <div className="filter-container">

      <h2>
        🎓 CSBS Academic Performance & Result Management System
      </h2>

      <div className="department">
        <strong>Department :</strong> CSBS
      </div>

      <div className="filters">

        <div className="filter">

          <label>Batch</label>

          <select
            value={batch}
            onChange={(e) => {

              const selectedBatch = e.target.value;

              setBatch(selectedBatch);

              setSemester(semesterData[selectedBatch][0]);

            }}
          >

            {Object.keys(semesterData).map((batch) => (

              <option
                key={batch}
                value={batch}
              >
                {batch}
              </option>

            ))}

          </select>

        </div>

        <div className="filter">

          <label>Semester</label>

          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
          >

            {semesters.map((sem) => (

              <option
                key={sem}
                value={sem}
              >
                {sem}
              </option>

            ))}

          </select>

        </div>

        <div className="filter">

          <label>Section</label>

          <select>

            <option>A</option>

            <option>B</option>

          </select>

        </div>

      </div>

    </div>
  );
}

export default FilterBar;