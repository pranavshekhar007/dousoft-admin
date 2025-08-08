import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resetPasswordServ } from "../../services/password.services";

function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const res = await resetPasswordServ({ token, password, confirmPassword });
      setMessage(res.data.message || "Password reset successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
        "Reset failed. Your link may be expired. Try again."
      );
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: "80px auto" }}>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>New Password</label>
          <input
            type="password"
            value={password}
            required
            onChange={e => setPassword(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <label>Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            required
            onChange={e => setConfirmPassword(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>
        <button type="submit" disabled={loading} style={{ width: "100%" }}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
      {message && <p style={{ color: "green", marginTop: 15 }}>{message}</p>}
    </div>
  );
}

export default ResetPasswordPage;
