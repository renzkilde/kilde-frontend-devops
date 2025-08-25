import { notification } from "antd";
import { showMessageWithCloseIconError } from "./Reusables";
export function ErrorResponse(errCode, errMessage) {

  if (errCode?.email === "NOT_UNIQUE") {
    return notification.error({
      type: "error",
      message: "Email already in use",
      description:
        "Email address is already in use. Please login with your registered email or use a different email address.",
    });
  } else if (errCode?.firstName === "EMPTY") {
    return notification.error({
      type: "error",
      message: "first name is empty",
      description: "Please enter firstName.",
    });
  } else if (errCode?.dateOfBirth === "EMPTY") {
    return notification.error({
      type: "error",
      message: "date of birth is empty",
      description: "Please enter date of birth.",
    });
  } else if (errCode?.taxIdentificationNumber === "EMPTY") {
    return notification.error({
      type: "error",
      message: "tax identification no. is empty",
      description: "Please enter tax identification number.",
    });
  } else if (errCode?.passportNumber === "EMPTY") {
    return notification.error({
      type: "error",
      message: "passport no. is empty",
      description: "Please enter passport number.",
    });
  }
  //  else if (errCode?.amount === "INVALID_VALUE") {
  //   return notification.error({
  //     type: "error",
  //     message: "Insufficient Balance",
  //     description:
  //       "Your wallet balance is not sufficient to complete this transaction. Please add funds to your wallet.",
  //   });
  // }
  else if (errCode?.amount === "NO_SPLIT_IN_DEBENTURE_AMOUNT") {
    return notification.error({
      type: "error",
      message: "Unable to Split Debenture Amount",
      description: "The requested debenture amount cannot be split.",
    });
  } else if (errCode?.amount === "CAPITAL_CALL_EXCEEDS_TOTAL_INVESTMENTS") {
    return notification.error({
      type: "error",
      message: "Capital request exceeds",
      description:
        "Capital call amount exceeds the total investments made by investors.",
    });
  } else if (errCode?.confirmAccountNumber === "ACCOUNT_NUMBER_NOT_EQUAL") {
    return notification.error({
      type: "error",
      message: "Account numbers do not match.",
      description:
        "New account number and confirm account number do not match. Please ensure they are identical and try again",
    });
  } else if (errCode && errCode[0] === "INVALID_TOKEN") {
    return notification.error({
      type: "error",
      message: "Something went wrong",
      description: "Try again later!",
    });
  } else if (errCode?.singaporeNricNumber === "EMPTY") {
    return notification.error({
      type: "error",
      message: "Singapore National card ID number is empty",
      description: "Please enter Singapore National card ID number.",
    });
  } else if (errCode?.email === "INVALID_VALUE") {
    return notification.error({
      type: "error",
      message: "Invalid email address",
      description: "Please enter valid Email address.",
    });
  } else if (errCode?.mobilePhone === "INVALID_VALUE") {
    return notification.error({
      type: "error",
      message: "Invalid mobile number",
      description: "Please enter a valid mobile number.",
    });
  } else if (errCode?.code === "INVALID_CODE") {
    return notification.error({
      type: "error",
      message: "Invalid OTP",
      description: "Please enter a valid OTP.",
    });
  } else if (errCode?.totp === "INVALID_CODE") {
    return notification.error({
      type: "error",
      message: "Invalid OTP",
      description: "Please enter a valid OTP.",
    });
  } else if (errCode?.mobileNumber === "INVALID_VALUE") {
    return notification.error({
      type: "error",
      message: "Invalid mobile number",
      description: "Please enter a valid mobile number.",
    });
  } else if (errCode?.signupReferralCode === "INVALID_VALUE") {
    return notification.error({
      type: "error",
      message: "Invalid Referral code",
      description: "Please enter a valid referal code.",
    });
  }
  else if (errCode?.singaporeNricNumber === "EMPTY") {
    return notification.error({
      type: "error",
      message: "singapore national card ID number is empty",
      description: "Please enter singapore national card ID (NRIC/FIN) number",
    });
  } else if (errCode?.login === "INVALID_LOGIN") {
    return notification.error({
      type: "error",
      message: "Invalid credentials",
      description: "The email or password is incorrect. Please try again!",
    });
  } else if (errCode?.login === "INVALID_GOOGLE_LOGIN") {
    return notification.error({
      type: "error",
      message: "Invalid Google login",
      description:
        "This account doesn't exist. Are you signed in to the correct Google account?",
    });
  } else if (errCode?.referralCode === "INVALID_VALUE") {
    return notification.error({
      type: "error",
      message: "Invalid Referral Code",
      description:
        "The referral code you entered is invalid. Please double-check and try again.",
    });
  } else if (errCode === "auth/email-already-in-use") {
  } else if (errCode === "auth/user-not-found") {
    return notification.error({
      type: "error",
      message: "Oops! User not found",
      description:
        "We couldn't find an account associated with this email. Please double-check your email address or create a new account.",
    });
  } else if (errCode === "auth/email-already-in-use") {
    return notification.error({
      type: "error",
      message: "Email already in use",
      description:
        "Email address is already in use. Please login with your registered email or use a different email address.",
    });
  } else if (errCode === "auth/weak-password") {
    return notification.error({
      type: "error",
      message: "Weak passsword",
      description:
        "Use at least 10 characters, including 1 uppercase, 1 lower case, 1 special character, and 1 number!",
    });
  } else if (errCode === "User already Resisted!") {
    return showMessageWithCloseIconError(
      "User already registered, please login with your registered email or use a different email"
    );
  } else if (errCode?.currentPassword === "INVALID_VALUE") {
    return showMessageWithCloseIconError(
      "Please enter a valid  current password"
    );
  } else if (errCode?.amount === "NOT_ENOUGH_FUNDS") {
    return notification.error({
      type: "error",
      message: "Insufficient Balance",
      description:
        "Your wallet balance is not sufficient to complete this transaction. Please add funds to your wallet.",
    });
  } else if (errCode?.strategyName === "NOT_UNIQUE") {
    return notification.error({
      type: "error",
      message: "Duplicate strategy name",
      description: "Please enter a unique strategy name.",
    });
  } else if (errCode === "NOT_UNIQUE") {
    return showMessageWithCloseIconError("Please enter a unique strategy name");
  } else if (errCode === "ERROR_VIDEO_FACE_NOT_FOUND") {
    return showMessageWithCloseIconError(
      "No face detected in uploaded video. Please try again."
    );
  }
  //  else if (errCode?.amount === "INVALID_VALUE") {
  //   return showMessageWithCloseIconError("Please enter a valid amount");
  // }
}
