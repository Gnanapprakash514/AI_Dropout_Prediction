import { useEffect, useState } from "react";
import { getDashboard, getHighRisk } from "../api";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { AlertTriangle, TrendingUp, Users, CheckCircle } from "lucide-react";

const COLORS = ["#ff4d6d", "#ffb347", "#00d4aa"];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [highRisk, setHighRisk] = useState([]);

  useEffect(() => {
    getDashboard().then((r) => setStats(r.data));
    getHighRisk().then((r) => setHighRisk(r.data));
  }, []);

  const pieData = stats
    ? [
        { name: "High Risk", value: stats.high_risk },
        { name: "Medium Risk", value: stats.medium_risk },
        { name: "Low Risk", value: stats.low_risk },
      ]
    : [];

  const barData = stats
    ? [
        { name: "High", count: stats.high_risk, fill: "#ff4d6d" },
        { name: "Medium", count: stats.medium_risk, fill: "#ffb347" },
        { name: "Low", count: stats.low_risk, fill: "#00d4aa" },
      ]
    : [];

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Overview of student dropout predictions</p>
      </div>

      <div className="stat-grid">
        {[
          { label: "Total Predictions", value: stats?.total_predictions ?? "—", icon: TrendingUp, color: "#6c63ff", bg: "rgba(108,99,255,0.15)" },
          { label: "High Risk", value: stats?.high_risk ?? "—", icon: AlertTriangle, color: "#ff4d6d", bg: "rgba(255,77,109,0.15)" },
          { label: "Medium Risk", value: stats?.medium_risk ?? "—", icon: Users, color: "#ffb347", bg: "rgba(255,179,71,0.15)" },
          { label: "Low Risk", value: stats?.low_risk ?? "—", icon: CheckCircle, color: "#00d4aa", bg: "rgba(0,212,170,0.15)" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div className="stat-card" key={label}>
            <div className="stat-icon" style={{ background: bg }}>
              <Icon size={22} color={color} />
            </div>
            <div>
              <h3>{value}</h3>
              <p>{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="card">
          <p className="section-title">Risk Distribution</p>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#1a1d27", border: "1px solid #2e3250", borderRadius: 8, color: "#e8eaf6" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex gap-12" style={{ justifyContent: "center", marginTop: 8 }}>
            {["High Risk", "Medium Risk", "Low Risk"].map((l, i) => (
              <div key={l} className="flex items-center gap-8">
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: COLORS[i] }} />
                <span className="text-muted">{l}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <p className="section-title">Risk Breakdown</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={barData} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2e3250" />
              <XAxis dataKey="name" tick={{ fill: "#8b90b0", fontSize: 13 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#8b90b0", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#1a1d27", border: "1px solid #2e3250", borderRadius: 8, color: "#e8eaf6" }} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {barData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {highRisk.length > 0 && (
        <div className="card mt-24">
          <p className="section-title">⚠️ Recent High Risk Students</p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Student ID</th><th>Name</th><th>Probability</th><th>Detected At</th>
                </tr>
              </thead>
              <tbody>
                {highRisk.slice(0, 5).map((s) => (
                  <tr key={s.prediction_id}>
                    <td>#{s.student_id}</td>
                    <td>{s.name}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div className="progress-bar" style={{ width: 80 }}>
                          <div className="progress-fill" style={{ width: `${(s.probability * 100).toFixed(0)}%`, background: "#ff4d6d" }} />
                        </div>
                        <span>{(s.probability * 100).toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="text-muted">{new Date(s.created_at).toLocaleDateString()}</td>
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
