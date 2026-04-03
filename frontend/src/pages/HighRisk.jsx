import { useEffect, useState } from "react";
import { getHighRisk } from "../api";
import { AlertTriangle } from "lucide-react";

export default function HighRisk() {
  const [students, setStudents] = useState([]);

  useEffect(() => { getHighRisk().then((r) => setStudents(r.data)); }, []);

  return (
    <div>
      <div className="page-header">
        <h1>High Risk Students</h1>
        <p>Students with high dropout probability requiring immediate attention</p>
      </div>

      {students.length > 0 && (
        <div className="alert alert-error" style={{ marginBottom: 20 }}>
          <AlertTriangle size={16} style={{ display: "inline", marginRight: 8 }} />
          {students.length} student{students.length > 1 ? "s" : ""} flagged as high risk. Immediate counselling recommended.
        </div>
      )}

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Student ID</th><th>Name</th><th>Probability</th><th>Detected At</th><th>Action</th></tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.prediction_id}>
                  <td className="text-muted">#{s.student_id}</td>
                  <td style={{ fontWeight: 500 }}>{s.name}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div className="progress-bar" style={{ width: 120 }}>
                        <div className="progress-fill" style={{ width: `${(s.probability * 100).toFixed(0)}%`, background: "#ff4d6d" }} />
                      </div>
                      <span style={{ color: "#ff4d6d", fontWeight: 600 }}>{(s.probability * 100).toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="text-muted">{new Date(s.created_at).toLocaleDateString()}</td>
                  <td>
                    <span className="badge badge-high">Needs Counselling</span>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: "center", padding: 32, color: "#8b90b0" }}>No high risk students found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
