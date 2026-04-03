import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStudents } from "../api";
import { Users } from "lucide-react";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => { getStudents().then((r) => setStudents(r.data)); }, []);

  const navigate = useNavigate();

  const filtered = students.filter((s) =>
    s.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <h1>Students</h1>
        <p>All registered students in the system</p>
      </div>

      <div className="card">
        <div className="flex justify-between items-center" style={{ marginBottom: 16 }}>
          <p className="section-title" style={{ margin: 0 }}>
            <Users size={16} style={{ display: "inline", marginRight: 8 }} />
            {students.length} Students
          </p>
          <input
            style={{ background: "#22263a", border: "1px solid #2e3250", borderRadius: 8, padding: "8px 14px", color: "#e8eaf6", fontSize: 14, outline: "none", width: 220 }}
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Name</th><th>Attendance</th><th>Marks</th>
                <th>Prev Marks</th><th>Backlogs</th><th>Stress</th><th>Study Hrs</th><th>Dropout</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} onClick={() => navigate(`/students/${s.id}`)} style={{ cursor: "pointer" }}>
                  <td className="text-muted">#{s.id}</td>
                  <td style={{ fontWeight: 500 }}>{s.name}</td>
                  <td>{s.attendance}%</td>
                  <td>{s.marks}</td>
                  <td>{s.prev_marks}</td>
                  <td>{s.backlogs}</td>
                  <td>{s.mental_stress}/10</td>
                  <td>{s.study_hours}h</td>
                  <td>
                    <span className={`badge ${s.dropout ? "badge-high" : "badge-low"}`}>
                      {s.dropout ? "Yes" : "No"}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} style={{ textAlign: "center", padding: 32, color: "#8b90b0" }}>No students found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
