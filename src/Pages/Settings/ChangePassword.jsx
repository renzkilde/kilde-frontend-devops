import React, { useEffect, useState } from "react";
import DashboardLayout from "../../Layouts/DashboardLayout/DashboardLayout";
import { Content } from "antd/es/layout/layout";
import { Breadcrumb, Col, Input, Progress, Row } from "antd";
import {
  showMessageWithCloseIcon,
  validatePassword,
} from "../../Utils/Reusables";
import ButtonDefault from "../../Components/ButtonDefault/ButtonDefault";
import { getPasswordStrength } from "../../Utils/Helpers";
import { changePassword } from "../../Apis/UserApi";
import ROUTES from "../../Config/Routes";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [changePass, setChangePass] = useState({
    currentPassword: "",
    newPassword: "",
    newPasswordRepeat: "",
  });
  const [noPass, setNoPass] = useState(false);
  const [isNotFilled, setIsNotFilled] = useState(false);
  const [cPassErr, setCPassErr] = useState(false);
  const strength = getPasswordStrength(changePass?.newPassword);

  useEffect(() => {
    if (
      changePass.currentPassword &&
      changePass.newPassword &&
      changePass.newPasswordRepeat
    ) {
      setIsNotFilled(false);
    } else {
      setIsNotFilled(true);
    }
  }, [changePass, isNotFilled]);

  const handlePasswordChange = () => {
    setLoader(true);
    if (
      !changePass?.newPassword ||
      !validatePassword(changePass?.newPassword)
    ) {
      setLoader(false);
      return setNoPass(true);
    } else if (changePass?.cPassword !== changePass?.password) {
      setLoader(false);
      return setCPassErr(true);
    }
    changePassword(changePass)
      .then((res) => {
        setLoader(false);
        if (!res) showMessageWithCloseIcon("Your password has been changed");
        setChangePass({
          currentPassword: "",
          newPassword: "",
          newPasswordRepeat: "",
        });
      })
      .catch((err) => {
        setLoader(false);
        console.log("err", err);
      });
  };

  return (
    <div>
      <DashboardLayout>
        <Content className="setting-page-div">
          <Breadcrumb
            separator=" / "
            items={[
              {
                title: (
                  <span
                    onClick={() => navigate(ROUTES.SETTINGS)}
                    style={{ cursor: "pointer" }}
                  >
                    Personal Settings
                  </span>
                ),
              },
              {
                title: "Change password",
              },
            ]}
          />
          <p className="setting-head">Change Password</p>

          <Row>
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={14}
              className="setting-twofa-div medium-tranch-col"
            >
              <Row>
                <Col className="mb-8" md={24} sm={24} xs={24}>
                  <div>
                    <Input.Password
                      value={changePass?.currentPassword}
                      name="password"
                      placeholder="Current password"
                      style={{ height: 40, borderRadius: "12px" }}
                      type="password"
                      onChange={({ target }) => {
                        setChangePass({
                          ...changePass,
                          currentPassword: target.value,
                        });
                        if (noPass) {
                          if (
                            validatePassword(changePass?.currentPassword) ===
                            true
                          ) {
                            setNoPass(false);
                          } else {
                            setNoPass(true);
                          }
                        }
                      }}
                      status={noPass && "error"}
                      required={true}
                    />
                  </div>
                </Col>
                <Col className="mb-8" md={24} sm={24} xs={24}>
                  <div>
                    <Input.Password
                      value={changePass?.newPassword}
                      name="password"
                      placeholder="New password"
                      style={{ height: 40, borderRadius: "12px" }}
                      type="password"
                      onChange={({ target }) => {
                        setChangePass({
                          ...changePass,
                          newPassword: target.value,
                        });
                        if (noPass) {
                          if (
                            validatePassword(changePass?.newPassword) === true
                          ) {
                            setNoPass(false);
                          } else {
                            setNoPass(true);
                          }
                        }
                      }}
                      status={noPass && "error"}
                      required={true}
                    />

                    <div style={{ marginBottom: "-10px" }}>
                      <Progress
                        percent={strength}
                        size="small"
                        showInfo={false}
                      />
                    </div>
                    <small style={{ fontSize: 11.1, color: "#999" }}>
                      <i className="bi bi-info-circle-fill"></i> Use at least 10
                      characters, including 1 uppercase, 1 lower case, 1 special
                      character, and 1 number
                    </small>
                    <div>
                      {noPass && (
                        <label
                          className="error-msg"
                          style={{
                            display: "block",
                            marginTop: "-8px",
                            marginBottom: 12,
                          }}
                        >
                          Use at least 10 characters, including 1 uppercase, 1
                          lower case, 1 special character, and 1 number
                        </label>
                      )}
                    </div>
                  </div>
                </Col>
                <Col className="mb-8" md={24} sm={24} xs={24}>
                  <div>
                    <Input.Password
                      value={changePass?.newPasswordRepeat}
                      name="repeatPassword"
                      placeholder="Repeat password"
                      type="password"
                      style={{ height: 40, borderRadius: "12px" }}
                      onChange={({ target }) => {
                        setCPassErr(false);
                        setChangePass({
                          ...changePass,
                          newPasswordRepeat: target?.value,
                        });
                        if (target?.value !== changePass?.newPassword) {
                          setCPassErr(true);
                        }
                      }}
                      status={cPassErr && "error"}
                      onBlur={() => {
                        setCPassErr(false);
                        if (
                          changePass?.newPasswordRepeat !==
                          changePass?.newPassword
                        ) {
                          setCPassErr(true);
                        }
                      }}
                      required={true}
                    />
                    {cPassErr && (
                      <label
                        className="error-msg"
                        style={{ display: "block", marginTop: "1px" }}
                      >
                        Passwords don't match!
                      </label>
                    )}
                  </div>
                </Col>
              </Row>
              <div className="mt-16">
                <ButtonDefault
                  title="Change Password"
                  onClick={handlePasswordChange}
                  loading={loader}
                  disabled={isNotFilled}
                />
              </div>
            </Col>
          </Row>
        </Content>
      </DashboardLayout>
    </div>
  );
};

export default ChangePassword;
