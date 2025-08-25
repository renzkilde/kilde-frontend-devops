require("dotenv").config();
const { Builder, By, until } = require("selenium-webdriver");
const { testDevices } = require("./test.config");
const { waitForUrlChange } = require("./common.test");

// BrowserStack credentials from environment variables
const username = process.env.BROWSERSTACK_USERNAME;
const accessKey = process.env.BROWSERSTACK_ACCESS_KEY;

// Test URL for the login page and image page
const testURL = "https://app.kilde.sg/settings?utm_source=browserstack";
const loginURL = "https://app.kilde.sg/login?utm_source=browserstack"; // Assuming you have a separate login URL

const fs = require("fs");
const path = require("path");

async function runTest(capabilities) {
  console.log("⌛️ === AUTOMATED TEST STARTED === ⌛️");

  // Initialize the WebDriver
  const driver = await new Builder()
    .usingServer(
      `https://${username}:${accessKey}@hub-cloud.browserstack.com/wd/hub`
    )
    .withCapabilities(capabilities)
    .build();

  try {
    // Test Case 1: Perform login first
    await testValidLogin(driver, capabilities);

    await testDivIsVisible(driver, capabilities);

    await testPersonalSettingsHeader(driver, capabilities);

    await testAccountInformationFields(driver, capabilities);

    await testTwoFactorAuthenticationStatus(driver, capabilities);

    await testChangePasswordRedirection(driver, capabilities);

    await testTwoFactorAuthRedirection(driver, capabilities);

    await testAdditionalDocumentsRedirection(driver, capabilities);

    // await testViewOnboardingRedirection(driver, capabilities);
  } catch (error) {
    console.error("❌ TEST FAILED:", error);
  } finally {
    // Close the browser
    await driver.quit();
  }
}

testDevices.forEach((capabilities) => {
  runTest(capabilities);
});

// Function to save logs to a file
function saveTestReport(message) {
  const pageName = "Profile Settings page";
  const logFilePath = path.join(__dirname, "test-report.log");
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;
  const header = `\n===== ${pageName} =====\n`;

  // Check if the file exists and if the header already exists
  fs.readFile(logFilePath, "utf8", (readErr, data) => {
    if (readErr && readErr.code !== "ENOENT") {
      console.error("Failed to read log file:", readErr);
      return;
    }

    const shouldAddHeader = !data || !data.includes(header);

    const finalLogEntry = (shouldAddHeader ? header : "") + logEntry;

    fs.appendFile(logFilePath, finalLogEntry, (err) => {
      if (err) {
        console.error("Failed to write log file:", err);
      }
    });
  });
}

async function testValidLogin(driver, capabilities) {
  const startTime = performance.now();
  await driver.get(loginURL);
  await driver
    .findElement(By.name("email"))
    .sendKeys("yovel62720@myweblaw.com");
  await driver.findElement(By.name("password")).sendKeys("Test@12345");
  await driver.findElement(By.id("btn-continue-login")).click();

  // Wait for the login process to complete (this could be a page redirect)
  await waitForUrlChange(driver, 10000); // Wait up to 10 seconds for URL change

  // Manually set the URL to '/tranche-listing' after login
  await driver.get(testURL); // Manually navigate to the settings page

  // Now check if the current URL matches the testURL
  const currentUrl = await driver.getCurrentUrl();

  const endTime = performance.now(); // End time tracking
  const executionTime = ((endTime - startTime) / 1000).toFixed(2); // Convert to seconds

  if (currentUrl.includes(testURL)) {
    console.log(
      `✅ TEST CASE 1 [${capabilities.deviceName}]: Manually redirected to ${currentUrl} - PASSED-(Execution Time: ${executionTime} sec`
    );
  } else {
    console.log(
      `❌ TEST CASE 1 [${capabilities.deviceName}]: Failed to redirect, current URL is ${currentUrl} - FAILED-(Execution Time: ${executionTime} sec`
    );
    return; // Stop further tests if redirection fails
  }
}

async function testDivIsVisible(driver, capabilities) {
  const startTime = performance.now();
  try {
    const mainDiv = await driver.wait(
      until.elementLocated(By.css("dashboard-layout-div")),
      10000
    );

    const isVisible = await mainDiv.isDisplayed();
    const endTime = performance.now(); // End time tracking
    const executionTime = ((endTime - startTime) / 1000).toFixed(2); // Convert to seconds
    if (isVisible) {
      const successMessage = `✅ TEST CASE 2 [${capabilities.deviceName}]: Div with class 'p-relative' is loaded and visible - PASSED-(Execution Time: ${executionTime} sec`;
      console.log(successMessage);
      saveTestReport(successMessage);
    } else {
      const failureMessage = `❌ TEST CASE 2 [${capabilities.deviceName}]: Div with class 'p-relative' is NOT visible - FAILED-(Execution Time: ${executionTime} sec`;
      console.log(failureMessage);
      saveTestReport(failureMessage);
    }
  } catch (error) {
    const errorMessage = `❌ TEST CASE 2 [${capabilities.deviceName}]: Error encountered - ${error.message}`;
    console.log(errorMessage);
    saveTestReport(errorMessage);
  }
}

async function testPersonalSettingsHeader(driver, capabilities) {
  const startTime = performance.now();
  try {
    const header = await driver.wait(
      until.elementLocated(By.css("p.setting-head")),
      10000
    );

    const isDisplayed = await header.isDisplayed();

    const endTime = performance.now(); // End time tracking
    const executionTime = ((endTime - startTime) / 1000).toFixed(2); // Convert to seconds

    if (isDisplayed) {
      const successMessage = `✅ TEST CASE 3 [${capabilities.deviceName}]: 'Personal Settings' header is visible - PASSED-(Execution Time: ${executionTime} sec`;
      console.log(successMessage);
      saveTestReport(successMessage);
    } else {
      const failureMessage = `❌ TEST CASE 3 [${capabilities.deviceName}]: 'Personal Settings' header is NOT visible - FAILED-(Execution Time: ${executionTime} sec`;
      console.log(failureMessage);
      saveTestReport(failureMessage);
    }
  } catch (error) {
    const errorMessage = `❌ TEST CASE 3 [${capabilities.deviceName}]: Error occurred - ${error.message}`;
    console.log(errorMessage);
    saveTestReport(errorMessage);
  }
}

async function testAccountInformationFields(driver, capabilities) {
  const startTime = performance.now();
  const fields = [
    {
      name: "First Name",
      selector: "input[name='firstName']",
      value: "Sushma",
    },
    { name: "Last Name", selector: "input[name='lastName']", value: "ks" },
    {
      name: "Mobile Number",
      selector: "input[type='tel']",
      value: "+91 74287-30894",
    },
    {
      name: "Email",
      selector: "input[name='Email']",
      value: "yovel62720@myweblaw.com",
    },
  ];

  for (const field of fields) {
    try {
      const input = await driver.wait(
        until.elementLocated(By.css(field.selector)),
        10000
      );
      const inputValue = await input.getAttribute("value");

      const endTime = performance.now(); // End time tracking
      const executionTime = ((endTime - startTime) / 1000).toFixed(2); // Convert to seconds

      if (inputValue === field.value) {
        const successMessage = `✅ TEST CASE 4 [${capabilities.deviceName}]: ${field.name} is correctly set to '${field.value}' - PASSED-(Execution Time: ${executionTime} sec`;
        console.log(successMessage);
        saveTestReport(successMessage);
      } else {
        const failureMessage = `❌ TEST CASE 4 [${capabilities.deviceName}]: ${field.name} value is '${inputValue}' but expected '${field.value}' - FAILED-(Execution Time: ${executionTime} sec`;
        console.log(failureMessage);
        saveTestReport(failureMessage);
      }
    } catch (error) {
      const errorMessage = `❌ TEST CASE 4 [${capabilities.deviceName}]: Error while testing ${field.name} - ${error.message}`;
      console.log(errorMessage);
      saveTestReport(errorMessage);
    }
  }
}

async function testTwoFactorAuthenticationStatus(driver, capabilities) {
  const startTime = performance.now();
  try {
    // Wait for either the enabled or disabled 2FA status element
    const status = await Promise.race([
      driver
        .wait(until.elementLocated(By.css("p.twofa-p-enable")), 10000)
        .then((el) => el)
        .catch(() => null),
      driver
        .wait(until.elementLocated(By.css("p.twofa-p-disable")), 10000)
        .then((el) => el)
        .catch(() => null),
    ]);

    if (!status) {
      throw new Error("Neither enabled nor disabled 2FA status found.");
    }

    const text = await status.getText();
    const validMessages = [
      "Your account security is high.",
      "Your account security is not fully protected. Please enable two-factor authentication immediately to protect your investments.",
    ];

    const endTime = performance.now(); // End time tracking
    const executionTime = ((endTime - startTime) / 1000).toFixed(2); // Convert to seconds

    if (validMessages.includes(text)) {
      const successMessage = `✅ TEST CASE 5 [${capabilities.deviceName}]: 2FA status is correct - PASSED-(Execution Time: ${executionTime} sec`;
      console.log(successMessage);
      saveTestReport(successMessage);
    } else {
      const failureMessage = `❌ TEST CASE 5 [${capabilities.deviceName}]: 2FA status is incorrect - FAILED-(Execution Time: ${executionTime} sec`;
      console.log(failureMessage);
      saveTestReport(failureMessage);
    }
  } catch (error) {
    const errorMessage = `❌ TEST CASE 5 [${capabilities.deviceName}]: Error - ${error.message}`;
    console.log(errorMessage);
    saveTestReport(errorMessage);
  }
}

async function testChangePasswordRedirection(driver, capabilities) {
  const startTime = performance.now();
  try {
    // Locate and click the 'Change Password' button
    const changePasswordButton = await driver.wait(
      until.elementLocated(By.css("button.setting-btn")),
      10000
    );
    await changePasswordButton.click();

    // Wait for the URL to change
    await driver.wait(until.urlContains("/settings/change-password"), 5000);

    // Get the current URL
    const currentUrl = await driver.getCurrentUrl();

    const endTime = performance.now(); // End time tracking
    const executionTime = ((endTime - startTime) / 1000).toFixed(2); // Convert to seconds

    if (currentUrl.includes("/settings/change-password")) {
      const successMessage = `✅ TEST CASE 6 [${capabilities.deviceName}]: Change Password button redirects correctly - PASSED-(Execution Time: ${executionTime} sec`;
      console.log(successMessage);
      saveTestReport(successMessage);
    } else {
      const failureMessage = `❌ TEST CASE 6 [${capabilities.deviceName}]: Incorrect redirection. Current URL: ${currentUrl} - FAILED-(Execution Time: ${executionTime} sec`;
      console.log(failureMessage);
      saveTestReport(failureMessage);
    }

    // Navigate back using the "Personal Settings" breadcrumb
    const breadcrumbs = await driver.findElements(
      By.css("nav.ant-breadcrumb span.ant-breadcrumb-link")
    );
    for (let breadcrumb of breadcrumbs) {
      const text = await breadcrumb.getText();
      if (text.includes("Personal Settings")) {
        await breadcrumb.click();
        break;
      }
    }

    // Wait for the settings page to load
    await driver.wait(until.urlContains("/settings"), 5000);
    const backSuccessMessage = `✅ Navigated back to settings successfully.`;
    console.log(backSuccessMessage);
    saveTestReport(backSuccessMessage);
  } catch (error) {
    const errorMessage = `❌ TEST CASE 6 [${capabilities.deviceName}]: An error occurred - ${error.message}`;
    console.log(errorMessage);
    saveTestReport(errorMessage);
  }
}

async function testTwoFactorAuthRedirection(driver, capabilities) {
  const startTime = performance.now();
  try {
    // Close the popup if visible
    const closePopupButton = await driver.wait(
      until.elementLocated(By.id("jivo_close_button")),
      10000
    );

    if (closePopupButton) {
      await closePopupButton.click();
    }

    // Locate and click the 'Two-factor Authentication' button using its text
    const buttons = await driver.findElements(By.css("button.setting-btn"));
    let buttonClicked = false;

    for (let btn of buttons) {
      const text = await btn.getText();
      if (text.includes("Two-factor Authentication")) {
        const images = await btn.findElements(By.tagName("img"));
        if (images.length > 1) {
          await images[1].click();
          buttonClicked = true;
          break;
        }
      }
    }

    if (!buttonClicked) {
      throw new Error(
        "Two-factor Authentication button not found or not clickable."
      );
    }

    // Wait for the URL to change
    await driver.wait(until.urlContains("/settings/security"), 5000);

    // Get the current URL
    const currentUrl = await driver.getCurrentUrl();

    const endTime = performance.now(); // End time tracking
    const executionTime = ((endTime - startTime) / 1000).toFixed(2); // Convert to seconds

    if (currentUrl.includes("/settings/security")) {
      const successMessage = `✅ TEST CASE 7 [${capabilities.deviceName}]: Two-factor Authentication button redirects correctly - PASSED-(Execution Time: ${executionTime} sec`;
      console.log(successMessage);
      saveTestReport(successMessage);
    } else {
      const failureMessage = `❌ TEST CASE 7 [${capabilities.deviceName}]: Incorrect redirection. Current URL: ${currentUrl} - FAILED-(Execution Time: ${executionTime} sec`;
      console.log(failureMessage);
      saveTestReport(failureMessage);
    }

    // Navigate back using the "Personal Settings" breadcrumb
    const breadcrumbs = await driver.findElements(
      By.css("nav.ant-breadcrumb span.ant-breadcrumb-link")
    );
    let breadcrumbClicked = false;

    for (let breadcrumb of breadcrumbs) {
      const text = await breadcrumb.getText();
      if (text.includes("Personal Settings")) {
        await breadcrumb.click();
        breadcrumbClicked = true;
        break;
      }
    }

    if (!breadcrumbClicked) {
      throw new Error("Personal Settings breadcrumb not found.");
    }

    // Wait for the settings page to load
    await driver.wait(until.urlContains("/settings"), 5000);
    const backSuccessMessage = `✅ Navigated back to settings successfully.`;
    console.log(backSuccessMessage);
    saveTestReport(backSuccessMessage);
  } catch (error) {
    const errorMessage = `❌ TEST CASE 7 [${capabilities.deviceName}]: An error occurred - ${error.message}`;
    console.log(errorMessage);
    saveTestReport(errorMessage);
  }
}

async function testAdditionalDocumentsRedirection(driver, capabilities) {
  const startTime = performance.now();
  try {
    // Close the popup if visible
    try {
      const closePopupButton = await driver.wait(
        until.elementLocated(By.id("jivo_close_button")),
        5000
      );
      await closePopupButton.click();
    } catch (error) {
      console.log("Popup not found or already closed, proceeding...");
    }

    // Locate and click the 'Additional Documents' button
    const buttons = await driver.findElements(By.css("button.setting-btn"));
    for (let btn of buttons) {
      const text = await btn.getText();
      if (text.includes("Additional documents")) {
        const images = await btn.findElements(By.tagName("img"));
        if (images.length > 1) {
          await images[1].click();
          break;
        }
      }
    }

    // Wait for the URL to change
    await driver.wait(
      until.urlContains("/settings/additional-document"),
      10000
    );

    // Get the current URL
    const currentUrl = await driver.getCurrentUrl();

    const endTime = performance.now(); // End time tracking
    const executionTime = ((endTime - startTime) / 1000).toFixed(2); // Convert to seconds

    if (currentUrl.includes("/settings/additional-document")) {
      console.log(
        `✅ TEST CASE 8 [${capabilities.deviceName}]: Additional Documents button redirects correctly - PASSED-(Execution Time: ${executionTime} sec`
      );
    } else {
      console.log(
        `❌ TEST CASE 8 [${capabilities.deviceName}]: Incorrect redirection. Current URL: ${currentUrl} - FAILED-(Execution Time: ${executionTime} sec`
      );
    }

    // Navigate back using the "Personal Settings" breadcrumb
    const breadcrumbs = await driver.findElements(
      By.css("nav.ant-breadcrumb span.ant-breadcrumb-link")
    );
    for (let breadcrumb of breadcrumbs) {
      const text = await breadcrumb.getText();
      if (text.includes("Personal Settings")) {
        await breadcrumb.click();
        break;
      }
    }

    // Wait for the settings page to load
    await driver.wait(until.urlContains("/settings"), 5000);
    console.log(`✅ Navigated back to settings successfully.`);
  } catch (error) {
    console.log(
      `❌ TEST CASE 8 [${capabilities.deviceName}]: An error occurred - ${error.message}`
    );
  }
}

async function testViewOnboardingRedirection(driver, capabilities) {
  const startTime = performance.now();
  try {
    // Close the popup if visible
    try {
      const closePopupButton = await driver.wait(
        until.elementLocated(By.id("jivo_close_button")),
        5000
      );
      await closePopupButton.click();
      console.log("Popup closed successfully.");
    } catch (error) {
      console.log("Popup not found or already closed, proceeding...");
    }

    // Locate and click the 'View Onboarding' button
    const buttons = await driver.findElements(By.css("button.setting-btn"));
    let buttonClicked = false;

    for (let btn of buttons) {
      const text = await btn.getText();
      if (text.includes("View onboarding")) {
        const images = await btn.findElements(By.tagName("img"));
        if (images.length > 1) {
          await images[1].click();
          buttonClicked = true;
          break;
        }
      }
    }

    if (!buttonClicked) {
      throw new Error("View Onboarding button not found or not clickable.");
    }

    // Wait for the URL to change
    await driver.wait(until.urlContains("/verification/individual"), 10000);

    // Get the current URL
    const currentUrl = await driver.getCurrentUrl();

    const endTime = performance.now(); // End time tracking
    const executionTime = ((endTime - startTime) / 1000).toFixed(2); // Convert to seconds

    if (currentUrl.includes("/verification/individual")) {
      const successMessage = `✅ TEST CASE 9 [${capabilities.deviceName}]: View Onboarding button redirects correctly - PASSED-(Execution Time: ${executionTime} sec`;
      console.log(successMessage);
      saveTestReport(successMessage);
    } else {
      const failureMessage = `❌ TEST CASE 9 [${capabilities.deviceName}]: Incorrect redirection. Current URL: ${currentUrl} - FAILED-(Execution Time: ${executionTime} sec`;
      console.log(failureMessage);
      saveTestReport(failureMessage);
    }
  } catch (error) {
    const errorMessage = `❌ TEST CASE 9 [${capabilities.deviceName}]: An error occurred - ${error.message}`;
    console.log(errorMessage);
    saveTestReport(errorMessage);
  }
}
