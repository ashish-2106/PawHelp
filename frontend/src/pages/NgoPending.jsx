import { Link } from "react-router-dom";

function NgoPending() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>NGO Approval Pending ⏳</h1>

      <p style={styles.text}>
        Your NGO application has been submitted successfully.
        <br />
        Our admin team is reviewing your details.
      </p>

      <p style={styles.note}>
        You will get access to the NGO Dashboard once approved.
      </p>

      <Link to="/" style={styles.link}>
        Go back to Home
      </Link>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "80vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: "20px",
  },

  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#2f6f4e",
    marginBottom: "12px",
  },

  text: {
    fontSize: "16px",
    color: "#444",
    marginBottom: "8px",
  },

  note: {
    fontSize: "14px",
    color: "#777",
    marginBottom: "20px",
  },

  link: {
    textDecoration: "none",
    background: "#2f6f4e",
    color: "#fff",
    padding: "10px 22px",
    borderRadius: "999px",
    fontWeight: "600",
  },
};

export default NgoPending;
