import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import {
  getReviewListServ,
  createReviewServ,
  updateReviewServ,
  deleteReviewServ,
} from "../../services/doctorReview.services";
import Skeleton from "react-loading-skeleton";
import { toast } from "react-toastify";
import moment from "moment";
import NoRecordFound from "../../Components/NoRecordFound";
import "react-loading-skeleton/dist/skeleton.css";
import "react-toastify/dist/ReactToastify.css";
import { getUserListServ } from "../../services/user.service";
import Pagination from "../../Components/Pagination";

function ReviewPageList() {
  const [list, setList] = useState([]);
  const [statics, setStatics] = useState(null);
  const [payload, setPayload] = useState({
    type: "",
    status: "",
    pageNo: 1,
    pageCount: 10,
    sortByField: "",
    sortByOrder: "",
  });
  const [showSkelton, setShowSkelton] = useState(false);

  const [addFormData, setAddFormData] = useState({
    type: "text",
    review: "",
    video: "",
    rating: "",
    userId: "",
    status: true,
    show: false,
  });
  const [userOptions, setUserOptions] = useState([]);

  const [editFormData, setEditFormData] = useState({
    _id: "",
    type: "text",
    review: "",
    video: "",
    videoUrl: "",
    rating: "",
    userId: "",
    status: true,
    show: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  // Fetch list
  const handleGetReviewFunc = async () => {
    if (list.length === 0) setShowSkelton(true);
    try {
      let response = await getReviewListServ(payload);
      setList(response?.data?.data);
      setStatics(response?.data?.documentCount);
    } catch (error) {}
    setShowSkelton(false);
  };

  useEffect(() => {
    handleGetReviewFunc();
  }, [payload]);

  const staticsArr = [
    {
      title: "Total Reviews",
      count: statics?.totalCount,
      bgColor: "#6777EF",
    },
    {
      title: "Active Review",
      count: statics?.activeCount,
      bgColor: "#63ED7A",
    },
    {
      title: "Inactive Review",
      count: statics?.inactiveCount,
      bgColor: "#FFA426",
    },
  ];

  // Add review
  const handleAddReviewFunc = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("type", addFormData.type);
    formData.append("rating", addFormData.rating);
    formData.append("userId", addFormData.userId);
    formData.append("status", addFormData.status);

    if (addFormData.type === "text") {
      formData.append("review", addFormData.review);
    }
    if (addFormData.type === "video") {
      formData.append("video", addFormData.video);
    }
    try {
      let response = await createReviewServ(formData);
      if (response?.data?.statusCode === 200) {
        toast.success(response?.data?.message);
        setAddFormData({
          type: "text",
          review: "",
          video: "",
          rating: "",
          userId: "",
          status: true,
          show: false,
        });
        handleGetReviewFunc();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Internal Server Error");
    }
    setIsLoading(false);
  };

  // Update review
  const handleUpdateReviewFunc = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("_id", editFormData._id);
    formData.append("type", editFormData.type);
    formData.append("rating", editFormData.rating);
    formData.append("userId", editFormData.userId);
    formData.append("status", editFormData.status);
    if (editFormData.type === "text") {
      formData.append("review", editFormData.review);
    }
    if (editFormData.type === "video" && editFormData.video) {
      formData.append("video", editFormData.video);
    }
    try {
      let response = await updateReviewServ(formData);
      if (response?.data?.statusCode === 200) {
        toast.success(response?.data?.message);
        setEditFormData({
          _id: "",
          type: "text",
          review: "",
          video: "",
          videoUrl: "",
          rating: "",
          userId: "",
          status: true,
          show: false,
        });
        handleGetReviewFunc();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Internal Server Error");
    }
    setIsLoading(false);
  };

  // Delete review
  const handleDeleteReviewFunc = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this review?"
    );
    if (!confirmed) return;
    try {
      let response = await deleteReviewServ(id);
      if (response?.data?.statusCode === 200) {
        toast.success(response?.data?.message);
        handleGetReviewFunc();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Internal Server Error");
    }
  };

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await getUserListServ();
        setUserOptions(response?.data?.data || []);
      } catch (error) {
        setUserOptions([]);
      }
    }
    fetchUsers();
  }, []);

  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (statics?.totalCount && payload.pageCount) {
      const pages = Math.ceil(statics.totalCount / payload.pageCount);
      setTotalPages(pages);
    }
  }, [statics, payload.pageCount]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPayload({ ...payload, pageNo: newPage });
    }
  };

  // Render
  return (
    <div className="bodyContainer">
      <Sidebar selectedMenu="Review" selectedItem="Reviews" />
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
            {staticsArr?.map((v, i) => {
              return (
                <div className="col-md-4 col-12 ">
                  <div className="topCard shadow-sm py-4 px-3 rounded mb-3">
                    <div className="d-flex align-items-center ">
                      <div
                        className="p-2 shadow rounded"
                        style={{ background: v?.bgColor }}
                      >
                        <img src="https://cdn-icons-png.flaticon.com/128/666/666120.png" />
                      </div>
                      <div className="ms-3">
                        <h6>{v?.title}</h6>
                        <h2 className="text-secondary">{v?.count}</h2>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Search/filter/add */}
          <div className="row m-0 p-0 d-flex align-items-center my-4 topActionForm">
            <div className="col-lg-5 mb-2 col-md-12 col-12">
              <h3 className="mb-0 text-bold text-secondary">Reviews</h3>
            </div>
            <div className="col-lg-3 mb-2 col-md-12 col-12">
              {/* <label className="fw-semibold text-secondary mb-1">
                Filter by Type
              </label> */}
              <select
                className="form-control borderRadius24"
                value={payload.type || ""}
                onChange={(e) =>
                  setPayload({ ...payload, type: e.target.value, pageNo: 1 })
                }
              >
                <option value="">All Types</option>
                <option value="text">Text</option>
                <option value="video">Video</option>
              </select>
            </div>

            <div className="col-lg-2 mb-2">
              <select
                className="form-control borderRadius24"
                onChange={(e) =>
                  setPayload({ ...payload, status: e.target.value, pageNo: 1 })
                }
              >
                <option value="">All Status</option>
                <option value={true}>Active</option>
                <option value={false}>Inactive</option>
              </select>
            </div>
            {/* <div className="col-lg-2 mb-2">
              <select
                className="form-control borderRadius24"
                onChange={(e) =>
                  setPayload({ ...payload, sortByField: e.target.value })
                }
              >
                <option value="createdAt">Sort by Created</option>
                <option value="rating">Sort by Rating</option>
              </select>
            </div>
            <div className="col-lg-2 mb-2">
              <select
                className="form-control borderRadius24"
                onChange={(e) =>
                  setPayload({ ...payload, sortByOrder: e.target.value })
                }
              >
                <option value="desc">Desc</option>
                <option value="asc">Asc</option>
              </select>
            </div> */}
            <div className="col-lg-2 text-end mb-2">
              <button
                className="btn btn-primary w-100 borderRadius24"
                onClick={() => setAddFormData({ ...addFormData, show: true })}
              >
                Add Review
              </button>
            </div>
          </div>
          <div className="mt-3">
            <div className="card-body px-2">
              <div className="table-responsive table-invoice">
                <table className="table">
                  <thead>
                    <tr style={{ background: "#F3F3F3", color: "#000" }}>
                      <th
                        className="text-center py-3"
                        style={{ borderRadius: "30px 0px 0px 30px" }}
                      >
                        Sr. No
                      </th>
                      <th className="text-center py-3">Type</th>
                      <th className="text-center py-3">Review / Video</th>
                      <th className="text-center py-3">Rating</th>
                      <th className="text-center py-3">User</th>
                      <th className="text-center py-3">Status</th>
                      <th className="text-center py-3">Created</th>
                      <th
                        className="text-center py-3 "
                        style={{ borderRadius: "0px 30px 30px 0px" }}
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {showSkelton ? (
                      Array.from({ length: 8 }).map((_, i) => (
                        <tr key={i}>
                          <td>
                            <Skeleton />
                          </td>
                          <td>
                            <Skeleton />
                          </td>
                          <td>
                            <Skeleton />
                          </td>
                          <td>
                            <Skeleton />
                          </td>
                          <td>
                            <Skeleton />
                          </td>
                          <td>
                            <Skeleton />
                          </td>
                          <td>
                            <Skeleton />
                          </td>
                          <td>
                            <Skeleton />
                          </td>
                        </tr>
                      ))
                    ) : list.length === 0 ? (
                      <tr>
                        <td colSpan="8">
                          <NoRecordFound />
                        </td>
                      </tr>
                    ) : (
                      list.map((v, i) => (
                        <tr key={v._id}>
                          <td className="text-center py-3">{i + 1}</td>
                          <td className="text-center py-3">{v.type}</td>
                          <td className="text-center py-3">
                            {v.type === "text" ? (
                              v.review ? (
                                v.review
                              ) : (
                                "(No text)"
                              )
                            ) : v.videoUrl ? (
                              <video
                                src={v.videoUrl}
                                alt=""
                                width={120}
                                controls
                              />
                            ) : (
                              "(No video)"
                            )}
                          </td>
                          <td className="text-center py-3">{v.rating}</td>
                          <td className="text-center py-3">
                            {v.userId?.name || v.userId || ""}
                          </td>
                          <td className="text-center py-3">
                            <div
                              className="badge py-2"
                              style={{
                                background: v.status ? "#63ED7A" : "#FFA426",
                              }}
                            >
                              {v.status ? "Active" : "Inactive"}
                            </div>
                          </td>
                          <td className="text-center py-3">
                            {moment(v.createdAt).format("DD-MM-YYYY")}
                          </td>
                          <td className="text-center py-3">
                            <button
                              className="btn btn-info btn-sm mx-2"
                              onClick={() =>
                                setEditFormData({
                                  _id: v._id,
                                  type: v.type,
                                  review: v.review,
                                  video: "",
                                  videoUrl: v.videoUrl,
                                  rating: v.rating,
                                  userId: v.userId?._id || v.userId,
                                  status: v.status,
                                  show: true,
                                })
                              }
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-warning btn-sm mx-2"
                              onClick={() => handleDeleteReviewFunc(v._id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                <Pagination
                  totalPages={totalPages}
                  currentPage={payload.pageNo}
                  onPageChange={(page) =>
                    setPayload({ ...payload, pageNo: page })
                  }
                  pageCount={payload.pageCount}
                  onPageCountChange={(pc) =>
                    setPayload({ ...payload, pageCount: pc, pageNo: 1 })
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Add Review Modal */}
      {addFormData.show && (
        <div
          className="modal fade show d-flex align-items-center justify-content-center"
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div
              className="modal-content"
              style={{
                borderRadius: "16px",
                background: "#f7f7f5",
                width: "380px",
                height: "600px",
                overflowY: "auto",
              }}
            >
              <div className="d-flex justify-content-end pt-4 pb-0 px-4">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/9068/9068699.png"
                  style={{ height: "20px" }}
                  onClick={() =>
                    setAddFormData({
                      type: "text",
                      review: "",
                      video: "",
                      rating: "",
                      userId: "",
                      status: true,
                      show: false,
                    })
                  }
                  alt="close"
                />
              </div>
              <div className="modal-body">
                <h5 className="mb-4">Add Review</h5>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddReviewFunc();
                  }}
                >
                  <label>Type</label>
                  <select
                    className="form-control"
                    value={addFormData.type}
                    onChange={(e) =>
                      setAddFormData({ ...addFormData, type: e.target.value })
                    }
                  >
                    <option value="text">Text</option>
                    <option value="video">Video</option>
                  </select>
                  {addFormData.type === "text" && (
                    <>
                      <label className="mt-3">Review</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        value={addFormData.review}
                        onChange={(e) =>
                          setAddFormData({
                            ...addFormData,
                            review: e.target.value,
                          })
                        }
                        required
                      />
                    </>
                  )}
                  {addFormData.type === "video" && (
                    <>
                      <label className="mt-3">Video Upload</label>
                      <input
                        type="file"
                        accept="video/*"
                        className="form-control"
                        onChange={(e) =>
                          setAddFormData({
                            ...addFormData,
                            video: e.target.files[0],
                          })
                        }
                        required
                      />
                    </>
                  )}
                  <label className="mt-3">Rating</label>
                  <input
                    className="form-control"
                    type="number"
                    min={1}
                    max={5}
                    value={addFormData.rating}
                    onChange={(e) =>
                      setAddFormData({ ...addFormData, rating: e.target.value })
                    }
                    required
                  />

                  <label className="mt-3">User</label>
                  <select
                    className="form-control"
                    value={addFormData.userId}
                    onChange={(e) =>
                      setAddFormData({ ...addFormData, userId: e.target.value })
                    }
                    required
                  >
                    <option value="">Select User</option>
                    {userOptions.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.name || user.email}
                      </option>
                    ))}
                  </select>

                  <label className="mt-3">Status</label>
                  <select
                    className="form-control"
                    value={addFormData.status}
                    onChange={(e) =>
                      setAddFormData({
                        ...addFormData,
                        status:
                          e.target.value === "true" || e.target.value === true,
                      })
                    }
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                  <button
                    className="btn btn-success w-100 mt-4"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Submit"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      {addFormData.show && <div className="modal-backdrop fade show"></div>}
      {/* Edit Review Modal */}
      {editFormData.show && (
        <div
          className="modal fade show d-flex align-items-center justify-content-center"
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div
              className="modal-content"
              style={{
                borderRadius: "16px",
                background: "#f7f7f5",
                width: "380px",
                height: "600px",
                overflowY: "auto",
              }}
            >
              <div className="d-flex justify-content-end pt-4 pb-0 px-4">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/9068/9068699.png"
                  style={{ height: "20px" }}
                  onClick={() =>
                    setEditFormData({
                      _id: "",
                      type: "text",
                      review: "",
                      video: "",
                      videoUrl: "",
                      rating: "",
                      userId: "",
                      status: true,
                      show: false,
                    })
                  }
                  alt="close"
                />
              </div>
              <div className="modal-body">
                <h5 className="mb-4">Edit Review</h5>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdateReviewFunc();
                  }}
                >
                  <label>Type</label>
                  <select
                    className="form-control"
                    value={editFormData.type}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, type: e.target.value })
                    }
                  >
                    <option value="text">Text</option>
                    <option value="video">Video</option>
                  </select>
                  {editFormData.type === "text" && (
                    <>
                      <label className="mt-3">Review</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        value={editFormData.review}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            review: e.target.value,
                          })
                        }
                        required
                      />
                    </>
                  )}
                  {editFormData.type === "video" && (
                    <>
                      <label className="mt-3">Video Upload</label>
                      <input
                        type="file"
                        accept="video/*"
                        className="form-control"
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            video: e.target.files[0],
                          })
                        }
                      />
                      {editFormData.videoUrl && (
                        <video
                          src={editFormData.videoUrl}
                          alt=""
                          width={120}
                          controls
                        />
                      )}
                    </>
                  )}
                  <br />
                  <label className="mt-3">Rating</label>
                  <input
                    className="form-control"
                    type="number"
                    min={1}
                    max={5}
                    value={editFormData.rating}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        rating: e.target.value,
                      })
                    }
                    required
                  />
                  <label className="mt-3">User</label>
                  <select
                    className="form-control"
                    value={editFormData.userId}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        userId: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Select User</option>
                    {userOptions.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.name || user.email}
                      </option>
                    ))}
                  </select>

                  <label className="mt-3">Status</label>
                  <select
                    className="form-control"
                    value={editFormData.status}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        status:
                          e.target.value === "true" || e.target.value === true,
                      })
                    }
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                  <button
                    className="btn btn-success w-100 mt-4"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Submit"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      {editFormData.show && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}

export default ReviewPageList;
