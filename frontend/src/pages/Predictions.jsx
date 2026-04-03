import { useEffect, useState } from "react";
import { getPredictions } from "../api";

export default function Predictions() {
  const [predictions, setPredictions] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => { getPredictions().then((r) => setPredictions(r.data)); }, []);

  const filtered = filter === "All" ? predictions : predictions.filter((p) => p.risk_level === filter);

  return (
    <div>
      <div className="page-header">
        <h1>Predictions</h1>
        <p>All dropout risk predictions linked to students</p>
      </div>

      <div className="card">
        <div className="flex justify-between items-center" style={{ marginBottom: 16 }}>
          <p className="section-title" style={{ margin: 0 }}>{filtered.length} Records</p>
          <div className="flex gap-8">
            {["All", "High", "Medium", "Low"].map((f) => (
              <button
                key={f}
                className={`btn ${filter === f ? "btn-primary" : "btn-outline"}`}
                style={{ padding: "6px 14px", fontSize: 13 }}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>ID</th><th>Student</th><th>Risk Level</th><th>Probability</th><th>Date</th></tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.prediction_id}>
                  <td className="text-muted">#{p.prediction_id}</td>
                  <td>
                    <div>
                      <div style={{ fontWeight: 500 }}>{p.name}</div>
                      <div className="text-muted">ID #{p.student_id}</div>
                    </div>
                  </td>
                  <td><span className={`badge badge-${p.risk_level?.toLowerCase()}`}>{p.risk_level}</span></td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div className="progress-bar" style={{ width: 100 }}>
                        <div
                          className="progress-fill"
                          style={{
                            width: `${(p.probability * 100).toFixed(0)}%`,
                            background: p.risk_level === "High" ? "#ff4d6d" : p.risk_level === "Medium" ? "#ffb347" : "#00d4aa",
                          }}
                        />
                      </div>
                      <span>{(p.probability * 100).toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="text-muted">{new Date(p.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: "center", padding: 32, color: "#8b90b0" }}>No predictions found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
