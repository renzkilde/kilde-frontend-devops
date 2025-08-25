export function trackVwoEvents(profile, customProp) {
  if (typeof window === "undefined" || !window.VWO) {
    return;
  }

  // Ensure VWO.event is initialized if it's not already
  window.VWO = window.VWO || [];
  window.VWO.event =
    window.VWO.event ||
    function () {
      window.VWO.push(["event"].concat([].slice.call(arguments)));
    };

  // Trigger event for manual review (based on customProp)
  if (customProp === "MANUAL_REVIEW") {
    window.VWO.event("registerV2ManualReview", {
      registerV2ManualReview: "MANUAL_REVIEW",
    });
    console.log("MANUAL_REVIEW Pushed to VWO (via VWO.event)");
  }

  // Trigger event for manual review (based on profile state)
  if (profile.verificationState === "MANUAL_REVIEW") {
    window.VWO.event("registerV2ManualReview", {
      registerV2ManualReview: "MANUAL_REVIEW",
    });
    console.log("MANUAL_REVIEW Pushed to VWO (via VWO.event)");
  }

  // Trigger event for activation
  if (profile.investorStatus === "ACTIVE") {
    window.VWO.event("registerV2Active", {
      registerV2Active: "ACTIVE",
    });
    window?.dataLayer?.push({
      event: "firstLoginAfterActivation",
      user_id: profile?.number,
      register_method: profile?.registrationType
        ? profile?.registrationType
        : localStorage.getItem("registrationType"),
    });
    console.log("ACTIVE Pushed to VWO (via VWO.event)");
  }
}

export function trackVWORegistrationSuccess(profile) {
  if (typeof window === "undefined") return;

  window.VWO = window.VWO || [];
  window.VWO.event =
    window.VWO.event ||
    function () {
      window.VWO.push(["event"].concat([].slice.call(arguments)));
    };

  const regType = profile?.registrationType?.toUpperCase();

  const eventMap = {
    EMAIL: "emailRegistrationSuccess",
    GOOGLE: "googleRegistrationSuccess",
    SINGPASS: "singpassRegistrationSuccess",
  };

  const eventName = eventMap[regType];

  if (eventName) {
    window.VWO.event(eventName, {
      registrationType: regType,
    });
    console.log(
      `[VWO] Registration event sent: ${eventName} with registrationType=${regType}`
    );
  } else {
    console.warn("[VWO] Unknown registrationType:", regType);
  }
}

export function trackRegisterMethod(profile) {
  window.VWO = window.VWO || [];
  window.VWO.event =
    window.VWO.event ||
    function () {
      window.VWO.push(["event"].concat([].slice.call(arguments)));
    };

  const registrationType = profile?.registrationType;

  window.VWO.event("registerMethod", {
    registerMethod: registrationType,
  });

  console.log("VWO Event Passed for Registration Type");
}
