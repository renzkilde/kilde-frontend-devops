import { useState, useEffect } from "react";
import { twoFaInit } from "../../Apis/UserApi";
import { showMessageWithCloseIcon, showMessageWithCloseIconError } from "../../Utils/Reusables";

export const TIMER_DURATION = 60;

export const triggerResendInit = async () => {
    try {
        const res = await twoFaInit();
        if (!res || !res.type) {
            showMessageWithCloseIconError("Something went wrong, Try again!");
            return null;
        }
        localStorage.setItem("initLastSentAt", Date.now().toString());
        if (res.type === "TOTP") {
            showMessageWithCloseIcon(
                "Please check your authentication app for the current one-time password."
            );
        } else {
            showMessageWithCloseIcon(
                "We've sent an OTP to your mobile number. Please check your messages."
            );
        }
        return res;
    } catch (err) {
        console.error("2FA API error:", err);
        showMessageWithCloseIconError("Failed to resend OTP. Please try again.");
        return null;
    }
};

export const useInitVerification = () => {
    const getInitialSeconds = () => {
        const lastSent = localStorage.getItem("initLastSentAt");
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

    const handleResendInit = async () => {
        setLoader(true);
        await triggerResendInit();
        setSeconds(TIMER_DURATION);
        setLoader(false);
    };

    return {
        handleResendInit,
        loader,
        setLoader,
        seconds,
        setSeconds,
        buttonDisabled,
        setButtonDisabled,
    };
};



