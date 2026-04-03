import { useState } from "react";
import { predictStudent } from "../api";
import { Brain } from "lucide-react";

const fields = [
  { key: "attendance", label: "Attendance (%)", min: 0, max: 100 },
  { key: "marks", label: "Current Marks", min: 0, max: 100 },
  { key: "prev_marks", label: "Previous Marks", min: 0, max: 100 },
  { key: "backlogs", label: "Backlogs", min: 0, max: 20 },
  { key: "mental_stress", label: "Mental Stress (1-10)", min: 1, max: 10 },
  { key: "study_hours", label: "Study Hours/Day", min: 0, max: 24 },
  { key: "assignment", label: "Assignments Submitted", min: 0, max: 100 },
];

const empty = { name: "", attendance: "", marks: "", prev_marks: "", backlogs: "", mental_stress: "", study_hours: "", assignment: "" };

export default function Predict() {
  const [form, setForm] = useState(empty);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(""); setResult(null);
    try {
      const payload = { ...form, ...Object.fromEntries(fields.map((f) => [f.key, Number(form[f.key])])) };
      const res = await predictStudent(payload);
      setResult(res.data);
    } catch {
      setError("Prediction failed. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const riskClass = result?.risk?.toLowerCase() ?? "";

  return (
    <div>
      <div className="page-header">
        <h1>Single Prediction</h1>
        <p>Enter student details to predict dropout risk</p>
      </div>

      <div className="grid-2" style={{ alignItems: "start" }}>
        <div className="card">
          <p className="section-title">Student Information</p>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={submit}>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label>Student Name</label>
              <input name="name" value={form.name} onChange={handle} placeholder="Enter name" required />
            </div>
            <div className="form-grid">
              {fields.map(({ key, label }) => (
                <div className="form-group" key={key}>
                  <label>{label}</label>
                  <input type="number" name={key} value={form[key]} onChange={handle} placeholder="0" required />
                </div>
              ))}
            </div>
            <div style={{ marginTop: 20 }}>
              <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: "100%", justifyContent: "center" }}>
                <Brain size={16} />
                {loading ? "Analyzing..." : "Predict Dropout Risk"}
              </button>
            </div>
          </form>
        </div>

        <div>
          {result ? (
            <div className={`result-box ${riskClass}`}>
              <p className="text-muted">Dropout Risk Level</p>
              <h2>{result.risk}</h2>
              <p style={{ fontSize: 15, marginBottom: 16 }}>
                Probability: <strong>{(result.probability * 100).toFixed(1)}%</strong>
              </p>
              <div className="progress-bar" style={{ marginBottom: 16 }}>
                <div
                  className="progress-fill"
                  style={{
                    width: `${(result.probability * 100).toFixed(0)}%`,
                    background: riskClass === "high" ? "#ff4d6d" : riskClass === "medium" ? "#ffb347" : "#00d4aa",
                  }}
                />
              </div>
              <p className="text-muted" style={{ fontSize: 12 }}>Student ID: #{result.student_id}</p>
              {riskClass === "high" && (
                <div className="alert alert-error mt-16">
                  ⚠️ Immediate counselling recommended for this student.
                </div>
              )}
              {riskClass === "medium" && (
                <div className="alert" style={{ background: "rgba(255,179,71,0.1)", border: "1px solid rgba(255,179,71,0.3)", color: "#ffb347", marginTop: 16 }}>
                  📋 Monitor this student closely and schedule a check-in.
                </div>
              )}
              {riskClass === "low" && (
                <div className="alert alert-success mt-16">
                  ✅ Student is on track. Keep up the good work!
                </div>
              )}
            </div>
          ) : (
            <div className="card" style={{ textAlign: "center", padding: 48 }}>
              <Brain size={48} color="#2e3250" style={{ margin: "0 auto 16px" }} />
              <p className="text-muted">Fill in the form and click predict to see the dropout risk analysis.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
