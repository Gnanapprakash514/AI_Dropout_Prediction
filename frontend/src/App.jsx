import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Predict from "./pages/Predict";
import BulkPredict from "./pages/BulkPredict";
import Students from "./pages/Students";
import StudentDetail from "./pages/StudentDetail";
import Predictions from "./pages/Predictions";
import HighRisk from "./pages/HighRisk";
import Counselling from "./pages/Counselling";

export default function App() {
  return (
    <BrowserRouter>
      <div className="layout">
        <Sidebar />
        <main className="main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/predict" element={<Predict />} />
            <Route path="/bulk" element={<BulkPredict />} />
            <Route path="/students" element={<Students />} />
            <Route path="/students/:id" element={<StudentDetail />} />
            <Route path="/predictions" element={<Predictions />} />
            <Route path="/high-risk" element={<HighRisk />} />
            <Route path="/counselling" element={<Counselling />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
