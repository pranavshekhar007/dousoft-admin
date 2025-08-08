import axios from "axios";
import { BASE_URL } from "../../src/utils/api_base_url_configration";

const getConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };
};

export const getReviewListServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "doctor-review/list", formData);
    return response;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};

export const createReviewServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "doctor-review/create", formData, getConfig());
    return response;
  } catch (error) {
    console.error("Error creating review:", error);
    throw error;
  }
};

export const updateReviewServ = async (formData) => {
  try {
    const response = await axios.put(BASE_URL + "doctor-review/update", formData, getConfig());
    return response;
  } catch (error) {
    console.error("Error updating review:", error);
    throw error;
  }
};

export const deleteReviewServ = async (id) => {
  try {
    const response = await axios.delete(BASE_URL + "doctor-review/delete/" + id, getConfig());
    return response;
  } catch (error) {
    console.error("Error deleting review:", error);
    throw error;
  }
};
