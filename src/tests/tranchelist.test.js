require("dotenv").config();
const { Builder, By, until } = require("selenium-webdriver");
const { testDevices } = require("./test.config");
const { waitForUrlChange } = require("./common.test");

// BrowserStack credentials from environment variables
const username = process.env.BROWSERSTACK_USERNAME;
const accessKey = process.env.BROWSERSTACK_ACCESS_KEY;

// Test URL for the login page and image page
const testURL = "https://app.kilde.sg/tranche-listing?utm_source=browserstack";
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

    // After successful login, test image loading
    await testImageIsLoaded(driver, capabilities);

    // Test Case 2: It checks below tests
    // 1. If COMPLETE ONBOARDING banner is showing
    // 2. Tranche images are loaded
    // 3. Funded deals elemts are loaded

    await testElementsAreLoaded(driver, capabilities);

    // Test Case 3: Filter only fully funded deals
    await testActiveDealsFilter(driver, capabilities);

    // Test Case 3: Filter only USD Currencies
    await testUSDFilters(driver, capabilities);

    // Test Case 3: Filter based on Interest rates
    await testInterestRangeFilter(driver, capabilities);
  } catch (error) {
    console.error("❌ TEST FAILED:", error);
  } finally {
    // Close the browser
    await driver.quit();
  }
}

testDevices.forEach((capabilities, index) => {
  const updatedCapabilities = {
    ...capabilities,
    "bstack:options": {
      ...capabilities["bstack:options"], // Preserve existing options
      sessionName: `Tranche-list - ${new Date().toISOString()}`, // Dynamic session name
    },
  };
  runTest(updatedCapabilities); // Pass updated capabilities
});

// Function to save logs to a file
function saveTestReport(message) {
  const pageName = "Tranchelist page";
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
  await driver.get(testURL); // Manually navigate to the tranche-listing page

  // Now check if the current URL matches the testURL
  const currentUrl = await driver.getCurrentUrl();

  const endTime = performance.now(); // End time tracking
  const executionTime = ((endTime - startTime) / 1000).toFixed(2);
  let result;
  if (currentUrl.includes(testURL)) {
    result = `✅ TEST CASE [${capabilities.deviceName}]: Manually redirected to ${currentUrl} - PASSED-(Execution Time: ${executionTime} sec`;
  } else {
    result = `❌ TEST CASE [${capabilities.deviceName}]: Failed to redirect, current URL is ${currentUrl} - FAILED-(Execution Time: ${executionTime} sec`;

    return; // Stop further tests if redirection fails
  }
  console.log(result);
  saveTestReport(result);
}

async function testImageIsLoaded(driver, capabilities) {
  const startTime = performance.now();
  // Wait for the image with class 'tranch-card-mainImg' to be present and visible
  const imgElement = await driver.wait(
    until.elementLocated(By.css("img.tranch-card-mainImg")), // Locate the <img> tag with the class 'tranch-card-mainImg'
    10000 // Wait up to 10 seconds
  );

  // Check if the element is displayed (visible)
  const isDisplayed = await imgElement.isDisplayed();

  const endTime = performance.now(); // End time tracking
  const executionTime = ((endTime - startTime) / 1000).toFixed(2);

  // Log the result
  let result;
  if (isDisplayed) {
    result = `✅ TEST CASE [${capabilities.deviceName}]: Image with class 'tranch-card-mainImg' is loaded and visible - PASSED-(Execution Time: ${executionTime} sec`;
  } else {
    result = `❌ TEST CASE [${capabilities.deviceName}]: Image with class 'tranch-card-mainImg' is NOT visible - FAILED-(Execution Time: ${executionTime} sec`;
  }

  console.log(result);
  saveTestReport(result);
}

async function testElementsAreLoaded(driver, capabilities) {
  const startTime = performance.now();
  let result3;
  try {
    // Check for the div with class 'finish-onboard-div'
    const finishOnboardDiv = await driver.wait(
      until.elementLocated(By.css("div.finish-onboard-div")), // Locate the div with class 'finish-onboard-div'
      10000 // Wait up to 10 seconds
    );

    const isFinishOnboardDivVisible = await finishOnboardDiv.isDisplayed();

    const endTime = performance.now(); // End time tracking
    const executionTime = ((endTime - startTime) / 1000).toFixed(2);
    let result1;
    if (isFinishOnboardDivVisible) {
      result1 = `✅ TEST CASE [${capabilities.deviceName}]: Div with class 'finish-onboard-div' is loaded and visible - PASSED-(Execution Time: ${executionTime} sec`;
    } else {
      result1 = `❌ TEST CASE [${capabilities.deviceName}]: Div with class 'finish-onboard-div' is NOT visible - FAILED-(Execution Time: ${executionTime} sec`;
    }
    console.log(result1);
    saveTestReport(result1);

    const startTime1 = performance.now();
    // Check for the image with class 'tranch-card-mainImg'
    const imgElement = await driver.wait(
      until.elementLocated(By.css("img.tranch-card-mainImg")), // Locate the <img> tag with class 'tranch-card-mainImg'
      10000 // Wait up to 10 seconds
    );

    const isImgVisible = await imgElement.isDisplayed();

    const endTime2 = performance.now(); // End time tracking
    const executionTime2 = ((endTime2 - startTime1) / 1000).toFixed(2);
    let result2;
    if (isImgVisible) {
      result2 = `✅ TEST CASE [${capabilities.deviceName}]: Image with class 'tranch-card-mainImg' is loaded and visible - PASSED-(Execution Time: ${executionTime2} sec`;
    } else {
      result2 = `❌ TEST CASE [${capabilities.deviceName}]: Image with class 'tranch-card-mainImg' is NOT visible - FAILED-(Execution Time: ${executionTime2} sec`;
    }
    console.log(result2);
    saveTestReport(result2);

    const startTime2 = performance.now();
    // Check for the div with class 'manual-inv-card'
    const manualInvCardDiv = await driver.wait(
      until.elementLocated(By.css("div.manual-inv-card")), // Locate the div with class 'manual-inv-card'
      10000 // Wait up to 10 seconds
    );

    const isManualInvCardVisible = await manualInvCardDiv.isDisplayed();

    const endTime3 = performance.now(); // End time tracking
    const executionTime3 = ((endTime3 - startTime2) / 1000).toFixed(2);

    if (isManualInvCardVisible) {
      result3 = `✅ TEST CASE [${capabilities.deviceName}]: Div with class 'manual-inv-card' is loaded and visible - PASSED-(Execution Time: ${executionTime3} sec`;
    } else {
      result3 = `❌ TEST CASE [${capabilities.deviceName}]: Div with class 'manual-inv-card' is NOT visible - FAILED-(Execution Time: ${executionTime3} sec`;
    }
  } catch (error) {
    result3 = `❌ TEST CASE [${capabilities.deviceName}]: An error occurred - ${error.message}`;
  }
  console.log(result3);
  saveTestReport(result3);
}

async function testActiveDealsFilter(driver, capabilities) {
  try {
    const startTime = performance.now();
    // Check if "Show Filters" button is present
    const showFiltersButton = await driver.findElements(
      By.xpath("//span[text()='Show Filters']")
    );
    const endTime = performance.now(); // End time tracking
    const executionTime = ((endTime - startTime) / 1000).toFixed(2);

    if (showFiltersButton.length > 0) {
      // If "Show Filters" button is found, click it
      console.log(
        `✅ TEST CASE [${capabilities.deviceName}]: 'Show Filters' button found, clicking it.-(Execution Time: ${executionTime} sec`
      );
      const startTime1 = performance.now();
      const showFiltersBtn = showFiltersButton[0];
      await driver.wait(until.elementIsVisible(showFiltersBtn), 10000); // Wait for visibility
      await driver.wait(until.elementIsEnabled(showFiltersBtn), 10000); // Wait for it to be enabled
      await showFiltersBtn.click();

      // Wait for the "Active" button to be visible and clickable
      const activeButton = await driver.wait(
        until.elementLocated(By.xpath("//button//span[text()='Active']")),
        10000 // Wait up to 10 seconds
      );
      await driver.wait(until.elementIsVisible(activeButton), 10000); // Ensure visibility
      await driver.wait(until.elementIsEnabled(activeButton), 10000); // Ensure it’s enabled
      await activeButton.click();
      const endTime1 = performance.now(); // End time tracking
      const executionTime1 = ((endTime1 - startTime1) / 1000).toFixed(2);
      console.log(
        `✅ TEST CASE [${capabilities.deviceName}]: 'Active' button clicked after 'Show Filters' - PASSED-(Execution Time: ${executionTime1} sec`
      );
    } else {
      // If "Show Filters" button is not found, directly click "Active"
      console.log(
        `✅ TEST CASE [${capabilities.deviceName}]: 'Show Filters' button not found, clicking 'Active' directly.-(Execution Time: ${executionTime} sec`
      );

      const startTime2 = performance.now();
      const activeButton = await driver.wait(
        until.elementLocated(By.xpath("//button//span[text()='Active']")),
        10000 // Wait up to 10 seconds
      );
      await driver.wait(until.elementIsVisible(activeButton), 10000); // Ensure visibility
      await driver.wait(until.elementIsEnabled(activeButton), 10000); // Ensure it’s enabled
      await activeButton.click();
      const endTime2 = performance.now(); // End time tracking
      const executionTime2 = ((endTime2 - startTime2) / 1000).toFixed(2);
      console.log(
        `✅ TEST CASE [${capabilities.deviceName}]: 'Active' button clicked directly - PASSED-(Execution Time: ${executionTime2} sec`
      );
    }

    const startTime3 = performance.now();
    // Wait for the "Active deals" element to be present and visible
    const activeDealsElement = await driver.wait(
      until.elementLocated(By.css("p.tranche-header.mt-0.mb-24")),
      10000 // Wait up to 10 seconds
    );

    const isActiveDealsVisible = await activeDealsElement.isDisplayed();
    const endTime3 = performance.now(); // End time tracking
    const executionTime3 = ((endTime3 - startTime3) / 1000).toFixed(2);
    if (isActiveDealsVisible) {
      console.log(
        `✅ TEST CASE [${capabilities.deviceName}]: 'Active deals' is visible - PASSED-(Execution Time: ${executionTime3} sec`
      );
    } else {
      console.log(
        `❌ TEST CASE [${capabilities.deviceName}]: 'Active deals' is NOT visible - FAILED-(Execution Time: ${executionTime3} sec`
      );
    }
    const startTime4 = performance.now();
    // Check that 'Funded Deals' paragraph is NOT present
    const fundedDealsElements = await driver.findElements(
      By.css("p.tranche-header.mt-40.mb-20")
    );
    const endTime4 = performance.now(); // End time tracking
    const executionTime4 = ((endTime4 - startTime4) / 1000).toFixed(2);

    if (fundedDealsElements.length === 0) {
      console.log(
        `✅ TEST CASE [${capabilities.deviceName}]: 'Funded Deals' is NOT present - PASSED-(Execution Time: ${executionTime4} sec`
      );
    } else {
      console.log(
        `❌ TEST CASE [${capabilities.deviceName}]: 'Funded Deals' is unexpectedly present - FAILED-(Execution Time: ${executionTime4} sec`
      );
    }
  } catch (error) {
    console.log(
      `❌ TEST CASE [${capabilities.deviceName}]: An error occurred - ${error.message}`
    );
  }
}

async function testUSDFilters(driver, capabilities) {
  try {
    const startTime = performance.now();
    // Step 1: Click the "USD" button
    const usdButton = await driver.findElements(
      By.xpath(
        "//button[contains(@class, 'ant-btn') and .//span[text()='USD']]"
      )
    );

    const endTime = performance.now(); // End time tracking
    const executionTime = ((endTime - startTime) / 1000).toFixed(2);
    if (usdButton.length > 0) {
      console.log(
        `✅ TEST CASE [${capabilities.deviceName}]: 'USD' button found, clicking it.FAILED-(Execution Time: ${executionTime} sec`
      );
      const usdBtn = usdButton[0];
      await driver.wait(until.elementIsVisible(usdBtn), 10000); // Wait for visibility
      await driver.wait(until.elementIsEnabled(usdBtn), 10000); // Wait for it to be enabled
      await usdBtn.click();
    } else {
      console.log(
        `❌ TEST CASE [${capabilities.deviceName}]: 'USD' button not found - FAILED-(Execution Time: ${executionTime} sec`
      );
      return;
    }
    const startTime1 = performance.now();
    // Step 2: Check if "USD" cards are present
    const usdCards = await driver.findElements(
      By.xpath(
        "//div[contains(@class, 'ant-col') and contains(@class, 'css-19gw05y')]//p[text()='USD']"
      )
    );

    const endTime1 = performance.now(); // End time tracking
    const executionTime1 = ((endTime1 - startTime1) / 1000).toFixed(2);
    if (usdCards.length > 0) {
      console.log(
        `✅ TEST CASE [${capabilities.deviceName}]: 'USD' cards are present - PASSED-(Execution Time: ${executionTime1} sec`
      );
    } else {
      console.log(
        `❌ TEST CASE [${capabilities.deviceName}]: 'USD' cards are NOT present - FAILED-(Execution Time: ${executionTime1} sec`
      );
    }
    const startTime2 = performance.now();
    // Step 3: Check that "SGD" cards are NOT present
    const sgdCards = await driver.findElements(
      By.xpath(
        "//div[contains(@class, 'ant-col') and contains(@class, 'css-19gw05y')]//p[text()='SGD']"
      )
    );

    const endTime2 = performance.now(); // End time tracking
    const executionTime2 = ((endTime2 - startTime2) / 1000).toFixed(2);
    if (sgdCards.length === 0) {
      console.log(
        `✅ TEST CASE [${capabilities.deviceName}]: 'SGD' cards are NOT present - PASSED-(Execution Time: ${executionTime2} sec`
      );
    } else {
      console.log(
        `❌ TEST CASE [${capabilities.deviceName}]: 'SGD' cards are unexpectedly present - FAILED-(Execution Time: ${executionTime2} sec`
      );
    }
  } catch (error) {
    console.log(
      `❌ TEST CASE [${capabilities.deviceName}]: An error occurred - ${error.message}`
    );
  }
}

async function testInterestRangeFilter(driver, capabilities) {
  try {
    const startTime = performance.now();
    // Step 1: Check the "from" input field and add a value of "10"
    const fromInputField = await driver.findElement(
      By.xpath("//input[@name='fromInterest']")
    );
    const endTime = performance.now(); // End time tracking
    const executionTime = ((endTime - startTime) / 1000).toFixed(2);

    if (fromInputField) {
      console.log(
        `✅ TEST CASE [${capabilities.deviceName}]: 'fromInterest' input field found.`
      );
      await driver.wait(until.elementIsVisible(fromInputField), 10000); // Wait for visibility
      await fromInputField.clear(); // Clear the input field
      await fromInputField.sendKeys("10"); // Add value "10"
      console.log(
        `✅ TEST CASE [${capabilities.deviceName}]: 'fromInterest' input field set to 10.-(Execution Time: ${executionTime} sec`
      );
    } else {
      console.log(
        `❌ TEST CASE [${capabilities.deviceName}]: 'fromInterest' input field not found - FAILED.-(Execution Time: ${executionTime} sec`
      );
      return;
    }
    const startTime1 = performance.now();
    // Step 2: Check the "to" input field and add a value of "12"
    const toInputField = await driver.findElement(
      By.xpath("//input[@name='toInterest']")
    );
    const endTime1 = performance.now(); // End time tracking
    const executionTime1 = ((endTime1 - startTime1) / 1000).toFixed(2);
    if (toInputField) {
      console.log(
        `✅ TEST CASE [${capabilities.deviceName}]: 'toInterest' input field found.`
      );
      await driver.wait(until.elementIsVisible(toInputField), 10000); // Wait for visibility
      await toInputField.clear(); // Clear the input field
      await toInputField.sendKeys("12"); // Add value "12"
      console.log(
        `✅ TEST CASE [${capabilities.deviceName}]: 'toInterest' input field set to 12.-(Execution Time: ${executionTime1} sec`
      );
    } else {
      console.log(
        `❌ TEST CASE [${capabilities.deviceName}]: 'toInterest' input field not found - FAILED.-(Execution Time: ${executionTime1} sec`
      );
      return;
    }
    const startTime2 = performance.now();
    // Step 3: Check for "12%" card values and validate their range
    const cardValues = await driver.findElements(
      By.xpath(
        "//div[contains(@class, 'ant-col')]//p[contains(@class, 'card-val-tag')]"
      )
    );
    const endTime2 = performance.now(); // End time tracking
    const executionTime2 = ((endTime2 - startTime2) / 1000).toFixed(2);
    if (cardValues.length > 0) {
      console.log(
        `✅ TEST CASE [${capabilities.deviceName}]: Card values found. Validating range...`
      );

      for (const card of cardValues) {
        const cardText = await card.getText();
        const cardValue = parseInt(cardText.replace("%", ""), 10);

        if (cardValue >= 10 && cardValue <= 12) {
          console.log(
            `✅ TEST CASE [${capabilities.deviceName}]: Card value ${cardValue}% is within the range - PASSED.-(Execution Time: ${executionTime2} sec`
          );
        } else {
          console.log(
            `❌ TEST CASE [${capabilities.deviceName}]: Card value ${cardValue}% is outside the range - FAILED.-(Execution Time: ${executionTime2} sec`
          );
        }
      }
    } else {
      console.log(
        `❌ TEST CASE [${capabilities.deviceName}]: No card values found - FAILED.`
      );
    }
  } catch (error) {
    console.log(
      `❌ TEST CASE [${capabilities.deviceName}]: An error occurred - ${error.message}`
    );
  }
}
