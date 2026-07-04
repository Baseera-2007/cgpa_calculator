import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Students from "./pages/Students";
import StudentDetails from "./pages/StudentDetails"; // <-- ADD THIS
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import UploadResult from "./pages/UploadResult";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="students" element={<Students />} />
        <Route path="student-details" element={<StudentDetails />} /> {/* <-- ADD THIS */}
        <Route path="reports" element={<Reports />} />
        <Route path="upload-results" element={<UploadResult />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;