import React from "react";
import Cookies from "js-cookie";
import ROUTES from "../../Config/Routes";
import UserLogo from "../../Assets/Images/individual.svg";
import LogoutLogo from "../../Assets/Images/Icons/logout_icon.svg";
import { Button, Dropdown } from "antd";
import {
  clearAllCookiesForDomain,
  clearUserSession,
  removeFundAndRecordTag,
} from "../../Utils/Reusables";

const StepperRightHeader = () => {
  const token = Cookies.get("auth_inv_token");
  const getUser = Cookies.get("user");
  const user = getUser !== undefined ? JSON.parse(getUser) : null;

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

  const items = [
    {
      key: "1",
      label: <div className="logout-dropdown-item">{user?.email}</div>,
    },
    {
      key: "2",
      label: (
        <div className="logout-dropdown-item">User ID: {user?.number}</div>
      ),
    },
    {
      key: "1",
      label: (
        <div onClick={handleLogout} className="logout-dropdown-item">
          <img
            src={LogoutLogo}
            alt="logout_logo"
            className="small-logout-logo mr-5"
          />
          Logout
        </div>
      ),
    },
  ];

  return (
    <div>
      {token &&
        token !== "undefined" &&
        user !== undefined &&
        window.location.pathname !== ROUTES.LOGIN &&
        window.location.pathname !== ROUTES.REGISTER &&
        window.location.pathname !== ROUTES.SINGPASS_REGISTER && (
          <div>
            <div className="sb-login-div">
              <div
                className="logout-logo-div cursor-pointer"
                onClick={handleLogout}
              >
                <img src={LogoutLogo} alt="logout_logo" />
              </div>
            </div>
            <div className="sb-dropdown">
              <Dropdown
                menu={{ items }}
                placement="bottom"
                arrow={{ pointAtCenter: true }}
              >
                <Button>
                  <div className="dropdown-logo-div">
                    <img src={UserLogo} alt="user_logo" />
                  </div>
                </Button>
              </Dropdown>
            </div>
          </div>
        )}
    </div>
  );
};

export default StepperRightHeader;
