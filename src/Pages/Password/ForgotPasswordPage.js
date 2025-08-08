import React, { useState } from "react";
import { forgotPasswordServ } from "../../services/password.services";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const res = await forgotPasswordServ(email);
      setMessage(res.data.message || "If this email exists, a link was sent.");
      setEmail("");
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Something went wrong. Try again."
      );
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: "80px auto" }}>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email address</label>
          <input
            type="email"
            value={email}
            required
            onChange={e => setEmail(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>
        <button type="submit" disabled={loading} style={{ width: "100%" }}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
      {message && <p style={{ color: "green", marginTop: 15 }}>{message}</p>}
    </div>
  );
}

export default ForgotPasswordPage;
