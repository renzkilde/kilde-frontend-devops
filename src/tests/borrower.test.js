require("dotenv").config();
const { Builder, By, until } = require("selenium-webdriver");
const { testDevices } = require("./test.config");
const { waitForUrlChange } = require("./common.test");

// BrowserStack credentials from environment variables
const username = process.env.BROWSERSTACK_USERNAME;
const accessKey = process.env.BROWSERSTACK_ACCESS_KEY;

const fs = require("fs");
const path = require("path");

// Test URL for the login page and borrower page
const testURL =
  "https://app.kilde.sg/tranche-invest/91cd8102-a3d2-43e3-a9bf-4bf69be63888?utm_source=browserstack";
const loginURL = "https://app.kilde.sg/login?utm_source=browserstack";

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

    // // Test Case 2
    await testImagesLoaded(driver, capabilities);

    // Test Case 3
    await testCompanyLogoImageLoaded(driver, capabilities);

    // Test Case 4
    await testNavigationdivIsLoaded(driver, capabilities);

    // Test Case 5
    await testMaindivIsLoaded(driver, capabilities);

    // Test Case 6
    await testCountryFlagsDisplay(driver, capabilities);

    // Test Case 7
    await testReadMoreLessButton(driver, capabilities);

    // Test Case 8
    await testBusinessDescriptionIsVisible(driver, capabilities);

    // Test Case 9
    await testViewIcon(driver, capabilities);
  } catch (error) {
    console.error("❌ TEST FAILED:", error);
  } finally {
    // Close the browser
    await driver.quit();
  }
}

testDevices.forEach((capabilities) => {
  const updatedCapabilities = {
    ...capabilities,
    "bstack:options": {
      ...capabilities["bstack:options"], // Preserve existing options
      sessionName: `Borrower page - ${new Date().toISOString()}`, // Dynamic session name
    },
  };

  runTest(updatedCapabilities);
});

// Function to save logs to a file
function saveTestReport(message) {
  const pageName = "Borrower page";
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

// Helper function to scroll to an element
async function scrollToElement(driver, element) {
  await driver.executeScript(
    "arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });",
    element
  );
}

async function testValidLogin(driver, capabilities) {
  const startTime = performance.now(); // Start time tracking

  await driver.get(loginURL);
  await driver
    .findElement(By.name("email"))
    .sendKeys("yovel62720@myweblaw.com");
  await driver.findElement(By.name("password")).sendKeys(process.env.PASSWORD);
  await driver.findElement(By.id("btn-continue-login")).click();

  // Wait for the login process to complete
  await waitForUrlChange(driver, 10000);

  await driver.get(testURL); // Navigate to the tranche-listing page

  // Check if the redirection was successful
  const currentUrl = await driver.getCurrentUrl();
  const endTime = performance.now(); // End time tracking

  const executionTime = ((endTime - startTime) / 1000).toFixed(2); // Convert to seconds

  let result;
  if (currentUrl.includes(testURL)) {
    result = `✅ TEST CASE 1 [${capabilities.deviceName}]: Manually redirected to ${currentUrl} - PASSED (Execution Time: ${executionTime} sec)`;
  } else {
    result = `❌ TEST CASE 1 [${capabilities.deviceName}]: Failed to redirect, current URL is ${currentUrl} - FAILED (Execution Time: ${executionTime} sec)`;

    return; // Stop further tests if redirection fails
  }

  console.log(result);
  saveTestReport(result);
}

async function testImagesLoaded(driver, capabilities) {
  try {
    const startTime = performance.now();
    // Wait for the carousel container to load
    const carouselContainer = await driver.wait(
      until.elementLocated(By.css(".owl-carousel")),
      20000 // Wait up to 10 seconds
    );

    // Locate all image elements inside the carousel
    const images = await carouselContainer.findElements(
      By.css("img#borrower-img")
    );

    // Ensure images exist
    if (images.length === 0) {
      console.log(
        `❌ TEST CASE [${capabilities.deviceName}]: No images found in the carousel - FAILED`
      );
      return;
    }

    // Loop through each image and check if it's loaded
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const src = await image.getAttribute("src");

      // Check if the 'src' attribute is present
      if (!src || src.trim() === "") {
        console.log(
          `❌ TEST CASE 2 [${capabilities.deviceName}]: Image ${
            i + 1
          } is missing src - FAILED`
        );
        continue;
      }

      // Verify the image is visible
      const isDisplayed = await image.isDisplayed();

      const endTime = performance.now(); // End time tracking

      const executionTime = ((endTime - startTime) / 1000).toFixed(2); // Convert to seconds

      let result;
      if (!isDisplayed) {
        result = `❌ TEST CASE 2 [${capabilities.deviceName}]: Image ${
          i + 1
        } is not visible - FAILED -(Execution Time: ${executionTime} sec)`;

        continue;
      } else {
        result = `✅ TEST CASE 2[${capabilities.deviceName}]: Image ${
          i + 1
        } is loaded and visible - PASSED- (Execution Time: ${executionTime} sec)`;
      }
      console.log(result);
      saveTestReport(result);
    }
  } catch (error) {
    console.log(
      `❌ TEST CASE [${capabilities.deviceName}]: An error occurred - ${error.message}`
    );
  }
}

async function testCompanyLogoImageLoaded(driver, capabilities) {
  try {
    const startTime = performance.now();
    // Wait for the image container to load
    const imageContainer = await driver.wait(
      until.elementLocated(By.css(".company-logo-div")),
      10000 // Wait up to 10 seconds
    );

    // Locate the image element inside the container
    const image = await imageContainer.findElement(By.css("img"));

    // Check if the 'src' attribute is present and valid
    const src = await image.getAttribute("src");
    if (!src || src.trim() === "") {
      console.log(
        `❌ TEST CASE 3[${capabilities.deviceName}]: Image src is missing or empty - FAILED`
      );
      return;
    }

    // Check if the image is visible
    const isDisplayed = await image.isDisplayed();

    const endTime = performance.now(); // End time tracking
    const executionTime = ((endTime - startTime) / 1000).toFixed(2); // Convert to seconds

    let result;
    if (!isDisplayed) {
      result = `❌ TEST CASE 3 [${capabilities.deviceName}]: Image is not visible - FAILED-(Execution Time: ${executionTime} sec)`;

      return;
    }

    result = `✅ TEST CASE 3 [${capabilities.deviceName}]: Image is loaded and visible - PASSED- (Execution Time: ${executionTime} sec)`;

    console.log(result);
    saveTestReport(result);
  } catch (error) {
    console.log(
      `❌ TEST CASE 3 [${capabilities.deviceName}]: An error occurred - ${error.message}`
    );
  }
}

async function testMaindivIsLoaded(driver, capabilities) {
  try {
    const startTime = performance.now();
    // Check for the div with class 'finish-onboard-div'
    const informationDiv = await driver.wait(
      until.elementLocated(By.css("div.infomation-div")), // Locate the div with class 'finish-onboard-div'
      10000 // Wait up to 10 seconds
    );

    const isFinishOnboardDivVisible = await informationDiv.isDisplayed();

    const endTime = performance.now(); // End time tracking
    const executionTime = ((endTime - startTime) / 1000).toFixed(2); // Convert to seconds

    let result;
    if (isFinishOnboardDivVisible) {
      result = `✅ TEST CASE 4 [${capabilities.deviceName}]: Div with class 'infomation-div' is loaded and visible - PASSED- (Execution Time: ${executionTime} sec)`;
    } else {
      result = `❌ TEST CASE 4 [${capabilities.deviceName}]: Div with class 'infomation-div' is NOT visible - FAILED-(Execution Time: ${executionTime} sec)`;
    }
    console.log(result);
    saveTestReport(result);
  } catch (error) {
    console.log(
      `❌ TEST CASE 4 [${capabilities.deviceName}]: An error occurred - ${error.message}`
    );
  }
}

async function testNavigationdivIsLoaded(driver, capabilities) {
  try {
    const startTime = performance.now(); // Start time tracking

    // Set viewport for larger screen size (default)
    await driver.manage().window().setRect({ width: 1200, height: 800 });

    // Wait for and check visibility of 'borrower-navigation-div'
    try {
      const navigationDiv = await driver.wait(
        until.elementLocated(By.css(".borrower-navigation-div")), // Adjusted CSS selector
        5000 // Wait up to 5 seconds
      );
      const isNavigationDivVisible = await navigationDiv.isDisplayed();

      let result;
      if (isNavigationDivVisible) {
        result = `✅ TEST CASE 5 [${capabilities.deviceName}]: 'borrower-navigation-div' is visible on larger screens - PASSED`;
      } else {
        result = `❌ TEST CASE 5 [${capabilities.deviceName}]: 'borrower-navigation-div' is NOT visible on larger screens - FAILED`;
      }
      console.log(result);
      saveTestReport(result);
    } catch {
      console.log(
        `❌ TEST CASE 5 [${capabilities.deviceName}]: 'borrower-navigation-div' not found on larger screens - FAILED`
      );
    }

    // Set viewport for smaller screen size
    await driver.manage().window().setRect({ width: 768, height: 800 });

    // Wait for and check visibility of 'fixed-component'
    try {
      const fixedComponent = await driver.wait(
        until.elementLocated(By.css(".fixed-component")), // Adjusted CSS selector
        5000 // Wait up to 5 seconds
      );
      const isFixedComponentVisible = await fixedComponent.isDisplayed();
      let result;
      if (isFixedComponentVisible) {
        result = `✅ TEST CASE 6 [${capabilities.deviceName}]: 'fixed-component' is visible on smaller screens - PASSED`;
      } else {
        result = `❌ TEST CASE 6 [${capabilities.deviceName}]: 'fixed-component' is NOT visible on smaller screens - FAILED`;
      }
      console.log(result);
      saveTestReport(result);
    } catch {
      console.log(
        `❌ TEST CASE 6 [${capabilities.deviceName}]: 'fixed-component' not found on smaller screens - FAILED`
      );
    }

    const endTime = performance.now(); // End time tracking
    const executionTime = ((endTime - startTime) / 1000).toFixed(2); // Convert to seconds

    console.log(
      `🕒 Total Execution Time for Test Cases 5 & 6 [${capabilities.deviceName}]: ${executionTime} sec`
    );
    saveTestReport(
      `🕒 Total Execution Time for Test Cases 5 & 6 [${capabilities.deviceName}]: ${executionTime} sec`
    );
  } catch (error) {
    console.log(
      `❌ TEST CASE 6 [${capabilities.deviceName}]: An error occurred - ${error.message}`
    );
  }
}

async function testViewIcon(driver, capabilities) {
  try {
    const startTime = performance.now();
    // Wait for the clickable div to be available
    await driver.wait(
      until.elementLocated(By.css(".borrower-pdf-div .cursor-pointer")),
      20000 // Wait up to 20 seconds
    );

    // Locate the clickable div
    const viewIconDiv = await driver.findElement(
      By.css(".borrower-pdf-div .cursor-pointer")
    );

    // Scroll to the element
    await scrollToElement(driver, viewIconDiv);

    // Verify if the view icon is displayed
    const isDisplayed = await viewIconDiv.isDisplayed();
    let result;
    if (isDisplayed) {
      result = "✅ Clickable div for view icon is visible - PASSED";

      // Perform the click using JavaScript to bypass interception
      await driver.executeScript("arguments[0].click();", viewIconDiv);

      result = ` ✅ Test case 7  [${capabilities.deviceName}] View icon clicked successfully - PASSED `;
      console.log(result);
      saveTestReport(result);
    } else {
      console.log(
        ` ❌ Test case 7  [${capabilities.deviceName}] View icon is not visible - FAILED `
      );
      return;
    }

    // Wait for the new tab to open and switch to it
    await driver.wait(
      async () => (await driver.getAllWindowHandles()).length > 1,
      10000
    );
    const tabs = await driver.getAllWindowHandles();
    await driver.switchTo().window(tabs[1]);

    // Verify the URL of the newly opened tab
    const currentURL = await driver.getCurrentUrl();

    const endTime = performance.now(); // End time tracking
    const executionTime = ((endTime - startTime) / 1000).toFixed(2); // Convert to seconds

    // Check if the URL contains '.pdf'
    if (currentURL.includes(".pdf")) {
      console.log(
        `✅ TEST CASE 8 [${capabilities.deviceName}]: PDF file opened - PASSED-(Execution Time: ${executionTime} sec)`
      );
    } else {
      console.log(
        `❌ TEST CASE 8 [${capabilities.deviceName}]: PDF file did not open - FAILED-(Execution Time: ${executionTime} sec)`
      );
    }
  } catch (error) {
    console.error(`❌ An error occurred during the test: ${error.message}`);
  }
}

async function testBusinessDescriptionIsVisible(driver, capabilities) {
  try {
    const startTime = performance.now();
    // Check for the paragraph inside '.business-dec-borrower'
    const businessDesc = await driver.wait(
      until.elementLocated(By.css(".business-dec-borrower p")),
      10000
    );

    const descText = await businessDesc.getText();

    const endTime = performance.now(); // End time tracking
    const executionTime = ((endTime - startTime) / 1000).toFixed(2); // Convert to seconds

    let result;
    if (descText) {
      result = `✅ TEST CASE 9 [${capabilities.deviceName}]: Business Description is visible and not empty - PASSED-(Execution Time: ${executionTime} sec)`;
    } else {
      result = `❌ TEST CASE 9 [${capabilities.deviceName}]: Business Description is empty - FAILED-(Execution Time: ${executionTime} sec)`;
    }
    console.log(result);
    saveTestReport(result);
  } catch (error) {
    console.log(
      `❌ TEST CASE 9 [${capabilities.deviceName}]: An error occurred - ${error.message}`
    );
  }
}

async function testReadMoreLessButton(driver, capabilities) {
  try {
    const startTime = performance.now();
    // Locate the 'Read More' button
    const readMoreButton = await driver.wait(
      until.elementLocated(By.css(".read-more-btn")),
      10000
    );

    // Scroll to the 'Read More' button
    await scrollToElement(driver, readMoreButton);

    // Wait for the button to be clickable and click it to expand the content
    await driver.wait(until.elementIsVisible(readMoreButton), 5000);
    await driver.wait(until.elementIsEnabled(readMoreButton), 5000);
    await readMoreButton.click();

    // Wait for the expanded content to appear (check for more than 150 characters)
    const expandedContent = await driver.wait(
      until.elementLocated(By.css(".business-dec-borrower p")),
      5000
    );
    const expandedText = await expandedContent.getText();

    const endTime = performance.now(); // End time tracking
    const executionTime = ((endTime - startTime) / 1000).toFixed(2); // Convert to seconds

    let result1;
    if (expandedText.length > 200) {
      result1 = `✅ TEST CASE 9 [${capabilities.deviceName}]: 'Read More' expanded content beyond 150 characters - PASSED-(Execution Time: ${executionTime} sec)`;
    } else {
      result1 = `❌ TEST CASE 9 [${capabilities.deviceName}]: 'Read More' did not expand content correctly - FAILED-(Execution Time: ${executionTime} sec)`;
    }
    console.log(result1);
    saveTestReport(result1);

    // Now, click 'Read Less' to collapse the content back
    const readLessButton = await driver.wait(
      until.elementLocated(By.css(".read-more-btn")),
      5000
    );
    await readLessButton.click();

    // Verify the content is collapsed (check that text is within 150 characters again)
    const collapsedContent = await driver.wait(
      until.elementLocated(By.css(".business-dec-borrower p")),
      5000
    );
    const collapsedText = await collapsedContent.getText();

    endTime = performance.now(); // End time tracking
    executionTime = ((endTime - startTime) / 1000).toFixed(2); // Convert to seconds

    let result2;
    if (collapsedText.length <= 500) {
      result2 = `✅ TEST CASE 9 [${capabilities.deviceName}]: 'Read Less' collapsed content back to original size - PASSED-(Execution Time: ${executionTime} sec)`;
    } else {
      result2 = `❌ TEST CASE 9 [${capabilities.deviceName}]: 'Read Less' did not collapse content correctly - FAILED-(Execution Time: ${executionTime} sec)`;
    }
    console.log(result2);
    saveTestReport(result2);
  } catch (error) {
    console.log(
      `❌ TEST CASE 9 [${capabilities.deviceName}]: An error occurred - ${error.message}`
    );
  }
}

async function testCountryFlagsDisplay(driver, capabilities) {
  try {
    const startTime = performance.now();
    // Locate all the <span> elements with the flag classes
    const flagSpans = await driver.wait(
      until.elementsLocated(By.css(".country-flag span")),
      10000
    );

    let allFlagsVisible = true;

    // Iterate through each flag <span> and check if it's displayed
    for (let i = 0; i < flagSpans.length; i++) {
      const flagSpan = flagSpans[i];

      // Check if the flag <span> is displayed
      const isFlagVisible = await flagSpan.isDisplayed();
      const endTime = performance.now(); // End time tracking
      const executionTime = ((endTime - startTime) / 1000).toFixed(2); // Convert to seconds

      if (!isFlagVisible) {
        allFlagsVisible = false;
        console.log(
          `❌ TEST CASE 10 [${capabilities.deviceName}]: Flag at index ${i} is not visible. - FAILED-(Execution Time: ${executionTime} sec)`
        );
      } else {
        console.log(
          `✅ TEST CASE 10 [${capabilities.deviceName}]: Flag at index ${i} is visible. - PASSED-(Execution Time: ${executionTime} sec)`
        );
      }
    }

    const endTime = performance.now(); // End time tracking
    const executionTime = ((endTime - startTime) / 1000).toFixed(2); // Convert to seconds
    let result;
    if (allFlagsVisible) {
      result = `✅ TEST CASE 10 [${capabilities.deviceName}]: All country flags are visible - PASSED-(Execution Time: ${executionTime} sec)`;
    } else {
      result = `❌ TEST CASE 10 [${capabilities.deviceName}]: Some country flags are not visible - FAILED-(Execution Time: ${executionTime} sec)`;
    }
    console.log(result);
    saveTestReport(result);
  } catch (error) {
    console.log(
      `❌ TEST CASE 10 [${capabilities.deviceName}]: An error occurred - ${error.message}`
    );
  }
}
