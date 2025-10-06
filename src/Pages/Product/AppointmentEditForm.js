import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getAppointmentDetailsServ,
  updateAppointmentServ,
} from "../../services/appointment.services";
import { useParams, useNavigate } from "react-router-dom";

function AppointmentEditForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    subject: "",
    status: "pending",
  });

  const [loader, setLoader] = useState(false);

  // Fetch appointment details on mount

  async function fetchDetails() {
    try {
      const res = await getAppointmentDetailsServ(id);
      if (res?.data?.statusCode === 200) {
        setFormData({
          ...formData,
          ...res.data.data,
        });
      } else {
        toast.error("Failed to fetch details");
      }
    } catch (err) {
      toast.error("Error loading appointment");
    }
  }
  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      const { createdAt, updatedAt, __v, ...safeData } = formData;
      const payload = { ...safeData, id };
      const res = await updateAppointmentServ(payload);
      if (res?.data?.statusCode === 200) {
        toast.success(res.data.message || "Appointment updated!");
        setTimeout(() => navigate("/appointment-list"), 1200);
      } else {
        toast.error(res.data.message || "Update failed");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Internal Server Error");
    }
    setLoader(false);
  };
  

  return (
    <div className="bodyContainer">
      <Sidebar selectedMenu="Apppointment Management" selectedItem="Apppointments" />
      <div className="mainContainer">
        <TopNav />
        <div className="p-lg-4 p-md-3 p-2">
          <div className="mt-3">
            <div className="card-body px-2">
              <h4
                className="p-2 text-dark shadow rounded mb-4"
                style={{ background: "#05E2B5" }}
              >
                Edit Appointment
              </h4>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-6 mb-3">
                    <label>Name*</label>
                    <input
                      className="form-control"
                      name="name"
                      required
                      value={formData.name || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-6 mb-3">
                    <label>Email*</label>
                    <input
                      className="form-control"
                      name="email"
                      required
                      value={formData.email || ""}
                      type="email"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-6 mb-3">
                    <label>Phone*</label>
                    <input
                      className="form-control"
                      name="phone"
                      required
                      value={formData.phone || ""}
                      type="tel"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-6 mb-3">
                    <label>Subject*</label>
                    <input
                      className="form-control"
                      name="subject"
                      required
                      value={formData.subject || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-6 mb-3">
                    <label>Date*</label>
                    <input
                      className="form-control"
                      name="date"
                      required
                      value={formData.date || ""}
                      type="date"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-6 mb-3">
                    <label>Time*</label>
                    <input
                      className="form-control"
                      name="time"
                      required
                      value={formData.time || ""}
                      type="time"
                      onChange={handleChange}
                    />
                  </div>
              
                  <div className="col-6 mb-3">
                    <label>Status</label>
                    <select
                      className="form-control"
                      name="status"
                      value={formData.status || "pending"}
                      onChange={handleChange}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>                

                  <div className="col-12">
                    <button
                      className="btn btn-primary w-100"
                      style={{
                        background: "#05E2B5",
                        border: "none",
                        borderRadius: "24px",
                        opacity: loader ? 0.7 : 1,
                      }}
                      type="submit"
                      disabled={loader}
                    >
                      {loader ? "Saving ..." : "Update Appointment"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppointmentEditForm;
