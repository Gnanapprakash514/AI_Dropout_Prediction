import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStudentPrediction, postCounselling, postFollowup } from "../api";
import { ArrowLeft, HeartHandshake, RefreshCw, User } from "lucide-react";

const statItems = [
  { key: "attendance", label: "Attendance", suffix: "%" },
  { key: "marks", label: "Current Marks", suffix: "" },
  { key: "prev_marks", label: "Prev Marks", suffix: "" },
  { key: "backlogs", label: "Backlogs", suffix: "" },
  { key: "mental_stress", label: "Mental Stress", suffix: "/10" },
  { key: "study_hours", label: "Study Hours", suffix: "h/day" },
  { key: "assignment", label: "Assignments", suffix: "" },
];

export default function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("counselling");

  // counselling form
  const [cForm, setCForm] = useState({ counsellor: "", notes: "" });
  const [cResult, setCResult] = useState(null);
  const [cError, setCError] = useState("");
  const [cLoading, setCLoading] = useState(false);

  // followup form
  const [fForm, setFForm] = useState({ counselling_id: "", status: "Pending", remarks: "" });
  const [fResult, setFResult] = useState(null);
  const [fError, setFError] = useState("");
  const [fLoading, setFLoading] = useState(false);

  useEffect(() => {
    getStudentPrediction(id)
      .then((r) => setData(r.data))
      .catch(() => setError("No prediction found for this student."));
  }, [id]);

  const submitCounselling = async (e) => {
    e.preventDefault();
    setCLoading(true); setCError(""); setCResult(null);
    try {
      const res = await postCounselling({ student_id: Number(id), ...cForm });
      setCResult(res.data);
      setCForm({ counsellor: "", notes: "" });
    } catch {
      setCError("Failed to create counselling record.");
    } finally {
      setCLoading(false);
    }
  };

  const submitFollowup = async (e) => {
    e.preventDefault();
    setFLoading(true); setFError(""); setFResult(null);
    try {
      const res = await postFollowup({
        counselling_id: Number(fForm.counselling_id),
        student_id: Number(id),
        status: fForm.status,
        remarks: fForm.remarks,
      });
      setFResult(res.data);
      setFForm({ counselling_id: "", status: "Pending", remarks: "" });
    } catch {
      setFError("Failed to create followup. Check counselling ID.");
    } finally {
      setFLoading(false);
    }
  };

  const riskColor = { High: "#ff4d6d", Medium: "#ffb347", Low: "#00d4aa" };
  const riskBg = { High: "rgba(255,77,109,0.08)", Medium: "rgba(255,179,71,0.08)", Low: "rgba(0,212,170,0.08)" };
  const riskBorder = { High: "rgba(255,77,109,0.3)", Medium: "rgba(255,179,71,0.3)", Low: "rgba(0,212,170,0.3)" };

  return (
    <div>
      <div className="page-header">
        <button className="btn btn-outline" style={{ marginBottom: 16 }} onClick={() => navigate("/students")}>
          <ArrowLeft size={15} /> Back to Students
        </button>
        <h1>Student Profile</h1>
        <p>Prediction details and counselling assignment</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {data && (
        <>
          {/* Top: student info + risk result */}
          <div className="grid-2" style={{ marginBottom: 24, alignItems: "start" }}>
            {/* Student info card */}
            <div className="card">
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg,#6c63ff,#00d4aa)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <User size={26} color="#fff" />
                </div>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 700 }}>{data.name}</h2>
                  <span className="text-muted">Student ID #{data.student_id}</span>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {statItems.map(({ key, label, suffix }) => (
                  <div key={key} style={{ background: "#22263a", borderRadius: 10, padding: "12px 14px" }}>
                    <div className="text-muted" style={{ fontSize: 11, marginBottom: 4 }}>{label}</div>
                    <div style={{ fontWeight: 600, fontSize: 16 }}>{data[key]}{suffix}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk result card */}
            <div
              style={{
                background: riskBg[data.risk_level],
                border: `1px solid ${riskBorder[data.risk_level]}`,
                borderRadius: 14,
                padding: 28,
                textAlign: "center",
              }}
            >
              <p className="text-muted" style={{ marginBottom: 8 }}>Dropout Risk Level</p>
              <div style={{ fontSize: 52, fontWeight: 800, color: riskColor[data.risk_level], marginBottom: 8 }}>
                {data.risk_level}
              </div>
              <p style={{ fontSize: 15, marginBottom: 20 }}>
                Probability:{" "}
                <strong style={{ color: riskColor[data.risk_level] }}>
                  {(data.probability * 100).toFixed(1)}%
                </strong>
              </p>
              <div className="progress-bar" style={{ marginBottom: 20 }}>
                <div
                  className="progress-fill"
                  style={{
                    width: `${(data.probability * 100).toFixed(0)}%`,
                    background: riskColor[data.risk_level],
                  }}
                />
              </div>
              {data.risk_level === "High" && (
                <div className="alert alert-error">⚠️ Immediate counselling recommended.</div>
              )}
              {data.risk_level === "Medium" && (
                <div className="alert" style={{ background: "rgba(255,179,71,0.1)", border: "1px solid rgba(255,179,71,0.3)", color: "#ffb347" }}>
                  📋 Schedule a check-in session.
                </div>
              )}
              {data.risk_level === "Low" && (
                <div className="alert alert-success">✅ Student is on track.</div>
              )}
            </div>
          </div>

          {/* Counselling section */}
          <div className="card">
            <div className="flex gap-8" style={{ marginBottom: 20 }}>
              <button className={`btn ${tab === "counselling" ? "btn-primary" : "btn-outline"}`} onClick={() => setTab("counselling")}>
                <HeartHandshake size={15} /> Assign Counselling
              </button>
              <button className={`btn ${tab === "followup" ? "btn-primary" : "btn-outline"}`} onClick={() => setTab("followup")}>
                <RefreshCw size={15} /> Add Followup
              </button>
            </div>

            {tab === "counselling" && (
              <div className="grid-2" style={{ alignItems: "start" }}>
                <form onSubmit={submitCounselling}>
                  <p className="section-title">Schedule Counselling for {data.name}</p>
                  {cError && <div className="alert alert-error">{cError}</div>}
                  <div className="form-group" style={{ marginBottom: 14 }}>
                    <label>Counsellor Name</label>
                    <input
                      value={cForm.counsellor}
                      onChange={(e) => setCForm({ ...cForm, counsellor: e.target.value })}
                      placeholder="e.g. Dr. Smith"
                      required
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 20 }}>
                    <label>Session Notes</label>
                    <textarea
                      value={cForm.notes}
                      onChange={(e) => setCForm({ ...cForm, notes: e.target.value })}
                      placeholder="Enter session notes..."
                      required
                    />
                  </div>
                  <button className="btn btn-primary" type="submit" disabled={cLoading} style={{ width: "100%", justifyContent: "center" }}>
                    <HeartHandshake size={15} />
                    {cLoading ? "Saving..." : "Assign Counselling"}
                  </button>
                </form>

                <div>
                  {cResult ? (
                    <div>
                      <div className="alert alert-success">✅ Counselling assigned successfully!</div>
                      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
                        {[["Counselling ID", `#${cResult.counselling_id}`], ["Student", data.name], ["Counsellor", cResult.counsellor]].map(([k, v]) => (
                          <div key={k} className="flex justify-between" style={{ padding: "10px 0", borderBottom: "1px solid #2e3250" }}>
                            <span className="text-muted">{k}</span>
                            <span style={{ fontWeight: 600 }}>{v}</span>
                          </div>
                        ))}
                        <div className="alert" style={{ background: "rgba(108,99,255,0.1)", border: "1px solid rgba(108,99,255,0.3)", color: "#6c63ff", marginTop: 8 }}>
                          💡 Use Counselling ID <strong>#{cResult.counselling_id}</strong> to add a followup.
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ textAlign: "center", padding: 40 }}>
                      <HeartHandshake size={44} color="#2e3250" style={{ margin: "0 auto 12px" }} />
                      <p className="text-muted">Assign a counsellor to this student.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {tab === "followup" && (
              <div className="grid-2" style={{ alignItems: "start" }}>
                <form onSubmit={submitFollowup}>
                  <p className="section-title">Add Followup for {data.name}</p>
                  {fError && <div className="alert alert-error">{fError}</div>}
                  <div className="form-group" style={{ marginBottom: 14 }}>
                    <label>Counselling ID</label>
                    <input
                      type="number"
                      value={fForm.counselling_id}
                      onChange={(e) => setFForm({ ...fForm, counselling_id: e.target.value })}
                      placeholder="e.g. 1"
                      required
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 14 }}>
                    <label>Status</label>
                    <select value={fForm.status} onChange={(e) => setFForm({ ...fForm, status: e.target.value })}>
                      <option>Pending</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                      <option>Escalated</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 20 }}>
                    <label>Remarks</label>
                    <textarea
                      value={fForm.remarks}
                      onChange={(e) => setFForm({ ...fForm, remarks: e.target.value })}
                      placeholder="Enter followup remarks..."
                      required
                    />
                  </div>
                  <button className="btn btn-success" type="submit" disabled={fLoading} style={{ width: "100%", justifyContent: "center" }}>
                    <RefreshCw size={15} />
                    {fLoading ? "Saving..." : "Submit Followup"}
                  </button>
                </form>

                <div>
                  {fResult ? (
                    <div>
                      <div className="alert alert-success">✅ Followup recorded successfully!</div>
                      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
                        {[["Followup ID", `#${fResult.followup_id}`], ["Counselling ID", `#${fResult.counselling_id}`], ["Status", fResult.status]].map(([k, v]) => (
                          <div key={k} className="flex justify-between" style={{ padding: "10px 0", borderBottom: "1px solid #2e3250" }}>
                            <span className="text-muted">{k}</span>
                            <span style={{ fontWeight: 600 }}>{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div style={{ textAlign: "center", padding: 40 }}>
                      <RefreshCw size={44} color="#2e3250" style={{ margin: "0 auto 12px" }} />
                      <p className="text-muted">Log a followup for an existing counselling session.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
