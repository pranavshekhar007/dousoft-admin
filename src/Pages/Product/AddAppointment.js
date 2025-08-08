// import React, { useState, useEffect, useRef } from "react";
// import Sidebar from "../../Components/Sidebar";
// import TopNav from "../../Components/TopNav";
// import Skeleton from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import JoditEditor from "jodit-react";
// import { getTagSetServ } from "../../services/tag.service";
// import { getProductTypeServ } from "../../services/productType.service";
// import { getTaxServ } from "../../services/tax.service";
// import { addProductServ } from "../../services/product.services";
// import Select from "react-select";
// import { useGlobalState } from "../../GlobalProvider";
// import { useNavigate } from "react-router-dom";
// import { getCategoryServ } from "../../services/category.service";
// function AddProduct() {
//   const { globalState, setGlobalState } = useGlobalState();
//   const navigate = useNavigate();
//   const editor = useRef(null);
//   const contentRef = useRef("");
//   const config = {
//     placeholder: "Start typing...",
//     height: "300px",
//   };
//   const [hsnError, setHsnError] = useState("");

//   const [content, setContent] = useState("");
//   const [formData, setFormData] = useState({
//     name: "",
//     tags: "",
//     productType: "",
//     tax: "",
//     categoryId: "",
//     hsnCode: "",
//     GTIN: "",
//     specialAppearance: [],
//     shortDescription: "",
//   });
//   const [tags, setTags] = useState([]);
//   const getTagListFunc = async () => {
//     try {
//       let response = await getTagSetServ({ status: true });
//       if (response?.data?.statusCode == "200") {
//         setTags(response?.data?.data);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   const [productType, setProductType] = useState([]);
//   const getProductListFunc = async () => {
//     try {
//       let response = await getProductTypeServ({ status: true });
//       if (response?.data?.statusCode == "200") {
//         setProductType(response?.data?.data);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   const [taxList, setTaxList] = useState([]);
//   const getTaxListFunc = async () => {
//     try {
//       let response = await getTaxServ({ status: true });
//       if (response?.data?.statusCode == "200") {
//         setTaxList(response?.data?.data);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const [categoryList, setCategoryList] = useState([]);
//   const getCategoryListFunc = async () => {
//     try {
//       let response = await getCategoryServ({ status: true });
//       if (response?.data?.statusCode == "200") {
//         setCategoryList(response?.data?.data);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     getTagListFunc();
//     getProductListFunc();
//     getTaxListFunc();
//     getCategoryListFunc();
//   }, []);
//   const [loader, setLoader] = useState(false);
//   const handleSubmit = async () => {
//     setLoader(true);
//     try {
//       let finalPayload;
//       const shortDescription = contentRef.current;
//       if (formData?.createdByAdmin != "No") {
//         finalPayload = {
//           name: formData?.name,
//           tags: formData?.tags,
//           productType: formData?.productType,
//           tax: formData?.tax,
//           categoryId: formData?.categoryId,
//           hsnCode: formData?.hsnCode,
//           GTIN: formData?.GTIN,
//           specialAppearance: formData?.specialAppearance,
//           shortDescription: shortDescription,
//         };
//       }
//       if (formData?.createdByAdmin == "No") {
//         finalPayload = {
//           name: formData?.name,
//           tags: formData?.tags,
//           productType: formData?.productType,
//           tax: formData?.tax,
//           categoryId: formData?.categoryId,
//           madeIn: formData?.madeIn,
//           hsnCode: formData?.hsnCode,
//           GTIN: formData?.GTIN,
//           specialAppearance: formData?.specialAppearance,
//           shortDescription: shortDescription,
//           createdBy: formData?.createdBy,
//         };
//       }
//       let response = await addProductServ(finalPayload);
//       if (response?.data?.statusCode == 200) {
//         toast.success(response?.data?.message);
//         setFormData({
//           name: "",
//           tags: [],
//           productType: "",
//           tax: "",
//           categoryId: "",
//           madeIn: "",
//           hsnCode: "",
//           GTIN: "",
//           specialAppearance: [],
//           createdBy: "",
//           createdByAdmin: "",
//         });
//         contentRef.current = "";
//         setContent("");
//         navigate("/update-product-step2/" + response?.data?.data?._id);
//       } else {
//         toast.error("Something went wrong");
//       }
//     } catch (error) {
//       toast.error("Internal Server Error");
//     }
//     setLoader(false);
//   };

//   const specialAppearanceOptions = [
//     { label: "daily sell", value: "daily sell" },
//     { label: "our shop", value: "our shop" },
//     { label: "new Arrivals", value: "new Arrivals" },
//   ];

//   return (
//     <div className="bodyContainer">
//       <Sidebar selectedMenu="Product Management" selectedItem="Add Product" />
//       <div className="mainContainer">
//         <TopNav />
//         <div className="p-lg-4 p-md-3 p-2">
//           <div
//             className="row mx-0 p-0"
//             style={{
//               position: "relative",
//               top: "-75px",
//               marginBottom: "-75px",
//             }}
//           ></div>

//           <div className="mt-3">
//             <div className="card-body px-2">
//               <div className="table-responsive table-invoice">
//                 <div className="d-flex">
//                   <h4
//                     className="p-2 text-dark shadow rounded mb-4 "
//                     style={{ background: "#05E2B5" }}
//                   >
//                     Add Product : Step 1/3
//                   </h4>
//                 </div>
//               </div>
//               <div className="row">
//                 <div className="col-6 mb-3">
//                   <label>Product Name*</label>
//                   <input
//                     value={formData?.name}
//                     onChange={(e) =>
//                       setFormData({ ...formData, name: e?.target?.value })
//                     }
//                     className="form-control"
//                     style={{ height: "45px" }}
//                   />
//                 </div>
//                 <div className="col-6 mb-3">
//                   <label>Tags</label>
//                   <Select
//                     isMulti
//                     options={tags?.map((v) => ({
//                       label: v?.name,
//                       value: v?._id,
//                     }))}
//                     onChange={(selectedOptions) =>
//                       setFormData({
//                         ...formData,
//                         tags: selectedOptions.map((option) => option.label), // only array of string IDs
//                       })
//                     }
//                     className="basic-multi-select"
//                     classNamePrefix="select"
//                   />
//                 </div>
//                 <div className="col-6 mb-3">
//                   <label>Select Product Type</label>
//                   <select
//                     className="form-control"
//                     value={formData?.productType}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         productType: e?.target?.value,
//                       })
//                     }
//                   >
//                     <option>Select</option>
//                     {productType?.map((v, i) => {
//                       return <option>{v?.name}</option>;
//                     })}
//                   </select>
//                 </div>
//                 <div className="col-6 mb-3">
//                   <label>Select Tax*</label>
//                   <select
//                     className="form-control"
//                     value={formData?.tax}
//                     onChange={(e) =>
//                       setFormData({ ...formData, tax: e?.target?.value })
//                     }
//                   >
//                     <option>Select</option>
//                     {taxList?.map((v, i) => {
//                       return (
//                         <option>
//                           {v?.name + "" + (v?.percentage + " %")}{" "}
//                         </option>
//                       );
//                     })}
//                   </select>
//                 </div>
//                 <div className="col-6 mb-3">
//                   <label>Category*</label>
//                   <Select
//                     isMulti
//                     options={categoryList?.map((v) => ({
//                       label: v?.name,
//                       value: v?._id,
//                     }))}
//                     onChange={(selectedOptions) =>
//                       setFormData({
//                         ...formData,
//                         categoryId: selectedOptions.map(
//                           (option) => option.value
//                         ),
//                       })
//                     }
//                     className="basic-multi-select"
//                     classNamePrefix="select"
//                   />
//                 </div>

//                 <div className="col-6 mb-3">
//                   <label>HSN Code*</label>
//                   <input
//                     className={`form-control ${hsnError ? "is-invalid" : ""}`}
//                     style={{ height: "45px" }}
//                     value={formData?.hsnCode}
//                     onChange={(e) => {
//                       const value = e.target.value;
//                       if (/^\d*$/.test(value)) {
//                         setFormData({ ...formData, hsnCode: value });
//                         setHsnError("");
//                       } else {
//                         setHsnError("Only numbers are allowed in HSN Code");
//                       }
//                     }}
//                   />
//                   {hsnError && (
//                     <div className="invalid-feedback">{hsnError}</div>
//                   )}
//                 </div>

//                 <div className="col-6 mb-3">
//                   <label>GTIN Code*</label>
//                   <input
//                     className="form-control"
//                     style={{ height: "45px" }}
//                     value={formData?.GTIN || ""}
//                     required
//                     onChange={(e) => {
//                       const value = e.target.value;
//                       if (/^\d*$/.test(value)) {
//                         setFormData({ ...formData, GTIN: value });
//                       }
//                     }}
//                   />
//                 </div>
//                 <div className="col-6 mb-3">
//                   <label>Special Appearance</label>
//                   <Select
//                     isMulti
//                     options={specialAppearanceOptions}
//                     value={specialAppearanceOptions.filter((option) =>
//                       formData?.specialAppearance?.includes(option.value)
//                     )}
//                     onChange={(selectedOptions) =>
//                       setFormData({
//                         ...formData,
//                         specialAppearance: selectedOptions.map(
//                           (option) => option.value
//                         ),
//                       })
//                     }
//                     className="basic-multi-select"
//                     classNamePrefix="select"
//                   />
//                 </div>

//                 <div className="col-12 mb-3">
//                   <label>Short Description*</label>
//                   <JoditEditor
//                     ref={editor}
//                     config={config}
//                     value={content}
//                     onChange={(newContent) => {
//                       contentRef.current = newContent;
//                     }}
//                   />
//                 </div>
//                 {loader ? (
//                   <div className="col-12">
//                     <button
//                       className="btn btn-primary w-100"
//                       style={{
//                         background: "#05E2B5",
//                         border: "none",
//                         borderRadius: "24px",
//                         opacity: "0.6",
//                       }}
//                     >
//                       Saving ...
//                     </button>
//                   </div>
//                 ) : formData?.name &&
//                   formData?.tags?.length > 0 &&
//                   formData?.hsnCode ? (
//                   <div className="col-12">
//                     <button
//                       className="btn btn-primary w-100"
//                       style={{
//                         background: "#05E2B5",
//                         border: "none",
//                         borderRadius: "24px",
//                       }}
//                       onClick={handleSubmit}
//                     >
//                       Submit
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="col-12">
//                     <button
//                       className="btn btn-primary w-100"
//                       style={{
//                         background: "#61ce70",
//                         border: "none",
//                         borderRadius: "24px",
//                       }}
//                     >
//                       Submit
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AddProduct;



import React, { useState } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createAppointmentServ } from "../../services/appointment.services"
import { useNavigate } from "react-router-dom";

function AddAppointment() {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);

  const [formData, setFormData] = useState({
    location: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    treatmentService: "",
    date: "",
    time: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    dob: "",
    history: "",
    diagnosed: false,
    gdpr: false,
    userId: ""  // optional, pass only if you want to connect to user
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Basic validation for required fields
  const isValid = () =>
    !!formData.firstName &&
    !!formData.lastName &&
    !!formData.email &&
    !!formData.phone &&
    !!formData.treatmentService &&
    !!formData.date &&
    !!formData.time &&
    !!formData.gdpr; // require GDPR checked

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      // filter out fields not required by the backend if empty (userId, etc)
      let payload = { ...formData };
      if (!payload.userId) delete payload.userId;

      const response = await createAppointmentServ(payload);
      if (response?.data?.statusCode === 200) {
        toast.success(response?.data?.message || "Appointment Created!");
        setFormData({
          location: "",
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          treatmentService: "",
          date: "",
          time: "",
          address: "",
          city: "",
          state: "",
          zip: "",
          country: "",
          dob: "",
          history: "",
          diagnosed: false,
          gdpr: false,
          userId: ""
        });
        setTimeout(() => {
          navigate("/appointments"); // redirect if you want
        }, 1200);
      } else {
        toast.error(response?.data?.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Internal Server Error"
      );
    }
    setLoader(false);
  };

  return (
    <div className="bodyContainer">
      <Sidebar selectedMenu="Appointment Management" selectedItem="Add Appointment" />
      <div className="mainContainer">
        <TopNav />
        <div className="p-lg-4 p-md-3 p-2">
          <div className="mt-3">
            <div className="card-body px-2">
              <h4
                className="p-2 text-dark shadow rounded mb-4"
                style={{ background: "#05E2B5" }}
              >
                Add Appointment
              </h4>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-6 mb-3">
                    <label>Location</label>
                    <input
                      className="form-control"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      type="text"
                    />
                  </div>
                  <div className="col-6 mb-3">
                    <label>First Name *</label>
                    <input
                      className="form-control"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      type="text"
                      required
                    />
                  </div>
                  <div className="col-6 mb-3">
                    <label>Last Name *</label>
                    <input
                      className="form-control"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      type="text"
                      required
                    />
                  </div>
                  <div className="col-6 mb-3">
                    <label>Email *</label>
                    <input
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      type="email"
                      required
                    />
                  </div>
                  <div className="col-6 mb-3">
                    <label>Phone *</label>
                    <input
                      className="form-control"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      type="tel"
                      required
                    />
                  </div>
                  <div className="col-6 mb-3">
                    <label>Treatment Service *</label>
                    <input
                      className="form-control"
                      name="treatmentService"
                      value={formData.treatmentService}
                      onChange={handleChange}
                      type="text"
                      required
                    />
                  </div>
                  <div className="col-6 mb-3">
                    <label>Date</label>
                    <input
                      className="form-control"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      type="date"
                    />
                  </div>
                  <div className="col-6 mb-3">
                    <label>Time</label>
                    <input
                      className="form-control"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      type="time"
                    />
                  </div>
                  <div className="col-12 mb-3">
                    <label>Address</label>
                    <input
                      className="form-control"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      type="text"
                    />
                  </div>
                  <div className="col-4 mb-3">
                    <label>City</label>
                    <input
                      className="form-control"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      type="text"
                    />
                  </div>
                  <div className="col-4 mb-3">
                    <label>State</label>
                    <input
                      className="form-control"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      type="text"
                    />
                  </div>
                  <div className="col-4 mb-3">
                    <label>Zip</label>
                    <input
                      className="form-control"
                      name="zip"
                      value={formData.zip}
                      onChange={handleChange}
                      type="text"
                    />
                  </div>
                  <div className="col-6 mb-3">
                    <label>Country</label>
                    <input
                      className="form-control"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      type="text"
                    />
                  </div>
                  <div className="col-6 mb-3">
                    <label>Date of Birth</label>
                    <input
                      className="form-control"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      type="date"
                    />
                  </div>
                  <div className="col-12 mb-3">
                    <label>Any Medical History</label>
                    <textarea
                      className="form-control"
                      name="history"
                      value={formData.history}
                      onChange={handleChange}
                      rows={2}
                    />
                  </div>
                  <div className="col-4 mb-3 d-flex align-items-center">
                    <input
                      type="checkbox"
                      name="diagnosed"
                      checked={formData.diagnosed}
                      onChange={handleChange}
                      id="diagnosed"
                      className="me-2"
                    />
                    <label htmlFor="diagnosed" style={{ marginBottom: "0" }}>
                      Diagnosed?
                    </label>
                  </div>
                  <div className="col-12 mb-3 d-flex align-items-center">
                    <input
                      type="checkbox"
                      name="gdpr"
                      checked={formData.gdpr}
                      onChange={handleChange}
                      id="gdpr"
                      className="me-2"
                    />
                    <label htmlFor="gdpr" style={{ marginBottom: "0" }}>
                      I consent to GDPR policy*
                    </label>
                  </div>
                  {/* Optional: userId for linking with a registered user */}
{/*                   
                  <div className="col-12 mb-3">
                    <label>User ID (optional)</label>
                    <input
                      className="form-control"
                      name="userId"
                      value={formData.userId}
                      onChange={handleChange}
                      type="text"
                    />
                  </div>
                  */}
                  <div className="col-12">
                    <button
                      className="btn btn-primary w-100"
                      style={{
                        background: "#05E2B5",
                        border: "none",
                        borderRadius: "24px",
                        opacity: loader || !isValid() ? "0.6" : "1",
                      }}
                      type="submit"
                      disabled={!isValid() || loader}
                    >
                      {loader ? "Saving ..." : "Submit"}
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

export default AddAppointment;
