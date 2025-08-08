import axios from "axios";

import { BASE_URL } from "../../src/utils/api_base_url_configration";

const getConfig = () => {
  return {
    headers: {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
      Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
    },
  };
};

// Create Appointment Service
export const createAppointmentServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "appointment/create", formData, getConfig());
    return response;
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw error;
  }
};

//  Get Appointment List
export const getAppointmentListServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "appointment/list", formData);
    return response;
  } catch (error) {
    console.error("Error fetching appointment list:", error);
    throw error;
  }
};

//  Update Appointment Status
export const updateAppointmentServ = async (formData) => {
  try {
    const response = await axios.put(BASE_URL + "appointment/update", formData);
    return response;
  } catch (error) {
    console.error("Error updating appointment:", error);
    throw error;
  }
};

//  Get Appointment Details
export const getAppointmentDetailsServ = async (id) => {
  try {
    const response = await axios.get(BASE_URL + `appointment/details/${id}`);
    return response;
  } catch (error) {
    console.error("Error fetching appointment details:", error);
    throw error;
  }
};

//  Delete Appointment
export const deleteAppointmentServ = async (id) => {
  try {
    const response = await axios.delete(BASE_URL + `appointment/delete/${id}`);
    return response;
  } catch (error) {
    console.error("Error deleting appointment:", error);
    throw error;
  }
};
