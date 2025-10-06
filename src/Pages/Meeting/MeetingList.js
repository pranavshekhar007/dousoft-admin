import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import {
  getMeetingListServ,
  deleteMeetingServ,
  updateMeetingServ,
} from "../../services/meeting.serices";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import NoRecordFound from "../../Components/NoRecordFound";

function MeetingList() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [statics, setStatics] = useState(null);
  const [payload, setPayload] = useState({
    searchKey: "",
    status: "",
    pageNo: 1,
    pageCount: 10,
    sortByField: "",
    sortByOrder: "desc",
  });
  const [showSkelton, setShowSkelton] = useState(false);

  const handleGetMeetingFunc = async () => {
    if (list.length === 0) {
      setShowSkelton(true);
    }
    try {
      let response = await getMeetingListServ(payload);
      setList(response?.data?.data);
      setStatics(response?.data?.documentCount);
    } catch (error) {
      toast.error("Failed to fetch meetings");
    }
    setShowSkelton(false);
  };

  const staticsArr = [
    {
      title: "Total Meetings",
      count: statics?.totalCount,
      bgColor: "#6777EF",
    },
    {
      title: "Scheduled Meetings",
      count: statics?.scheduledCount,
      bgColor: "#FFA426",
    },
    {
      title: "Completed Meetings",
      count: statics?.completedCount,
      bgColor: "#63ED7A",
    },
    {
      title: "Cancelled Meetings",
      count: statics?.cancelledCount,
      bgColor: "#FF4500",
    },
  ];

  useEffect(() => {
    handleGetMeetingFunc();
  }, [payload]);

  const handleDeleteMeeting = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this meeting?"
    );
    if (confirmed) {
      try {
        let response = await deleteMeetingServ(id);
        if (response?.data?.statusCode === 200) {
          toast.success(response?.data?.message);
          handleGetMeetingFunc();
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Internal Server Error");
      }
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      let response = await updateMeetingServ(id, { status });
      if (response?.data?.statusCode === 200) {
        toast.success("Status updated successfully");
        handleGetMeetingFunc();
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="bodyContainer">
      <Sidebar selectedMenu="Meeting" selectedItem="Meeting" />
      <div className="mainContainer">
        <TopNav />
        <div className="p-lg-4 p-md-3 p-2">
          <div
            className="row mx-0 p-0"
            style={{
              position: "relative",
              top: "-75px",
              marginBottom: "-75px",
            }}
          >
            {staticsArr?.map((v, i) => (
              <div className="col-md-4 col-12" key={i}>
                <div className="topCard shadow-sm py-4 px-3 rounded mb-3">
                  <div className="d-flex align-items-center ">
                    <div
                      className="p-2 shadow rounded"
                      style={{ background: v?.bgColor }}
                    >
                      <img src="https://cdn-icons-png.flaticon.com/128/747/747310.png" />
                    </div>
                    <div className="ms-3">
                      <h6>{v?.title}</h6>
                      <h2 className="text-secondary">{v?.count}</h2>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Search and Filters */}
          <div className="row m-0 p-0 d-flex align-items-center my-4 topActionForm">
            <div className="col-lg-2 mb-2 col-md-12 col-12">
              <h3 className="mb-0 text-bold text-secondary">Meetings</h3>
            </div>
            <div className="col-lg-4 mb-2 col-md-12 col-12">
              <input
                className="form-control borderRadius24"
                placeholder="Search by agenda"
                onChange={(e) =>
                  setPayload({ ...payload, searchKey: e.target.value })
                }
              />
            </div>
            <div className="col-lg-3 mb-2  col-md-6 col-12">
              <select
                className="form-control borderRadius24"
                onChange={(e) =>
                  setPayload({ ...payload, status: e.target.value })
                }
              >
                <option value="">Select Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="col-lg-3 mb-2 col-md-6 col-12">
              <button
                className="btn btn-primary w-100 borderRadius24"
                style={{ background: "#6777EF" }}
                onClick={() => navigate("/schedule-meeting")}
              >
                Schedule Meeting
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="mt-3">
            <div className="card-body px-2">
              <div className="table-responsive table-invoice">
                <table className="table">
                  <tbody>
                    <tr style={{ background: "#F3F3F3", color: "#000" }}>
                      <th className="text-center py-3">Sr. No</th>
                      <th className="text-center py-3">Name</th>
                      <th className="text-center py-3">Email</th>
                      <th className="text-center py-3">Agenda</th>
                      <th className="text-center py-3">Date</th>
                      <th className="text-center py-3">Time</th>
                      <th className="text-center py-3">Status</th>
                      <th className="text-center py-3">Created At</th>
                      <th className="text-center py-3">Action</th>
                    </tr>

                    {showSkelton
                      ? [1, 2, 3, 4, 5].map((v, i) => (
                          <tr key={i}>
                            {Array(9)
                              .fill(0)
                              .map((_, idx) => (
                                <td className="text-center" key={idx}>
                                  <Skeleton width={100} height={25} />
                                </td>
                              ))}
                          </tr>
                        ))
                      : list?.map((v, i) => (
                          <tr key={v?._id}>
                            <td className="text-center">{i + 1}</td>
                            <td className="text-center">{v?.name}</td>
                            <td className="text-center">{v?.email}</td>
                            <td className="text-center">{v?.agenda}</td>
                            <td className="text-center">
                              {moment(v?.date).format("DD-MM-YYYY")}
                            </td>
                            <td className="text-center">{v?.time}</td>
                            <td className="text-center">
                              <select
                                value={v?.status}
                                onChange={(e) =>
                                  handleStatusChange(v?._id, e.target.value)
                                }
                                className={`form-select border-0 fw-bold text-center rounded-pill py-1 px-2 shadow-sm ${
                                  v?.status === "scheduled"
                                    ? "bg-warning text-dark"
                                    : v?.status === "completed"
                                    ? "bg-success text-white"
                                    : "bg-danger text-white"
                                }`}
                                style={{ minWidth: "130px", cursor: "pointer" }}
                              >
                                <option value="scheduled" className="text-dark">
                                  Scheduled
                                </option>
                                <option value="completed" className="text-dark">
                                  Completed
                                </option>
                                <option value="cancelled" className="text-dark">
                                  Cancelled
                                </option>
                              </select>
                            </td>

                            <td className="text-center">
                              {moment(v?.createdAt).format("DD-MM-YY")}
                            </td>
                            <td className="text-center">
                              <a
                                onClick={() => handleDeleteMeeting(v?._id)}
                                className="btn btn-warning mx-2 text-light shadow-sm"
                              >
                                Delete
                              </a>
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
                {list?.length === 0 && !showSkelton && <NoRecordFound />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MeetingList;
