import { Button, Progress, Tour } from "antd";
import { useEffect, useState } from "react";
import "./style.css";
import { getUser, productTourUpdate } from "../../Apis/UserApi";
import { setUserDetails } from "../../Redux/Action/User";
import { useDispatch } from "react-redux";

const ProductTour = ({ ref1, ref2, ref3, ref4, ref5, ref6 }) => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const calculatePercentage = (step) => {
    return ref1?.current ? step * 16.5 : step * 20;
  };

  useEffect(() => {
    if (ref1.current) {
      setTimeout(() => {
        setOpen(true);
      }, 400);
    }
  }, [ref1.current]);

  const handleFinish = async () => {
    try {
      await productTourUpdate();
      setOpen(false);
      await getUserDetails();
    } catch (error) {
      console.error("Error fetching data during product tour:", error);
      return null;
    }
  };

  const getUserDetails = async () => {
    try {
      const response = await getUser();
      if (response) {
        setUserDetails(response, dispatch);
        return response;
      } else {
        console.error("Error fetching user data:");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  const steps = [
    ref1?.current && {
      title: (
        <div>
          <Button className="tour-p">Step 1</Button>
          <p className="m-0">
            Complete your onboarding so you can begin investing.
          </p>
        </div>
      ),
      description: (
        <div>
          <p className="m-0 mb-24">
            Get started by finishing your account setup.
          </p>
          <Progress
            percent={calculatePercentage(1)}
            steps={ref1?.current ? 6 : 5}
            strokeColor={"#22B5E9"}
            showInfo={false}
            className="pt-progress-bar"
          />
          <Button className="skip-btn" onClick={handleFinish}>
            Skip tour
          </Button>
        </div>
      ),

      target: () => ref1?.current,
    },
    {
      title: (
        <div>
          <Button className="tour-p">Step 2</Button>
          <p className="m-0">Add banking details and funds</p>
        </div>
      ),
      description: (
        <div>
          <p className="m-0 mb-24">
            Enter your banking information and make your initial deposit.
          </p>
          <Progress
            percent={calculatePercentage(ref1?.current ? 2 : 1)}
            steps={ref1?.current ? 6 : 5}
            strokeColor={"#22B5E9"}
            showInfo={false}
            className="pt-progress-bar"
          />
        </div>
      ),
      target: () => ref2?.current,
    },
    {
      title: (
        <div>
          <Button className="tour-p">Step 3</Button>
          <p className="m-0">Explore investment options</p>
        </div>
      ),
      description: (
        <div>
          <p className="m-0 mb-24">
            Browse available deals and start building your investment strategy.
          </p>
          <Progress
            percent={calculatePercentage(ref1?.current ? 3 : 2)}
            steps={ref1?.current ? 6 : 5}
            strokeColor={"#22B5E9"}
            showInfo={false}
            className="pt-progress-bar"
          />
        </div>
      ),
      target: () => ref3?.current,
    },
    {
      title: (
        <div>
          <Button className="tour-p">Step 4</Button>
          <p className="m-0">Analyse your portfolio</p>
        </div>
      ),
      description: (
        <div>
          <p className="m-0 mb-24">
            Check your investment performance and portfolio summary on the
            dashboard.
          </p>
          <Progress
            percent={calculatePercentage(ref1?.current ? 4 : 3)}
            steps={ref1?.current ? 6 : 5}
            strokeColor={"#22B5E9"}
            showInfo={false}
            className="pt-progress-bar"
          />
        </div>
      ),

      target: () => ref4?.current,
    },
    {
      title: (
        <div>
          <Button className="tour-p">Step 5</Button>
          <p className="m-0">Review account statements</p>
        </div>
      ),
      description: (
        <div>
          <p className="m-0 mb-24">
            Access and download reports of your investment account activity.
          </p>
          <Progress
            percent={calculatePercentage(ref1?.current ? 5 : 4)}
            steps={ref1?.current ? 6 : 5}
            strokeColor={"#22B5E9"}
            showInfo={false}
            className="pt-progress-bar"
          />
        </div>
      ),

      target: () => ref5?.current,
    },
    {
      title: (
        <div>
          <Button className="tour-p">Step 6</Button>
          <p className="m-0">Enable two-factor authentication</p>
        </div>
      ),
      description: (
        <div>
          <p className="m-0 mb-24">
            Secure your account with two-factor authentication.
          </p>
          <Progress
            percent={calculatePercentage(ref1?.current ? 6 : 5)}
            steps={ref1?.current ? 6 : 5}
            strokeColor={"#22B5E9"}
            showInfo={false}
            className="pt-progress-bar"
          />
        </div>
      ),

      target: () => ref6?.current,
    },
  ].filter(Boolean);

  return (
    <div>
      <Tour
        open={open}
        onClose={handleFinish}
        steps={steps}
        onFinish={handleFinish}
      />
    </div>
  );
};

export default ProductTour;