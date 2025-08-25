import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; // import if not already

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const previouslyLoggedInUser = Cookies.get("previouslyLoggedIn");

    if (previouslyLoggedInUser === "true") {
      navigate("/login", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, []);

  return null;
};

export default LandingPage;
