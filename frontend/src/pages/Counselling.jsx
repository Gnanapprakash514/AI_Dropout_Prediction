import { useState } from "react";
import { postCounselling, postFollowup } from "../api";
import { HeartHandshake, RefreshCw } from "lucide-react";

export default function Counselling() {
  const [tab, setTab] = useState("counselling");

  const [cForm, setCForm] = useState({ student_id: "", counsellor: "", notes: "" });
  const [fForm, setFForm] = useState({ counselling_id: "", student_id: "", status: "Pending", remarks: "" });

  const [cResult, setCResult] = useState(null);
  const [fResult, setFResult] = useState(null);
  const [cError, setCError] = useState("");
  const [fError, setFError] = useState("");
  const [cLoading, setCLoading] = useState(false);
  const [fLoading, setFLoading] = useState(false);

  const submitCounselling = async (e) => {
    e.preventDefault();
    setCLoading(true); setCError(""); setCResult(null);
    try {
      const res = await postCounselling({ ...cForm, student_id: Number(cForm.student_id) });
      setCResult(res.data);
      setCForm({ student_id: "", counsellor: "", notes: "" });
    } catch {
      setCError("Failed to create counselling record. Check student ID.");
    } finally {
      setCLoading(false);
    }
  };

  const submitFollowup = async (e) => {
    e.preventDefault();
    setFLoading(true); setFError(""); setFResult(null);
    try {
      const res = await postFollowup({
        ...fForm,
        counselling_id: Number(fForm.counselling_id),
        student_id: Number(fForm.student_id),
      });
      setFResult(res.data);
      setFForm({ counselling_id: "", student_id: "", status: "Pending", remarks: "" });
    } catch {
      setFError("Failed to create followup. Check counselling ID.");
    } finally {
      setFLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Counselling</h1>
        <p>Schedule counselling sessions and track followups</p>
      </div>

      <div className="flex gap-8" style={{ marginBottom: 20 }}>
        <button className={`btn ${tab === "counselling" ? "btn-primary" : "btn-outline"}`} onClick={() => setTab("counselling")}>
          <HeartHandshake size={15} /> New Counselling
        </button>
        <button className={`btn ${tab === "followup" ? "btn-primary" : "btn-outline"}`} onClick={() => setTab("followup")}>
          <RefreshCw size={15} /> Add Followup
        </button>
      </div>

      {tab === "counselling" && (
        <div className="grid-2" style={{ alignItems: "start" }}>
          <div className="card">
            <p className="section-title">Schedule Counselling Session</p>
            {cError && <div className="alert alert-error">{cError}</div>}
            <form onSubmit={submitCounselling}>
              <div className="form-group" style={{ marginBottom: 14 }}>
                <label>Student ID</label>
                <input type="number" value={cForm.student_id} onChange={(e) => setCForm({ ...cForm, student_id: e.target.value })} placeholder="e.g. 1" required />
              </div>
              <div className="form-group" style={{ marginBottom: 14 }}>
                <label>Counsellor Name</label>
                <input value={cForm.counsellor} onChange={(e) => setCForm({ ...cForm, counsellor: e.target.value })} placeholder="e.g. Dr. Smith" required />
              </div>
              <div className="form-group" style={{ marginBottom: 20 }}>
                <label>Session Notes</label>
                <textarea value={cForm.notes} onChange={(e) => setCForm({ ...cForm, notes: e.target.value })} placeholder="Enter session notes..." required />
              </div>
              <button className="btn btn-primary" type="submit" disabled={cLoading} style={{ width: "100%", justifyContent: "center" }}>
                <HeartHandshake size={15} />
                {cLoading ? "Saving..." : "Create Counselling Record"}
              </button>
            </form>
          </div>

          <div>
            {cResult ? (
              <div className="card">
                <div className="alert alert-success">✅ Counselling session created successfully!</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
                  {[["Counselling ID", `#${cResult.counselling_id}`], ["Student ID", `#${cResult.student_id}`], ["Counsellor", cResult.counsellor]].map(([k, v]) => (
                    <div key={k} className="flex justify-between" style={{ padding: "10px 0", borderBottom: "1px solid #2e3250" }}>
                      <span className="text-muted">{k}</span>
                      <span style={{ fontWeight: 600 }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="card" style={{ textAlign: "center", padding: 48 }}>
                <HeartHandshake size={48} color="#2e3250" style={{ margin: "0 auto 16px" }} />
                <p className="text-muted">Fill the form to schedule a counselling session.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "followup" && (
        <div className="grid-2" style={{ alignItems: "start" }}>
          <div className="card">
            <p className="section-title">Add Followup</p>
            {fError && <div className="alert alert-error">{fError}</div>}
            <form onSubmit={submitFollowup}>
              <div className="form-grid" style={{ marginBottom: 14 }}>
                <div className="form-group">
                  <label>Counselling ID</label>
                  <input type="number" value={fForm.counselling_id} onChange={(e) => setFForm({ ...fForm, counselling_id: e.target.value })} placeholder="e.g. 1" required />
                </div>
                <div className="form-group">
                  <label>Student ID</label>
                  <input type="number" value={fForm.student_id} onChange={(e) => setFForm({ ...fForm, student_id: e.target.value })} placeholder="e.g. 1" required />
                </div>
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
                <textarea value={fForm.remarks} onChange={(e) => setFForm({ ...fForm, remarks: e.target.value })} placeholder="Enter followup remarks..." required />
              </div>
              <button className="btn btn-success" type="submit" disabled={fLoading} style={{ width: "100%", justifyContent: "center" }}>
                <RefreshCw size={15} />
                {fLoading ? "Saving..." : "Submit Followup"}
              </button>
            </form>
          </div>

          <div>
            {fResult ? (
              <div className="card">
                <div className="alert alert-success">✅ Followup recorded successfully!</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
                  {[["Followup ID", `#${fResult.followup_id}`], ["Counselling ID", `#${fResult.counselling_id}`], ["Status", fResult.status]].map(([k, v]) => (
                    <div key={k} className="flex justify-between" style={{ padding: "10px 0", borderBottom: "1px solid #2e3250" }}>
                      <span className="text-muted">{k}</span>
                      <span style={{ fontWeight: 600 }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="card" style={{ textAlign: "center", padding: 48 }}>
                <RefreshCw size={48} color="#2e3250" style={{ margin: "0 auto 16px" }} />
                <p className="text-muted">Fill the form to log a followup session.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
