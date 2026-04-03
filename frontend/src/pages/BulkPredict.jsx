import { useState, useRef } from "react";
import { predictBulk } from "../api";
import { Upload, FileText, RefreshCw } from "lucide-react";

export default function BulkPredict() {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef();

  const onDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer?.files[0] || e.target.files[0];
    if (f) setFile(f);
  };

  const submit = async () => {
    if (!file) return;
    setLoading(true); setError(""); setResults(null);
    try {
      const res = await predictBulk(file);
      setResults(res.data);
    } catch {
      setError("Bulk prediction failed. Check your CSV format and backend.");
    } finally {
      setLoading(false);
    }
  };

  const riskBadge = (risk) => (
    <span className={`badge badge-${risk?.toLowerCase()}`}>{risk}</span>
  );

  return (
    <div>
      <div className="page-header">
        <h1>Bulk Prediction</h1>
        <p>Upload a CSV file to predict dropout risk for multiple students</p>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <p className="section-title">Upload CSV File</p>
        <p className="text-muted" style={{ marginBottom: 16 }}>
          Required columns: <code style={{ background: "#22263a", padding: "2px 6px", borderRadius: 4 }}>name, attendance, marks, prev_marks, backlogs, mental_stress, study_hours, assignment</code>
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        <div
          className="upload-zone"
          onClick={() => inputRef.current.click()}
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <input ref={inputRef} type="file" accept=".csv" style={{ display: "none" }} onChange={onDrop} />
          {file ? (
            <>
              <FileText size={36} color="#6c63ff" style={{ margin: "0 auto" }} />
              <p style={{ color: "#e8eaf6", marginTop: 8, fontWeight: 600 }}>{file.name}</p>
              <p>{(file.size / 1024).toFixed(1)} KB</p>
            </>
          ) : (
            <>
              <Upload size={36} color="#8b90b0" style={{ margin: "0 auto" }} />
              <p>Drag & drop your CSV here or click to browse</p>
            </>
          )}
        </div>

        <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
          <button className="btn btn-primary" onClick={submit} disabled={!file || loading}>
            <RefreshCw size={16} />
            {loading ? "Processing..." : "Run Bulk Prediction"}
          </button>
          {file && (
            <button className="btn btn-outline" onClick={() => { setFile(null); setResults(null); }}>
              Clear
            </button>
          )}
        </div>
      </div>

      {results && (
        <div className="card">
          <div className="flex justify-between items-center" style={{ marginBottom: 16 }}>
            <p className="section-title" style={{ margin: 0 }}>Results — {results.total_students} Students</p>
            <div className="flex gap-8">
              {["High", "Medium", "Low"].map((r) => (
                <span key={r} className={`badge badge-${r.toLowerCase()}`}>
                  {results.results.filter((s) => s.risk === r).length} {r}
                </span>
              ))}
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>#</th><th>Name</th><th>Risk Level</th><th>Probability</th></tr>
              </thead>
              <tbody>
                {results.results.map((s, i) => (
                  <tr key={i}>
                    <td className="text-muted">{i + 1}</td>
                    <td>{s.name}</td>
                    <td>{riskBadge(s.risk)}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div className="progress-bar" style={{ width: 100 }}>
                          <div
                            className="progress-fill"
                            style={{
                              width: `${(s.probability * 100).toFixed(0)}%`,
                              background: s.risk === "High" ? "#ff4d6d" : s.risk === "Medium" ? "#ffb347" : "#00d4aa",
                            }}
                          />
                        </div>
                        <span>{(s.probability * 100).toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
