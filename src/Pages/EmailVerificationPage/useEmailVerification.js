import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { emailVerification } from "../../Apis/UserApi";
import { showMessageWithCloseIcon } from "../../Utils/Reusables";

export const TIMER_DURATION = 300;

export const triggerResendEmail = async () => {
    try {
        const response = await emailVerification();
        Cookies.set("verificationToken", response?.verificationToken);
        localStorage.setItem("emailLastSentAt", Date.now().toString());
        showMessageWithCloseIcon("We have sent a verification email. Please check your inbox!");
    } catch (error) {
        console.error("Resend email failed", error);
    }
};

export const useEmailVerification = () => {
    const getInitialSeconds = () => {
        const lastSent = localStorage.getItem("emailLastSentAt");
        if (lastSent) {
            const elapsed = Math.floor((Date.now() - parseInt(lastSent, 10)) / 1000);
            const remaining = TIMER_DURATION - elapsed;
            return remaining > 0 ? remaining : 0;
        }
        return 0;
    };

    const [seconds, setSeconds] = useState(getInitialSeconds);
    const [buttonDisabled, setButtonDisabled] = useState(getInitialSeconds() > 0);
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        if (seconds > 0) {
            setButtonDisabled(true);
            const timer = setTimeout(() => setSeconds((prev) => prev - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setButtonDisabled(false);
        }
    }, [seconds]);

    const handleResendEmail = async () => {
        setLoader(true);
        await triggerResendEmail();
        setSeconds(TIMER_DURATION);
        setLoader(false);
    };

    return {
        handleResendEmail,
        loader,
        seconds,
        setSeconds,
        buttonDisabled,
        setButtonDisabled,
    };
};
