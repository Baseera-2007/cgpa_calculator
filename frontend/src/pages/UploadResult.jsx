import { parseResultPDF } from "../utils/pdfParser";

function UploadResult() {
  const handleUpload = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const result = parseResultPDF(file);

    console.log(result);

    alert(`Selected File: ${result.fileName}`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ color: "#1e3a8a" }}>Upload Semester Results</h1>

      <p>
        Upload the university result PDF to automatically generate student
        grades, SGPA and CGPA.
      </p>

      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "15px",
          marginTop: "25px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
        }}
      >
        <h2>Upload PDF</h2>

        <br />

        <label>
          <b>Batch</b>
        </label>

        <br />

        <select
          style={{
            width: "250px",
            height: "40px",
            marginTop: "8px",
          }}
        >
          <option>2023-2027</option>
          <option>2024-2028</option>
          <option>2025-2029</option>
        </select>

        <br />
        <br />

        <label>
          <b>Semester</b>
        </label>

        <br />

        <select
          style={{
            width: "250px",
            height: "40px",
            marginTop: "8px",
          }}
        >
          <option>Semester 1</option>
          <option>Semester 2</option>
          <option>Semester 3</option>
          <option>Semester 4</option>
          <option>Semester 5</option>
          <option>Semester 6</option>
          <option>Semester 7</option>
          <option>Semester 8</option>
        </select>

        <br />
        <br />

        <label>
          <b>Select Result PDF</b>
        </label>

        <br />

        <input
          type="file"
          accept=".pdf"
          onChange={handleUpload}
          style={{ marginTop: "10px" }}
        />

        <br />
        <br />

        <button
          style={{
            background: "#1e3a8a",
            color: "white",
            border: "none",
            padding: "12px 30px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Upload PDF
        </button>
      </div>
    </div>
  );
}

export default UploadResult;