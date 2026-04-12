import { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ---------------- EMAIL LOGIN ----------------
  const loginUser = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      await handleBackendLogin(result.user);
    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
      setLoading(false);
    }
  };

  // ---------------- GOOGLE LOGIN ----------------
  const loginWithGoogle = async () => {
    setError("");
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      provider.addScope("profile");
      provider.addScope("email");

      const result = await signInWithPopup(auth, provider);
      await handleBackendLogin(result.user);
    } catch (err) {
      console.error(err);
      setError("Google login failed");
      setLoading(false);
    }
  };

  // ---------------- BACKEND ROLE HANDLER ----------------
  const handleBackendLogin = async (user) => {
    const res = await fetch("http://127.0.0.1:5000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid: user.uid,
        email: user.email,
      }),
    });

    const data = await res.json();

    // 🔐 STORE AUTH STATE
    localStorage.setItem("role", data.role);
    localStorage.setItem("user_id", data.user_id);

    if (data.ngo_status) {
      localStorage.setItem("ngo_status", data.ngo_status);
    } else {
      localStorage.removeItem("ngo_status");
    }

    // 🔥 FORCE NAVBAR + APP UPDATE (NO REFRESH)
    window.dispatchEvent(new Event("storage"));

    // 🚦 REDIRECT BY ROLE
    if (data.role === "ADMIN") navigate("/admin");
    else if (data.role === "NGO" && data.ngo_status === "PENDING")
      navigate("/ngo-pending");
    else if (data.role === "NGO")
      navigate("/ngo");
    else navigate("/");

    setLoading(false);
  };

  return (
    <>
      {/* ---------- GLOBAL STYLES ---------- */}
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: "Poppins", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        }

        input:focus {
          outline: none;
          border-color: #2f6f4e;
          box-shadow: 0 0 0 2px rgba(47, 111, 78, 0.15);
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>

      <div style={styles.page}>
        <div style={styles.card}>
          <h1 style={styles.title}>PawHelp 🐾</h1>
          <p style={styles.subtitle}>Welcome back! Login to continue</p>

          <form onSubmit={loginUser} style={styles.form}>
            <input
              type="email"
              placeholder="Email address"
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              style={styles.primaryButton}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div style={styles.divider}>
            <span>OR</span>
          </div>

          <button
            onClick={loginWithGoogle}
            style={styles.googleButton}
            disabled={loading}
          >
            Continue with Google
          </button>

          {error && <p style={styles.error}>{error}</p>}

          <p style={styles.footerText}>
            Don’t have an account?{" "}
            <Link to="/signup" style={styles.link}>
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "radial-gradient(circle at top left, #eaf7f0, #f4fbf8, #eef8f2)",
    padding: "20px",
  },

  card: {
    background: "#ffffff",
    padding: "42px 36px",
    borderRadius: "26px",
    width: "100%",
    maxWidth: "380px",
    boxShadow: "0 25px 50px rgba(0,0,0,0.12)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  title: {
    fontSize: "30px",
    fontWeight: "700",
    color: "#2f6f4e",
    marginBottom: "6px",
  },

  subtitle: {
    fontSize: "14px",
    color: "#5f7d6b",
    marginBottom: "26px",
  },

  form: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  input: {
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid #dfeee6",
    fontSize: "14px",
    transition: "all 0.2s ease",
  },

  primaryButton: {
    padding: "14px",
    borderRadius: "999px",
    background: "linear-gradient(135deg, #2f6f4e, #3f8f67)",
    color: "#fff",
    border: "none",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "6px",
  },

  divider: {
    margin: "18px 0",
    width: "100%",
    textAlign: "center",
    fontSize: "12px",
    color: "#999",
  },

  googleButton: {
    padding: "13px",
    width: "100%",
    borderRadius: "999px",
    border: "1px solid #dfeee6",
    background: "#fff",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },

  error: {
    marginTop: "14px",
    fontSize: "13px",
    color: "#d64545",
    textAlign: "center",
  },

  footerText: {
    marginTop: "22px",
    fontSize: "13px",
    color: "#555",
  },

  link: {
    color: "#2f6f4e",
    fontWeight: "600",
    textDecoration: "none",
  },
};

export default Login;
