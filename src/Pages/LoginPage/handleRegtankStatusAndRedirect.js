import { message } from "antd";
import { getSystemId, statusCheck } from "../../Apis/InvestorApi";
import { Redirection } from "./Redirection";

export const handleRegtankStatusAndRedirect = async ({
    user,
    setLoader,
    dispatch,
    navigate,
}) => {
    try {
        const systemInfo = await getSystemId();

        let regtankStatus = null;
        if (systemInfo?.systemId) {
            regtankStatus = await statusCheck({
                email: user?.email,
                systemId: systemInfo.systemId,
            });
        }

        Redirection(
            setLoader,
            user,
            regtankStatus,
            dispatch,
            navigate,
            user?.vwoFeatures?.redirectApp
        );
    } catch (err) {
        console.error("Regtank handling failed:", err);
        message.error("Something went wrong. Please try again.");
        setLoader(false);
    }
};
