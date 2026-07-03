import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Students from "./pages/Students";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import UploadResult from "./pages/UploadResult";
import StudentDetails from "./pages/StudentDetails";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/students" element={<Students />} />
      <Route path="/student/:id" element={<StudentDetails />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/upload-results" element={<UploadResult />} />
    </Routes>
  );
}

export default App;