/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";

import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";

import Footer from "./Footer";
import ROUTES from "../../Config/Routes";
import { setUserDetails } from "../../Redux/Action/User";
import { getUser } from "../../Apis/UserApi";
import { LOGO_LINK } from "../../Utils/Constant";

import kilde_light_logo from "../../Assets/Images/Icons/kilde_light_logo.svg";

import "./style.css";
import {
  clearAllCookiesForDomain,
  clearUserSession,
  removeFundAndRecordTag,
} from "../../Utils/Reusables";

const BlankHeaderLayout = ({ children }) => {
  const token = Cookies.get("auth_inv_token");
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    getUserDetails();
  }, []);

  const getUserDetails = async () => {
    try {
      const response = await getUser();
      if (response) {
        setUserDetails(response, dispatch);
        return response;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  const handleLogout = async () => {
    try {
      removeFundAndRecordTag();
      clearAllCookiesForDomain(".kilde.sg");
      clearUserSession();
      Cookies.set("previouslyLoggedIn", true);

      setTimeout(() => {
        window.location.href = ROUTES.LOGIN;
      }, 100);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="p-relative">
      <div className="layout-div">
        <div className="sb-blank-header-container-kilde">
          <div className="sb-logo-logout">
            <div>
              <Link to={LOGO_LINK}>
                <img src={kilde_light_logo} alt="logo" className="sb-logo" />
              </Link>
            </div>
          </div>
          {token &&
            token !== "undefined" &&
            window.location.pathname !== ROUTES.LOGIN &&
            window.location.pathname !== ROUTES.REGISTER &&
            window.location.pathname !== ROUTES.SINGPASS_REGISTER &&
            window.location.pathname !== ROUTES.TWO_FA && (
              <div className="sb-logo-logout">
                <div style={{ color: "#fff" }}>
                  <i
                    className="cursor-pointer bi bi-person-check"
                    style={{ fontSize: 26 }}
                  ></i>
                </div>
                <div className="sb-blankheader-actions">
                  <p className="cursor-pointer m-0 fw-500">{user?.email}</p>
                  <p className="mb-0 mt-5 fw-500">
                    {`User ID:${user?.number}`}{" "}
                  </p>
                </div>
                <div style={{ color: "#fff" }}>
                  <i
                    className="cursor-pointer bi bi-box-arrow-left"
                    style={{ marginRight: 5, fontSize: 24 }}
                    onClick={handleLogout}
                  ></i>
                </div>
              </div>
            )}
        </div>
        <div>{children}</div>
      </div>
      <Footer />
    </div>
  );
};

export default BlankHeaderLayout;
