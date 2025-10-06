import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import {
  getProductServ,
  updateProductServ,
  deleteProductServ,
  uploadExcelServ,
  downloadProductExportServ,
} from "../../services/product.services";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import NoRecordFound from "../../Components/NoRecordFound";
import { useNavigate } from "react-router-dom";
import { getCategoryServ } from "../../services/category.service";
import { triggerFileDownload } from "../../utils/fileDownload";
import {
  getAppointmentListServ,
  updateAppointmentServ,
} from "../../services/appointment.services";
import Pagination from "../../Components/Pagination";
function AppointmentList() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [statics, setStatics] = useState(null);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkForm, setBulkForm] = useState({
    name: "",
    file: null,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [payload, setPayload] = useState({
    searchKey: "",
    status: "",
    pageNo: 1,
    pageCount: 10,
    categoryId: "",
    sortByField: "",
  });
  const [showSkelton, setShowSkelton] = useState(false);
  const handleGetAppointmentFunc = async () => {
    if (list.length == 0) {
      setShowSkelton(true);
    }
    try {
      let response = await getAppointmentListServ(payload);
      setList(response?.data?.data);
      setStatics(response?.data?.documentCount);
    } catch (error) {}
    setShowSkelton(false);
  };
  const staticsArr = [
    {
      title: "Total Appointments",
      count: statics?.totalCount,
      bgColor: "#6777EF",
    },
    {
      title: "Confirmed Appointments",
      count: statics?.confirmedCount,
      bgColor: "#63ED7A",
    },
    {
      title: "Pending Appointments",
      count: statics?.pendingCount,
      bgColor: "#FFA426",
    },
    {
      title: "Rejected Appointments",
      count: statics?.rejectedCount,
      bgColor: "#FF4500",
    },
  ];
  useEffect(() => {
    handleGetAppointmentFunc();
  }, [payload]);

  const handleConfirmAppointment = async (id) => {
    try {
      await updateAppointmentServ({
        id: id,
        status: "confirmed",
      });

      toast.success("Appointment confirmed!");

      handleGetAppointmentFunc();
    } catch (err) {
      toast.error("Failed to confirm appointment");
    }
  };

  const handleRejectAppointment = async (id) => {
    try {
      await updateAppointmentServ({
        id: id,
        status: "rejected",
      });

      toast.success("Appointment rejected!");

      handleGetAppointmentFunc();
    } catch (err) {
      toast.error("Failed to reject appointment");
    }
  };

  const [isLoading, setIsLoading] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    productHeroImage: "",
    status: "",
    _id: "",
  });

  const updateProductFunc = async () => {
    try {
      let response = await updateProductServ({
        id: editFormData?._id,
        status: editFormData?.status,
      });
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        setEditFormData({
          name: "",
          productHeroImage: "",
          status: "",
          _id: "",
        });
        // handleGetProductFunc();
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
  };

  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    // handleGetProductFunc();
  }, [payload]);

  useEffect(() => {
    getCategoryList();
  }, []);

  const getCategoryList = async () => {
    try {
      let res = await getCategoryServ();
      setCategoryList(res?.data?.data || []);
    } catch (err) {
      console.log("Category fetch failed");
    }
  };

  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (statics?.totalCount && payload.pageCount) {
      const pages = Math.ceil(statics.totalCount / payload.pageCount);
      setTotalPages(pages);
    }
  }, [statics, payload.pageCount]);

  const handleBulkUpload = async () => {
    if (!bulkForm.name || !bulkForm.file) {
      toast.error("Please enter a name and select a file");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", bulkForm.file);

    try {
      const res = await uploadExcelServ(formData);
      if (res?.data?.statusCode === 200) {
        toast.success("Bulk upload successful!");
        setShowBulkModal(false);
        setBulkForm({ name: "", file: null });
        // handleGetProductFunc();
      } else {
        toast.error(res?.data?.message || "Upload failed");
      }
    } catch (err) {
      console.error("Bulk Upload Error:", err);
      const errorData = err?.response?.data;
      if (errorData?.statusCode === 409) {
        toast.error(errorData.message);
      } else if (errorData?.message) {
        toast.error(errorData.message);
      } else {
        toast.error("Server Error during upload");
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async (format) => {
    try {
      const response = await downloadProductExportServ(payload, format);
      const ext = format === "excel" ? "xlsx" : format;
      triggerFileDownload(response.data, `productList.${ext}`);
    } catch (err) {
      toast.error("Download failed");
    }
  };
  return (
    <div className="bodyContainer">
      <Sidebar
        selectedMenu="Apppointment Management"
        selectedItem="Apppointments"
      />
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
          <div className="row m-0 p-0 d-flex align-items-center my-4 topActionForm">
            <div className="col-lg-6 mb-2 col-md-12 col-12">
              <h3 className="mb-0 text-bold text-secondary">Appointments</h3>
            </div>
            <div className="col-lg-4 mb-2 col-md-12 col-12">
              <div>
                <input
                  className="form-control borderRadius24"
                  placeholder="Search"
                  onChange={(e) =>
                    setPayload({ ...payload, searchKey: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="col-lg-2 mb-2 col-md-6 col-12">
              <div>
                <select
                  className="form-control borderRadius24"
                  value={payload.status}
                  onChange={(e) =>
                    setPayload({ ...payload, status: e.target.value })
                  }
                >
                  <option value="">All Status</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* <div className="col-lg-2 mb-2 col-md-6 col-12">
              <select
                className="form-control borderRadius24"
                onChange={(e) =>
                  setPayload({ ...payload, categoryId: e.target.value })
                }
                value={payload.categoryId}
              >
                <option value="">Select Category</option>
                {categoryList?.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div> */}

            {/* <div className="col-lg-2 mb-2 col-md-6 col-12">
              <button
                className="btn w-100 borderRadius24 text-light"
                style={{ background: "#c34b36" }}
                onClick={() => navigate("/add-appointment")}
              >
                Add Appointment
              </button>
            </div> */}
            {/* <div className="col-lg-3 mb-2 col-md-6 col-12">
              <button
                className="btn w-100 borderRadius24 text-light p-2"
                style={{ background: "#354f52" }}
                onClick={() => setShowBulkModal(true)}
              >
                Add Bulk Products
              </button>
            </div> */}
            {/* <div className="col-lg-2 mb-2 col-md-6 col-12 dropdown">
              <button
                className="btn w-100 borderRadius24 text-light p-2 dropdown-toggle"
                style={{ background: "#227C9D" }}
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Download
              </button>
              <ul className="dropdown-menu w-100">
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => handleDownload("txt")}
                  >
                    Download as TXT
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => handleDownload("excel")}
                  >
                    Download as Excel
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => handleDownload("csv")}
                  >
                    Download as CSV
                  </button>
                </li>
              </ul>
            </div> */}
          </div>
          <div className="mt-3">
            <div className="card-body px-2">
              <div className="table-responsive table-invoice">
                <table className="table">
                  <tbody>
                    <tr style={{ background: "#F3F3F3", color: "#000" }}>
                      <th
                        className="text-center py-3"
                        style={{ borderRadius: "30px 0px 0px 30px" }}
                      >
                        Sr. No
                      </th>
                      <th className="text-center">Name</th>
                      <th className="text-center">Email</th>
                      <th className="text-center">Time</th>
                      <th className="text-center" style={{ width: "200px" }}>
                        Subject
                      </th>
                      <th className="text-center">Status</th>
                      <th
                        className="text-center py-3"
                        style={{ borderRadius: "0px 30px 30px 0px" }}
                      >
                        Action
                      </th>
                    </tr>

                    {showSkelton
                      ? [1, 2, 3, 4, 5, 6, 7, 8, 9].map((v, i) => (
                          <tr key={i}>
                            <td className="text-center">
                              <Skeleton width={50} height={20} />
                            </td>
                            <td className="text-center">
                              <Skeleton width={100} height={20} />
                            </td>
                            <td className="text-center">
                              <Skeleton width={100} height={20} />
                            </td>
                            <td className="text-center">
                              <Skeleton width={150} height={20} />
                            </td>
                            <td className="text-center">
                              <Skeleton width={100} height={20} />
                            </td>
                            <td className="text-center">
                              <Skeleton width={100} height={20} />
                            </td>
                          </tr>
                        ))
                      : list?.map((v, i) => (
                          <tr key={v?._id}>
                            <td className="text-center">
                              {(payload.pageNo - 1) * payload.pageCount + i + 1}
                            </td>

                            <td className="font-weight-600 text-center">
                              {v?.name}
                            </td>

                            <td className="font-weight-600 text-center">
                              {v?.email}
                            </td>

                            <td className="font-weight-600 text-center">
                              {v?.time}
                            </td>

                            <td
                              className="font-weight-600 text-center"
                              style={{
                                maxWidth: "200px",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {v?.subject}
                            </td>

                            <td className="text-center">
                              <span
                                style={{
                                  display: "inline-block",
                                  padding: "5px 15px",
                                  borderRadius: "15px",
                                  fontSize: "14px",
                                  backgroundColor:
                                    v?.status === "confirmed"
                                      ? "#42f2a1"
                                      : v?.status === "pending"
                                      ? "#ffed87"
                                      : v?.status === "rejected"
                                      ? "#f44336"
                                      : "#ddd",
                                  color:
                                    v?.status === "pending" ? "#000" : "#fff",
                                }}
                              >
                                {v?.status?.charAt(0).toUpperCase() +
                                  v?.status?.slice(1)}
                              </span>
                            </td>

                            <td className="text-center">
                              <button
                                className="btn btn-sm mx-1"
                                title="Edit"
                                onClick={() =>
                                  navigate(`/appointment-edit/${v?._id}`)
                                }
                              >
                                ✏️
                              </button>

                              <button
                                className="btn btn-sm mx-1"
                                title="Reject"
                                onClick={() => handleRejectAppointment(v?._id)}
                              >
                                ❌
                              </button>

                              <button
                                className="btn btn-sm mx-1"
                                title="Confirm"
                                onClick={() => handleConfirmAppointment(v?._id)}
                              >
                                ✅
                              </button>
                            </td>
                          </tr>
                        ))}
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

                {list.length == 0 && !showSkelton && <NoRecordFound />}
              </div>
            </div>
          </div>
        </div>
      </div>
      {editFormData?._id && (
        <div
          className="modal fade show d-flex align-items-center  justify-content-center "
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div
              className="modal-content"
              style={{
                borderRadius: "16px",
                background: "#f7f7f5",
                width: "364px",
              }}
            >
              <div className="d-flex justify-content-end pt-4 pb-0 px-4">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/9068/9068699.png"
                  style={{ height: "20px" }}
                  onClick={() =>
                    setEditFormData({
                      _id: "",
                      name: "",
                      productHeroImage: "",
                      status: "",
                    })
                  }
                />
              </div>

              <div className="modal-body">
                <div
                  style={{
                    wordWrap: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                  className="d-flex justify-content-center w-100"
                >
                  <div className="w-100 px-2">
                    <h5 className="mb-4">Update Status</h5>
                    <div className="p-3 border rounded mb-2">
                      <img
                        src={editFormData?.productHeroImage}
                        className="img-fluid w-100 shadow rounded"
                        style={{ height: "200px" }}
                      />
                    </div>

                    <label className="mt-3">Name</label>
                    <input
                      className="form-control"
                      type="text"
                      readOnly
                      value={editFormData?.name}
                    />
                    <label className="mt-3">Status</label>
                    <select
                      className="form-control"
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          status: e?.target?.value,
                        })
                      }
                      value={editFormData?.status}
                    >
                      <option value="">Select Status</option>
                      <option value={true}>Active</option>
                      <option value={false}>Inactive</option>
                    </select>

                    {editFormData?.status ? (
                      <button
                        className="btn btn-success w-100 mt-4"
                        onClick={!isLoading && updateProductFunc}
                      >
                        {isLoading ? "Saving..." : "Submit"}
                      </button>
                    ) : (
                      <button
                        className="btn btn-success w-100 mt-4"
                        style={{ opacity: "0.5" }}
                      >
                        Submit
                      </button>
                    )}
                  </div>
                </div>
                <div className="d-flex justify-content-center"></div>
              </div>
            </div>
          </div>
        </div>
      )}
      {editFormData?._id && <div className="modal-backdrop fade show"></div>}
      {showBulkModal && (
        <>
          <div
            className="modal fade show d-flex align-items-center justify-content-center"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            tabIndex="-1"
          >
            <div className="modal-dialog">
              <div
                className="modal-content"
                style={{
                  borderRadius: "16px",
                  background: "#f7f7f5",
                  width: "364px",
                }}
              >
                {/* Custom close button */}
                <div className="d-flex justify-content-end pt-4 pb-0 px-4">
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/9068/9068699.png"
                    style={{ height: "20px", cursor: "pointer" }}
                    onClick={() => setShowBulkModal(false)}
                    alt="Close"
                  />
                </div>

                {/* Modal Body */}
                <div className="modal-body">
                  <div
                    style={{
                      wordWrap: "break-word",
                      whiteSpace: "pre-wrap",
                    }}
                    className="d-flex justify-content-center w-100"
                  >
                    <div className="w-100 px-2">
                      <h5 className="mb-4">Upload Bulk Products</h5>

                      <div className="mb-3">
                        <label className="form-label">Bulk Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={bulkForm.name}
                          onChange={(e) =>
                            setBulkForm({ ...bulkForm, name: e.target.value })
                          }
                          placeholder="Enter bulk upload name"
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">
                          Upload File (CSV/Excel)
                        </label>
                        <input
                          type="file"
                          className="form-control"
                          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                          onChange={(e) =>
                            setBulkForm({
                              ...bulkForm,
                              file: e.target.files[0],
                            })
                          }
                        />
                      </div>

                      <button
                        className="btn btn-primary w-100 mt-3"
                        onClick={handleBulkUpload}
                        disabled={
                          isUploading || !bulkForm.name || !bulkForm.file
                        }
                        style={{
                          opacity: !bulkForm.name || !bulkForm.file ? 0.6 : 1,
                        }}
                      >
                        {isUploading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Uploading...
                          </>
                        ) : (
                          "Upload"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Backdrop */}
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
}

export default AppointmentList;
