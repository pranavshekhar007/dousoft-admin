import React, { useState } from "react";
import { useGlobalState } from "../GlobalProvider";
import { useNavigate } from "react-router-dom";
function Sidebar({ selectedMenu, selectedItem }) {
  const navigate = useNavigate();
  const { globalState, setGlobalState } = useGlobalState();
  const [permissions, setPermissions] = useState(
    globalState?.user?.role?.permissions
  );
  const navItem = [
    {
      menuIcon: "https://cdn-icons-png.flaticon.com/128/1828/1828791.png",
      menu: "Dashboard",
      subMenu: [
        {
          name: "Dashboard",
          path: "/",
        },
      ],
    },
    {
      menuIcon: "https://cdn-icons-png.flaticon.com/128/1994/1994075.png",
      menu: "Apppointment Management",
      subMenu: [
        {
          name: "Apppointments",
          path: "/appointment-list",
        },
        // {
        //   name: "Add Appointment",
        //   path: "/add-appointment",
        // },
        // {
        //   name: "Bulk Order",
        //   path: "/bulk-order-list",
        // },
      ],
    },

    // {
    //   menuIcon: "https://cdn-icons-png.flaticon.com/128/2875/2875916.png",
    //   menu: "Product Management",
    //   subMenu: [
    //     {
    //       name: "Products",
    //       path: "/product-list",
    //     },
    //     {
    //       name: "Combo Packs",
    //       path: "/combo-product-list",
    //     },
        // {
        //   name: "Add Product",
        //   path: "/add-product",
        // },
    //     {
    //       name: "Add Combo Packs",
    //       path: "/add-combo-product",
    //     },
    //     {
    //       name: "Product Types",
    //       path: "/product-type-list",
    //     },
    //     {
    //       name: "Categories",
    //       path: "/category-list",
    //     },
    //     {
    //       name: "Brands",
    //       path: "/brand-list",
    //     },
    //     {
    //       name: "Tags",
    //       path: "/tag-list",
    //     },
    //     {
    //       name: "Taxes",
    //       path: "/tax-list",
    //     },
    //   ],
    // },
    {
      menuIcon: "https://cdn-icons-png.flaticon.com/128/1077/1077114.png",
      menu: "User Management",
      subMenu: [
        {
          name: "Users",
          path: "/user-list",
        },
      ],
    },
   

    {
      menuIcon: "https://cdn-icons-png.flaticon.com/128/8013/8013078.png",
      menu: "Review",
      subMenu: [
        {
          name: "Reviews",
          path: "/review",
        },
      ],
    },
    {
      menuIcon: "https://cdn-icons-png.flaticon.com/128/49/49046.png",
      menu: "Blogs & Stories",
      subMenu: [
        {
          name: "Blogs",
          path: "/blogs-list",
        },
        {
          name: "Add Blogs",
          path: "/add-blog",
        },
      ],
    },
    {
      menuIcon: "https://cdn-icons-png.flaticon.com/128/3524/3524659.png",
      menu: "Setting",
      subMenu: [
        // {
        //   name: "Profile",
        //   path: "/user-list",
        // },
        // {
        //   name: "Clinic Info",
        //   path: "/user-list",
        // },
        // {
        //   name: "Notification",
        //   path: "/user-list",
        // },
        {
          name: "Contact Query",
          path: "/contact-query",
        },
      ],
    },
    // {
    //   menuIcon: "https://cdn-icons-png.flaticon.com/128/535/535188.png",
    //   menu: "Location Management",
    //   subMenu: [
    //     // {
    //     //   name: "Pincode",
    //     //   path: "/pin-code",
    //     // },
    //     {
    //       name: "States",
    //       path: "/state-list",
    //     },
    //     {
    //       name: "City",
    //       path: "/city-list",
    //     },
    //     // {
    //     //   name: "Area",
    //     //   path: "/area",
    //     // },
    //     {
    //       name: "Bulk Upload",
    //       path: "/bulk-upload",
    //     },
    //   ],
    // },

    // {
    //   menuIcon: "https://cdn-icons-png.flaticon.com/128/1601/1601521.png",
    //   menu: "Banners",
    //   subMenu: [
    //     {
    //       name: "Banners",
    //       path: "/banner-list",
    //     },
    //   ],
    // },
    // {
    //   menuIcon: "https://cdn-icons-png.flaticon.com/128/2435/2435245.png",
    //   menu: "Subscription",
    //   subMenu: [
    //     {
    //       name: "Scheme",
    //       path: "/scheme",
    //     },
    //     // {
    //     //   name: "Chit Subscription",
    //     //   path: "/subscription",
    //     // },
    //     {
    //       name: "Chit User",
    //       path: "/subscription-user",
    //     },
    //   ],
    // },
    // {
    //   menuIcon: "https://cdn-icons-png.flaticon.com/128/2840/2840215.png",
    //   menu: "System Support",
    //   subMenu: [
    //     {
    //       name: "FAQs",
    //       path: "/faq-user-list",
    //     },
        // {
        //   name: "Contact Query",
        //   path: "/contact-query",
        // },
    //   ],
    // },
    // {
    //   menuIcon: "https://cdn-icons-png.flaticon.com/128/2312/2312402.png",
    //   menu: "Policy",
    //   subMenu: [
    //     {
    //       name: "Cookie Policy",
    //       path: "/user-cookie-policy",
    //     },
    //     {
    //       name: "Privacy Policy",
    //       path: "/user-privacy-policy",
    //     },
    //     {
    //       name: "Shipping Policy",
    //       path: "/user-shipping-policy",
    //     },
    //     {
    //       name: "Terms & Condition",
    //       path: "/user-terms-condition",
    //     },
    //     {
    //       name: "Refund and Returns",
    //       path: "/user-refund-return",
    //     },
    //   ],
    // },
  ];

  const [showMenu, setShowMenu] = useState(selectedMenu);
  return (
    <div
      className={`sidebarMain ${
        globalState?.showFullSidebar ? "sidebarVisible" : "sidebarHidden"
      }`}
    >
      <div className="d-flex justify-content-end">
        <img
          className="d-block d-md-none mt-3 me-4"
          style={{ height: "20px" }}
          src="https://cdn-icons-png.flaticon.com/128/753/753345.png"
          onClick={() =>
            setGlobalState({ ...globalState, showFullSidebar: false })
          }
        />
      </div>
      <div className="p-3">
        <div className="brandLogo d-flex justify-content-center align-items-center py-4 px-3">
          <img
            className="img-fluid"
            src="/DoctorLogo.png"
            alt="Doctor Logo"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </div>
        <hr />
        <div className="mt-3 ">
          {navItem?.map((v, i) => {
            return (
              <div className="mb-4" onClick={() => setShowMenu(v?.menu)}>
                <div
                  className="d-flex justify-content-between align-items-center mb-3 px-2 "
                  style={{ opacity: "0.7", cursor: "pointer" }}
                >
                  <div className="menuItem d-flex align-items-center">
                    <img src={v?.menuIcon} />
                    <p className="mb-0 ms-3">{v?.menu}</p>
                  </div>
                  <img
                    className="dropIcon"
                    src="https://cdn-icons-png.flaticon.com/128/6364/6364586.png"
                  />
                </div>
                {showMenu == v?.menu && (
                  <div className=" ms-4 ">
                    {v?.subMenu?.map((v, i) => {
                      return (
                        <p
                          style={{ cursor: "pointer" }}
                          onClick={() => navigate(v?.path)}
                          className={
                            "mb-0 p-2 subMenu " +
                            (v?.name == selectedItem
                              ? " rounded  textPrimary "
                              : " ")
                          }
                        >
                          <i className="fa fa-circle" /> {v?.name}
                        </p>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
