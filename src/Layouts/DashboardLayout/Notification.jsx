import React, { useEffect, useMemo, useRef, useState } from "react";
import Notification_Icon from "../../Assets/Images/SVGs/notification.svg";
import notification_check from "../../Assets/Images/SVGs/notification_check.svg";
import notification_icon from "../../Assets/Images/SVGs/notification_icon.svg";
import { Badge, Button, Spin } from "antd";
import {
  getNotification,
  markReadAllNotification,
  markReadSingleNotification,
} from "../../Apis/NotificationApi";
import { LoadingOutlined } from "@ant-design/icons";
import {
  notificationMessageCorrection,
  Timestamp,
} from "../../Utils/Reusables";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../Config/Routes";
import { debounce } from "lodash";

const Notification = () => {
  const navigate = useNavigate();
  const [notificationList, setNotificationList] = useState([]);
  const [notificationLoader, setNotificationLoader] = useState(false);
  const [openNotificationDiv, setOpenNotificationDiv] = useState(false);
  const notificationRef = useRef(null);

  const seenNotifications =
    notificationList?.length > 0
      ? notificationList?.filter((notification) => notification.seen === true)
      : [];

  const unseenNotifications =
    notificationList?.length > 0
      ? notificationList?.filter(
          (notification) =>
            notification.seen === false &&
            notification.notificationType !== "COUPON_REINVEST"
        )
      : [];

  const couponReinvestments =
    notificationList?.length > 0
      ? notificationList?.filter(
          (notification) =>
            notification.notificationType === "COUPON_REINVEST" &&
            notification.seen === false
        )
      : [];

  useEffect(() => {
    const debouncedHandleGetNotification = debounce(handleGetNotification);
    debouncedHandleGetNotification();
    const intervalId = setInterval(() => {
      debouncedHandleGetNotification();
    }, 25000);
    return () => {
      clearInterval(intervalId);
      debouncedHandleGetNotification.cancel();
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setOpenNotificationDiv(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleGetNotification = async () => {
    try {
      const response = await getNotification();
      if (JSON.stringify(response) !== JSON.stringify(notificationList)) {
        setNotificationList(response);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleMarkReadNotification = async () => {
    try {
      const response = await markReadAllNotification();
      if (!response) {
        handleGetNotification();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleMarkReadSingleNotification = async (notification) => {
    if (notification?.seen === false) {
      try {
        const response = await markReadSingleNotification(
          notification?.notificationId
        );

        if (!response) {
          handleGetNotification();
        }
      } catch (error) {
        console.log(error);
      }
    }
    if (
      notification?.nagivateTo?.page === "tranche-listing" ||
      notification?.nagivateTo?.page === "tranche-listing page"
    ) {
      navigate(ROUTES.TRANCH_LISTING);
    } else if (notification?.nagivateTo.page === "tranche page") {
      navigate(`${ROUTES.TRANCH_INVEST}/${notification?.nagivateTo.uuid}`);
    } else if (
      notification?.nagivateTo.page === "tranche page" &&
      notification?.notificationType === "INVESTOR_CAPITAL_CALL_REQUEST"
    ) {
      navigate(`${ROUTES.TRANCH_INVEST}/${notification?.nagivateTo.uuid}`, {
        state: { scrollState: "true" },
      });
    } else if (
      notification?.nagivateTo.page === "wallet page" &&
      notification?.notificationType === "INVESTOR_BANK_DETAILS_ADDED"
    ) {
      navigate(ROUTES.WALLET);
    } else if (
      notification?.nagivateTo?.page === "wallet page" &&
      (notification?.notificationType === "INVESTOR_WITHDRAWAL_REQUEST" ||
        notification?.notificationType === "WITHDRAWAL_ALLOCATED")
    ) {
      localStorage.setItem("activeTabKey", "2");
      navigate(ROUTES.WALLET, { state: { tabKey: "2" } });
    } else if (
      notification?.nagivateTo?.page === "wallet page" &&
      (notification?.notificationType ===
        "INVESTOR_CURRENCY_EXCHANGE_REQUEST" ||
        notification?.notificationType === "CURRENCY_EXCHANGE_ALLOCATED")
    ) {
      localStorage.setItem("activeTabKey", "3");
      navigate(ROUTES.WALLET, { state: { tabKey: "3" } });
    }
  };

  const seenNotificationsItems = seenNotifications
    .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
    .map((notification, index) => ({
      label: (
        <div
          className="notification-div cursor-pointer"
          key={notification.notificationId}
          onClick={() => handleMarkReadSingleNotification(notification)}
        >
          <div>
            <Badge dot={!notification.seen} offset={[-6, 2]}>
              <img src={notification_icon} alt="notification_icon" />
            </Badge>
          </div>
          <div>
            <p className="notification-title">
              {notificationMessageCorrection(notification.notificationMessage)}
            </p>
            <p className="notification-time-title">
              {Timestamp(notification.createdDate)}
            </p>
          </div>
        </div>
      ),
      key: `${index}seen`,
    }));

  const handleCouponReinvest = (navigateData) => {
    if (navigateData?.page === "tranche page") {
      navigate(`${ROUTES.TRANCH_INVEST}/${navigateData?.uuid}`, {
        state: { amount: navigateData?.amount },
      });
    }
  };

  const couponReinvestmentNotifications = couponReinvestments?.map(
    (notification, index) => ({
      label: (
        <div
          className={`notification-div cursor-pointer coupon-notification ${
            index === 0 ? "coupon-notification-first" : ""
          }`}
          key={notification?.notificationId}
          onClick={() => handleMarkReadSingleNotification(notification)}
        >
          <div>
            <p className="coupon-notification-message">
              {notification?.notificationMessage}
            </p>
            <Button
              className="coupon-button"
              onClick={() => {
                handleCouponReinvest(notification?.nagivateTo);
              }}
              id="btn-coupon-reinvest"
            >
              Reinvest Coupon
            </Button>
          </div>
        </div>
      ),
      key: index + "coupon-notification",
    })
  );

  const unseenNotificationsItems = unseenNotifications
    .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
    .map((notification, index) => ({
      label: (
        <div
          className="notification-div cursor-pointer"
          key={notification.notificationId}
          onClick={() => handleMarkReadSingleNotification(notification)}
        >
          <div className="badge-unseen-notification">
            <Badge dot={!notification.seen} offset={[-3, 2]}>
              <img src={notification_icon} alt="notification_icon" />
            </Badge>
          </div>
          <div>
            <p className="notification-title">
              {notificationMessageCorrection(notification.notificationMessage)}
            </p>
            <p className="notification-time-title">
              {Timestamp(notification.createdDate)}
            </p>
          </div>
        </div>
      ),
      key: index + "unseen",
    }));

  const items = useMemo(
    () => [
      ...(couponReinvestments?.length > 0
        ? couponReinvestmentNotifications
        : []),

      {
        label: (
          <div className="sb-justify-center-item-center mb-16">
            <div>
              <p className="notification-head-new">New</p>
            </div>
            {unseenNotifications.length > 0 && (
              <div
                className="read-head-notification cursor-pointer"
                onClick={handleMarkReadNotification}
                style={{ display: "flex" }}
              >
                <img src={notification_check} alt="notification_check" />
                <p>Mark all as read</p>
              </div>
            )}
          </div>
        ),
        key: "mark-read-all",
      },

      ...(unseenNotifications.length > 0
        ? unseenNotificationsItems
        : [
            {
              label: (
                <p className="notification-head-new mt-16 mb-16">
                  You don't have any unseen notifications
                </p>
              ),
              key: "no-new",
            },
          ]),

      {
        label: (
          <div className="sb-justify-center-item-center">
            <div>
              <p className="notification-head-new mb-10">Read</p>
            </div>
          </div>
        ),
        key: "old-notifications",
      },

      ...(seenNotifications.length > 0
        ? seenNotificationsItems
        : [
            {
              label: (
                <p className="notification-head-new m-0">
                  You don't have any seen notifications
                </p>
              ),
              key: "no-old",
            },
          ]),
    ],
    [
      couponReinvestments,
      couponReinvestmentNotifications,
      unseenNotifications,
      unseenNotificationsItems,
      seenNotifications,
      seenNotificationsItems,
    ]
  );

  return (
    <Badge
      dot={unseenNotificationsItems?.length === 0 ? false : true}
      offset={[-11, 7]}
      className="badge-notification"
    >
      <div className="notification-wrapper" ref={notificationRef}>
        <div
          className="notification-icon cursor-pointer"
          onClick={() => setOpenNotificationDiv(!openNotificationDiv)}
        >
          <img src={Notification_Icon} alt="Notification Icon" />
        </div>
        {openNotificationDiv ? (
          <div className="notification-menu-container">
            <div className="dropdown-header">
              <p className="p-0 kl-pi-subdivtitle">Notifications</p>{" "}
            </div>
            {notificationLoader ? (
              <Spin
                indicator={
                  <LoadingOutlined style={{ fontSize: 24, color: "#1890ff" }} />
                }
              />
            ) : notificationList.length > 0 ? (
              <div className="notification-content">
                <div className="notification-list">
                  {items.map(({ label, key }) => (
                    <div key={key} className="notification-item">
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="no-notifications-message">
                You don't have any notifications
              </p>
            )}
          </div>
        ) : null}
      </div>
    </Badge>
  );
};

export default Notification;
