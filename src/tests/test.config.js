const testDevices = [
  {
    browserName: "chrome",
    platformName: "Windows",
    platformVersion: "10",
    "bstack:options": {
      os: "Windows",
      osVersion: "10",
      buildName: "ReactJS Automation Test",
    },
  },
  {
    browserName: "chrome",
    platformName: "macOS",
    platformVersion: "Ventura",
    "bstack:options": {
      os: "OS X",
      osVersion: "Ventura",
      buildName: "ReactJS Automation Test",
    },
  },

  {
    browserName: "Chrome",
    platformName: "Android",
    platformVersion: "14.0",
    deviceName: "Google Pixel 7 Pro",
    "bstack:options": {
      os: "Android",
      osVersion: "14.0",
      deviceName: "Google Pixel 7 Pro",
      realMobile: true,
      buildName: "ReactJS Automation Test",
    },
  },

  {
    browserName: "Safari",
    platformName: "iOS",
    platformVersion: "17.0",
    deviceName: "iPhone 15 Pro",
    "bstack:options": {
      os: "iOS",
      osVersion: "17.0",
      deviceName: "iPhone 15 Pro",
      realMobile: true,
      buildName: "ReactJS Automation Test",
    },
  },
  //   {
  //     browserName: "safari",
  //     platform: "macOS Big Sur",
  //     version: "latest",
  //   },
  //   {
  //     browserName: "firefox",
  //     platform: "Windows 10",
  //     version: "latest",
  //   },
  // {
  //   deviceName: "Google Pixel 7 Pro",
  //   platformName: "Android",
  //   platformVersion: "14.0",
  //   browserName: "Chrome",
  //   "bstack:options": {
  //     os: "Android",
  //     osVersion: "14.0",
  //     deviceName: "Google Pixel 7 Pro",
  //   },
  // },
  //   {
  //     deviceName: "iPhone 13",
  //     platformName: "iOS",
  //     platformVersion: "15.0",
  //     browserName: "Safari",
  //     "bstack:options": {
  //       os: "iOS",
  //       osVersion: "15.0",
  //       deviceName: "iPhone 13",
  //     },
  //   },
  //   {
  //     deviceName: "Samsung Galaxy S21",
  //     platformName: "Android",
  //     platformVersion: "13.0",
  //     browserName: "Chrome",
  //     "bstack:options": {
  //       os: "Android",
  //       osVersion: "13.0",
  //       deviceName: "Samsung Galaxy S21",
  //     },
  //   },
  //   {
  //     deviceName: "iPhone 12",
  //     platformName: "iOS",
  //     platformVersion: "14.0",
  //     browserName: "Safari",
  //     "bstack:options": {
  //       os: "iOS",
  //       osVersion: "14.0",
  //       deviceName: "iPhone 12",
  //     },
  //   },
];

const TEST_DEVICES = [
  {
    browserName: "chrome",
    browser_version: "latest",
    os_version: "17",
    device: "iPhone 12",
    name: "iPhone 12 Chrome",
  },
  {
    browserName: "safari",
    browser_version: "latest",
    os_version: "17",
    device: "iPhone 12",
    name: "iPhone 12 Safari",
  },
  {
    browserName: "chrome",
    browser_version: "latest",
    os_version: "16",
    device: "iPhone 15",
    name: "iPhone 15 Chrome",
  },
  {
    browserName: "safari",
    browser_version: "latest",
    os_version: "16",
    device: "iPhone 15",
    name: "iPhone 15 Safari",
  },
];

const BS_CONFIG = {
  username: "testkilde_kAM46O",
  accessKey: "7GQg1WxwP6JQV2Ugv1ky",
};

module.exports = {
  TEST_DEVICES,
  BS_CONFIG,
  testDevices,
};
