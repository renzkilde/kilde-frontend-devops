module.exports = {
  server: "hub.browserstack.com",
  user: "testkilde_kAM46O",
  key: "7GQg1WxwP6JQV2Ugv1ky",

  capabilities: [
    // {
    //   browserName: "Chrome",
    //   browserVersion: "latest",
    //   "bstack:options": {
    //     deviceName: "Samsung Galaxy S23 Ultra",
    //     osVersion: "13.0",
    //     realMobile: true,
    //     userName: "testkilde_kAM46O",
    //     accessKey: "7GQg1WxwP6JQV2Ugv1ky",
    //     enableSim: true, // Enable SIM functionality
    //   },
    // },
    {
      browserName: "Chrome",
      browserVersion: "latest",
      "bstack:options": {
        os: "Windows",
        osVersion: "10",
        userName: "testkilde_kAM46O",
        accessKey: "7GQg1WxwP6JQV2Ugv1ky",
        buildName: "ReactJS Automation Test",
        sessionName: "Windows Chrome Test",
      },
    },
  ],
};
