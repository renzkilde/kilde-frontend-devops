export const RedirectionToVeriff = (user) => {
  if (
    user?.registrationType === "EMAIL" ||
    user?.registrationType === "GOOGLE"
  ) {
    if (
      user?.vwoFeatures?.identityVerificationSystem?.idvSystemToUse === "veriff"
    ) {
      return true;
    } else {
      return false;
    }
  }
};
