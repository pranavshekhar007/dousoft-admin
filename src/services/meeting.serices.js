import axios from "axios";
import { BASE_URL } from "../../src/utils/api_base_url_configration";

const token = localStorage.getItem("token");

const getConfig = () => {
  return {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
};

// Get Meeting List
export const getMeetingListServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "meeting/list", formData);
    return response;
  } catch (error) {
    console.error("Error fetching meetings:", error);
    throw error;
  }
};

// Schedule Meeting
export const addMeetingServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "meeting/schedule", formData);
    return response;
  } catch (error) {
    console.error("Error scheduling meeting:", error);
    throw error;
  }
};

// Delete Meeting
export const deleteMeetingServ = async (id) => {
  try {
    const response = await axios.delete(BASE_URL + "meeting/delete/" + id);
    return response;
  } catch (error) {
    console.error("Error deleting meeting:", error);
    throw error;
  }
};

// Update Meeting
export const updateMeetingServ = async (id, formData) => {
  try {
    const response = await axios.put(BASE_URL + "meeting/update/" + id, formData);
    return response;
  } catch (error) {
    console.error("Error updating meeting:", error);
    throw error;
  }
};

// Get Meeting Details
export const getMeetingDetailsServ = async (id) => {
  try {
    const response = await axios.get(BASE_URL + "meeting/details/" + id, getConfig());
    return response;
  } catch (error) {
    console.error("Error fetching meeting details:", error);
    throw error;
  }
};
