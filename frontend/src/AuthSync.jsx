import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

function AuthSync() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // ❌ No Firebase session → nothing to sync
      if (!user) return;

      try {
        // 🔄 Always re-sync role from backend
        const res = await fetch("http://127.0.0.1:5000/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uid: user.uid,
            email: user.email,
          }),
        });

        const data = await res.json();

        // ✅ Restore role & NGO status
        localStorage.setItem("role", data.role);
        localStorage.setItem("user_id", data.user_id);

        if (data.ngo_status) {
          localStorage.setItem("ngo_status", data.ngo_status);
        } else {
          localStorage.removeItem("ngo_status");
        }

        // 🔔 Tell Navbar + ProtectedRoute to update
        window.dispatchEvent(new Event("storage"));
      } catch (err) {
        console.error("AuthSync failed:", err);
      }
    });

    return () => unsubscribe();
  }, []);

  return null; // no UI
}

export default AuthSync;
