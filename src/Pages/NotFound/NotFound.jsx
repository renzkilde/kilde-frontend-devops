import React, { useEffect } from "react";
import DashboardLayout from "../../Layouts/DashboardLayout/DashboardLayout";

import Smily_sad from "../../Assets/Images/SVGs/SmileySad.svg";

import "./style.css";
import ROUTES from "../../Config/Routes";
import ButtonDefault from "../../Components/ButtonDefault/ButtonDefault";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../Apis/UserApi";
import { setUserDetails } from "../../Redux/Action/User";
import { useDispatch } from "react-redux";

const NotFound = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <div>
      <DashboardLayout>
        <div className="trance-listing-main-div">
          <div className="not-found-main-div">
            <img src={Smily_sad} alt="Smily_sad" />
            <h2 className="m-0">Page not found</h2>
            <p className="m-0 sb-text-align">
              Sorry, we couldn't find what you were looking for.
            </p>
            <ButtonDefault
              title="Go to Dashboard"
              onClick={() => navigate(ROUTES.DASHBOARD)}
            />
          </div>
        </div>
      </DashboardLayout>
    </div>
  );
};

export default NotFound;
