import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../Config/Routes";

const VerifyPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const currentUrl = window.location.href;

    const urlSearchParams = new URLSearchParams(new URL(currentUrl).search);
    const mode = urlSearchParams.get("mode");
    const oobCode = urlSearchParams.get("oobCode");
    const apiKey = urlSearchParams.get("apiKey");
    if (mode === "verifyEmail") {
      navigate(ROUTES.EMAIL_VERIFIED + `?oobCode=${oobCode}`);
    } else {
      navigate(ROUTES.FORGOT_PASSWORD + `?oobCode=${oobCode}&apiKey=${apiKey}`);
    }
  }, [navigate]);
};

export default VerifyPage;
