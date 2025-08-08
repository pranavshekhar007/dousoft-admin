import axios from "axios";
import { BASE_URL } from "../../src/utils/api_base_url_configration";

// No token required for forgot/reset password, but include for change-password
const getConfig = () => {
  const token = localStorage.getItem("token")
    ? JSON.parse(localStorage.getItem("token"))
    : null;
  return {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };
};

// FORGOT PASSWORD (send reset link)
export const forgotPasswordServ = async (email) => {
  try {
    const response = await axios.post(
      BASE_URL + "user/forgot-password",
      { email }
    );
    return response;
  } catch (error) {
    console.error("Error sending forgot password email:", error);
    throw error;
  }
};

// RESET PASSWORD (via link)
export const resetPasswordServ = async ({ token, password, confirmPassword }) => {
  try {
    const response = await axios.post(
      BASE_URL + "user/reset-password",
      { token, password, confirmPassword }
    );
    return response;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};

// CHANGE PASSWORD (from logged in user)
export const changePasswordServ = async ({
  currentPassword,
  newPassword,
  confirmPassword,
}) => {
  try {
    const response = await axios.put(
      BASE_URL + "change-password",
      { currentPassword, newPassword, confirmPassword },
      getConfig()
    );
    return response;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};
