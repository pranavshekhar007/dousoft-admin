import axios from "axios";
import { BASE_URL } from "../../src/utils/api_base_url_configration";

const token = localStorage.getItem("token");

const getConfig = (isMultipart = false) => {
  return {
    headers: {
      "Content-Type": isMultipart ? "multipart/form-data" : "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
};

// Create Career Job
export const createCareerServ = async (formData) => {
  try {
    const response = await axios.post(
      BASE_URL + "career/create",
      formData,
    );
    return response;
  } catch (error) {
    console.error("Error creating career job:", error);
    throw error;
  }
};

// List Career Jobs
export const getCareerListServ = async (filters) => {
  try {
    const response = await axios.post(
      BASE_URL + "career/list",
      filters,
    );
    return response;
  } catch (error) {
    console.error("Error fetching career list:", error);
    throw error;
  }
};

// Get Career Details
export const getCareerDetailsServ = async (id) => {
  try {
    const response = await axios.get(BASE_URL + "career/details/" + id);
    return response;
  } catch (error) {
    console.error("Error fetching career details:", error);
    throw error;
  }
};

// Update Career Job
export const updateCareerServ = async (id, formData) => {
  try {
    const response = await axios.put(
      BASE_URL + "career/update/" + id,
      formData,
    );
    return response;
  } catch (error) {
    console.error("Error updating career job:", error);
    throw error;
  }
};

// Delete Career Job
export const deleteCareerServ = async (id) => {
  try {
    const response = await axios.delete(
      BASE_URL + "career/delete/" + id,
    );
    return response;
  } catch (error) {
    console.error("Error deleting career job:", error);
    throw error;
  }
};

// Upload Candidate CV
export const uploadCareerCvServ = async (careerId, file) => {
  try {
    const formData = new FormData();
    formData.append("cv", file);

    const response = await axios.post(
      BASE_URL + "career/upload-cv/" + careerId,
      formData,
    );
    return response;
  } catch (error) {
    console.error("Error uploading CV:", error);
    throw error;
  }
};
