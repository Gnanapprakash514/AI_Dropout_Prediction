import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Users, Brain, AlertTriangle,
  BarChart2, HeartHandshake, RefreshCw
} from "lucide-react";

const links = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/predict", icon: Brain, label: "Predict" },
  { to: "/bulk", icon: RefreshCw, label: "Bulk Predict" },
  { to: "/students", icon: Users, label: "Students" },
  { to: "/predictions", icon: BarChart2, label: "Predictions" },
  { to: "/high-risk", icon: AlertTriangle, label: "High Risk" },
  { to: "/counselling", icon: HeartHandshake, label: "Counselling" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>DropGuard AI</h2>
        <span>Dropout Prediction System</span>
      </div>
      <nav className="sidebar-nav">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
