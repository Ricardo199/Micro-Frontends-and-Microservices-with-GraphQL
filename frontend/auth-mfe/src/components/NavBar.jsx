import { useNavigate } from "react-router-dom";
import "../styles/navBar.css"; 

export default function UserNavBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userInfo");
    navigate("/login", { replace: true });
  };

  return (
    <nav className="admin-navbar">
      {/* LOGO */}
      <div className="admin-logo" onClick={() => navigate("/home")}>
        Pet Tracker System
      </div>

      {/* LINKS */}
      <div className="admin-nav-links">
        <button onClick={() => navigate("/home")}>Home</button>
        <button onClick={() => navigate("/news")}>Pets</button>
        <button onClick={() => navigate("/discussion")}>Adoption</button>
        <button onClick={() => navigate("/help")}>Campaigns</button>

        {/* LOGOUT */}
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}