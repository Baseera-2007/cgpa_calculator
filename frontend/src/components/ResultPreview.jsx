function ResultPreview() {
  return (
    <div
      style={{
        marginTop: "30px",
        background: "#fff",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 3px 10px rgba(0,0,0,0.1)"
      }}
    >
      <h2>Extracted Student Result</h2>

      <table
        border="1"
        cellPadding="10"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px"
        }}
      >
        <thead>
          <tr>
            <th>Subject Code</th>
            <th>Subject Name</th>
            <th>Grade</th>
            <th>Credits</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>CS3501</td>
            <td>Machine Learning</td>
            <td>O</td>
            <td>3</td>
          </tr>

          <tr>
            <td>CS3591</td>
            <td>Computer Networks</td>
            <td>A+</td>
            <td>4</td>
          </tr>

          <tr>
            <td>CS3502</td>
            <td>Compiler Design</td>
            <td>A</td>
            <td>3</td>
          </tr>

          <tr>
            <td>MA3501</td>
            <td>Probability</td>
            <td>O</td>
            <td>4</td>
          </tr>
        </tbody>
      </table>

      <h3 style={{ marginTop: "25px" }}>
        Calculated SGPA : <span style={{ color: "#1e3a8a" }}>9.12</span>
      </h3>
    </div>
  );
}

export default ResultPreview;