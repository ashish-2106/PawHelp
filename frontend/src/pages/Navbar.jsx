import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [role, setRole] = useState(null);
  const [ngoStatus, setNgoStatus] = useState(null);
  const [email, setEmail] = useState(null);

  const navigate = useNavigate();

  // 🔄 Sync Auth
  useEffect(() => {
    const syncAuth = (user) => {
      setRole(localStorage.getItem("role"));
      setNgoStatus(localStorage.getItem("ngo_status"));
      setEmail(user?.email || null);
    };

    syncAuth(auth.currentUser);

    const unsub = onAuthStateChanged(auth, (user) => {
      syncAuth(user);
    });

    const storageHandler = () => syncAuth(auth.currentUser);
    window.addEventListener("storage", storageHandler);

    return () => {
      unsub();
      window.removeEventListener("storage", storageHandler);
    };
  }, []);

  // 🚪 Logout
  const logoutUser = async () => {
    await signOut(auth);
    localStorage.clear();
    window.dispatchEvent(new Event("storage"));
    setProfileOpen(false);
    setOpen(false);
    navigate("/login");
  };

  const getInitial = () =>
    email ? email.charAt(0).toUpperCase() : "?";

  return (
    <>
      {/* ---------- STYLES ---------- */}
      <style>{`
        .nav-wrapper {
          position: sticky;
          top: 0;
          z-index: 1000;
          padding: 18px;
          background: linear-gradient(135deg, #f6fff9, #e3f4ee);
        }

        .navbar {
          max-width: 1200px;
          margin: auto;
          background: white;
          border-radius: 40px;
          padding: 14px 26px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 12px 30px rgba(0,0,0,0.12);
          font-family: "Poppins", system-ui, sans-serif;
        }

        .logo {
          font-size: 1.6rem;
          font-weight: 800;
          color: #2f6f4e;
          text-decoration: none;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 22px;
        }

        .nav-item {
          text-decoration: none;
          color: #333;
          font-weight: 600;
          font-size: 0.95rem;
          padding: 8px 16px;
          border-radius: 20px;
          transition: all 0.25s ease;
        }

        .nav-item:hover {
          background: #f1fbf6;
          color: #2f6f4e;
        }

        .nav-item.active {
          background: #2f6f4e;
          color: white;
        }

        .login-btn {
          background: linear-gradient(135deg, #2f6f4e, #3f8f67);
          color: white;
          padding: 10px 22px;
          border-radius: 999px;
          text-decoration: none;
          font-weight: 600;
        }

        .profile {
          position: relative;
        }

        .avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2f6f4e, #3f8f67);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          cursor: pointer;
        }

        .dropdown {
          position: absolute;
          top: 48px;
          right: 0;
          background: white;
          padding: 14px;
          border-radius: 14px;
          box-shadow: 0 12px 30px rgba(0,0,0,0.15);
          min-width: 220px;
        }

        .dropdown p {
          font-size: 12px;
          color: #555;
          margin-bottom: 10px;
          word-break: break-all;
        }

        .dropdown button {
          width: 100%;
          border: none;
          background: #d64545;
          color: white;
          padding: 10px;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
        }

        .hamburger {
          display: none;
          font-size: 1.8rem;
          background: none;
          border: none;
          cursor: pointer;
          color: #2f6f4e;
        }

        .mobile-menu {
          position: fixed;
          top: 0;
          right: 0;
          height: 100vh;
          width: 260px;
          background: white;
          box-shadow: -10px 0 30px rgba(0,0,0,0.15);
          padding: 30px 20px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          transform: translateX(100%);
          transition: transform 0.35s ease;
          z-index: 2000;
        }

        .mobile-menu.open {
          transform: translateX(0);
        }

        @media (max-width: 900px) {
          .nav-links {
            display: none;
          }
          .hamburger {
            display: block;
          }
        }
      `}</style>

      <div className="nav-wrapper">
        <nav className="navbar">
          <Link to="/" className="logo">
            PawHelp 🐾
          </Link>

          {/* ---------- DESKTOP MENU ---------- */}
          <div className="nav-links">
            <NavLink to="/" end className="nav-item">
              Home
            </NavLink>

            <NavLink to="/about" className="nav-item">
              About
            </NavLink>

            {/* USER */}
            {role === "USER" && (
              <>
                <NavLink to="/report" className="nav-item">
                  Report
                </NavLink>

                {/* 🔥 NEW HISTORY BUTTON */}
                <NavLink to="/history" className="nav-item">
                  History
                </NavLink>

                <NavLink to="/ngo-apply" className="nav-item">
                  Apply as NGO
                </NavLink>
              </>
            )}

            {/* NGO */}
            {role === "NGO" && (
              <NavLink to="/ngo" className="nav-item">
                NGO Dashboard
              </NavLink>
            )}

            {/* ADMIN */}
            {role === "ADMIN" && (
              <NavLink to="/admin" className="nav-item">
                Admin
              </NavLink>
            )}

            {/* AUTH */}
            {!role ? (
              <NavLink to="/login" className="login-btn">
                Login
              </NavLink>
            ) : (
              <div className="profile">
                <div
                  className="avatar"
                  onClick={() => setProfileOpen(!profileOpen)}
                >
                  {getInitial()}
                </div>

                {profileOpen && (
                  <div className="dropdown">
                    <p>{email}</p>
                    <button onClick={logoutUser}>Logout</button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ---------- HAMBURGER ---------- */}
          <button className="hamburger" onClick={() => setOpen(true)}>
            ☰
          </button>
        </nav>
      </div>

      {/* ---------- MOBILE MENU ---------- */}
      <div className={`mobile-menu ${open ? "open" : ""}`}>
        <NavLink to="/" onClick={() => setOpen(false)}>
          Home
        </NavLink>

        <NavLink to="/about" onClick={() => setOpen(false)}>
          About
        </NavLink>

        {role === "USER" && (
          <>
            <NavLink to="/report" onClick={() => setOpen(false)}>
              Report
            </NavLink>

            {/* 🔥 HISTORY MOBILE */}
            <NavLink to="/history" onClick={() => setOpen(false)}>
              History
            </NavLink>

            <NavLink to="/ngo-apply" onClick={() => setOpen(false)}>
              Apply as NGO
            </NavLink>
          </>
        )}

        {role === "NGO" && (
          <NavLink to="/ngo" onClick={() => setOpen(false)}>
            NGO Dashboard
          </NavLink>
        )}

        {role === "ADMIN" && (
          <NavLink to="/admin" onClick={() => setOpen(false)}>
            Admin
          </NavLink>
        )}

        {!role ? (
          <NavLink to="/login" onClick={() => setOpen(false)}>
            Login
          </NavLink>
        ) : (
          <button onClick={logoutUser}>Logout</button>
        )}
      </div>
    </>
  );
}

export default Navbar;