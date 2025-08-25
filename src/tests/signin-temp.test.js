require("dotenv").config();
const { Builder, By, until } = require("selenium-webdriver");
const { measurePageLoadTime, waitForUrlChange } = require("./common.test");
const { testDevices } = require("./test.config");

// BrowserStack credentials from environment variables
const username = process.env.BROWSERSTACK_USERNAME;
const accessKey = process.env.BROWSERSTACK_ACCESS_KEY;

const fs = require("fs");
const path = require("path");

// Test URL for the login page
const testURL = "https://app.kilde.sg/login?utm_source=browserstack";

// Function to run tests on multiple devices and browsers
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
        // Test Case 1: Valid Login
        await testValidLogin(driver, capabilities);

        // Test Case 2: Invalid Email
        await testInvalidEmail(driver, capabilities);

        // Test Case 3: Invalid Password
        // await testInvalidPassword(driver, capabilities);

        // Test Case 4: Empty Email
        await testEmptyEmail(driver, capabilities);

        // Test Case 5: Empty Password
        // await testEmptyPassword(driver, capabilities);

        // // Test Case 6: Password Field Visibility
        // await testPasswordFieldVisibility(driver, capabilities);

        // // Test Case 7: Remember Me Checkbox
        // await testRememberMeCheckbox(driver, capabilities);
    } catch (error) {
        console.error("❌ TEST FAILED:", error);
    } finally {
        // Close the browser
        await driver.quit();
    }
}

// Loop through multiple devices for cross-browser testing

testDevices.forEach((capabilities) => {
    const updatedCapabilities = {
        ...capabilities,
        "bstack:options": {
            ...capabilities["bstack:options"], // Preserve existing options
            sessionName: `Signin - ${new Date().toISOString()}`, // Dynamic session name
        },
    };
    runTest(updatedCapabilities);
});

// Function to save logs to a file
function saveTestReport(message) {
    const pageName = "Login page";
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

// Test Case 1: Valid Login
async function testValidLogin(driver, capabilities) {
    const startTime = performance.now();
    await driver.get(testURL);
    await driver
        .findElement(By.name("email"))
        .sendKeys("yovel62720@myweblaw.com");
    await driver.findElement(By.name("password")).sendKeys(process.env.PASSWORD);
    await driver.findElement(By.id("btn-continue-login")).click();

    await waitForUrlChange(driver, 10000);
    const currentUrl = await driver.getCurrentUrl();

    const endTime = performance.now(); // End time tracking
    const executionTime = ((endTime - startTime) / 1000).toFixed(2);
    let result;
    result = `✅ TEST CASE 1 [${capabilities.deviceName}]: Valid Login and redirected to ${currentUrl} - PASSED-(Execution Time: ${executionTime} sec`;
    console.log(result);
    saveTestReport(result);
}

// Test Case 2: Invalid Email
async function testInvalidEmail(driver) {
    const startTime = performance.now();
    await driver.get(testURL);
    await driver.findElement(By.name("email")).sendKeys("invalname@@.com");
    await driver.findElement(By.name("password")).sendKeys(process.env.PASSWORD);
    await driver.findElement(By.id("btn-continue-login")).click();

    const errorMessage = await driver
        .findElement(By.className("error-msg"))
        .getText();

    const endTime = performance.now(); // End time tracking
    const executionTime = ((endTime - startTime) / 1000).toFixed(2);
    let result;
    if (errorMessage === "Email is Required") {
        result = `Test Case 2: Invalid Email - Passed-(Execution Time: ${executionTime} sec`;
    } else {
        result = `Test Case 2: Invalid Email - Failed-(Execution Time: ${executionTime} sec`;
    }
    console.log(result);
    saveTestReport(result);
}

// Test Case 3: Invalid Password
async function testInvalidPassword(driver) {
    const startTime = performance.now();
    await driver.get(testURL);
    await driver
        .findElement(By.name("email"))
        .sendKeys("yovel62720@myweblaw.com");
    await driver.findElement(By.name("password")).sendKeys("wrongPassword");
    await driver.findElement(By.id("btn-continue-login")).click();

    // Wait for the notification to appear
    const notification = await driver.wait(
        until.elementLocated(By.css(".ant-notification-notice-message")),
        10000 // Wait for up to 10 seconds
    );

    const notificationText = await notification.getText();

    const endTime = performance.now(); // End time tracking
    const executionTime = ((endTime - startTime) / 1000).toFixed(2);
    let result;
    if (notificationText === "Invalid credentials") {
        result = `Test Case 3: Invalid Password - Passed-(Execution Time: ${executionTime} sec`;
    } else {
        result = `Test Case 3: Invalid Password - Failed-(Execution Time: ${executionTime} sec`;
    }
    console.log(result);
    saveTestReport(result);
}

// Test Case 4: Empty Email
async function testEmptyEmail(driver) {
    const startTime = performance.now();
    await driver.get(testURL);
    await driver.findElement(By.name("password")).sendKeys(process.env.PASSWORD);
    await driver.findElement(By.id("btn-continue-login")).click();
    await driver.findElement(By.id("btn-continue-login")).click();
    const errorMessage = await driver
        .findElement(By.css("span.error-msg"))
        .getText();

    const endTime = performance.now(); // End time tracking
    const executionTime = ((endTime - startTime) / 1000).toFixed(2);
    let result;
    if (errorMessage === "Email is Required") {
        result = `Test Case 4: Empty Email - Passed-(Execution Time: ${executionTime} sec`;
    } else {
        result = `Test Case 4: Empty Email - Failed-(Execution Time: ${executionTime} sec`;
    }
    console.log(result);
    saveTestReport(result);
}

// Test Case 5: Empty Password
async function testEmptyPassword(driver) {
    const startTime = performance.now();
    await driver.get(testURL);
    await driver.findElement(By.name("email")).sendKeys("validuser@example.com");
    await driver.findElement(By.id("btn-continue-login")).click();

    const errorMessage = await driver
        .findElement(By.css("span.error-msg"))
        .getText();

    const endTime = performance.now(); // End time tracking
    const executionTime = ((endTime - startTime) / 1000).toFixed(2);
    let result;
    if (errorMessage === "Password is required.") {
        result = `Test Case 5: Empty Password - Passed-(Execution Time: ${executionTime} sec`;
    } else {
        result = `Test Case 5: Empty Password - Failed-(Execution Time: ${executionTime} sec`;
    }
    console.log(result);
    saveTestReport(result);
}

// Test Case 6: Redirect after Successful Login
async function testRedirectAfterLogin(driver) {
    await driver.get("https://your-react-app-url.com/login");
    await driver.findElement(By.id("email")).sendKeys("validuser@example.com");
    await driver.findElement(By.id("password")).sendKeys("validPassword");
    await driver.findElement(By.id("btn-continue-login")).click();

    await driver.wait(until.urlContains("/dashboard"), 10000);
    console.log("Test Case 6: Redirect after Successful Login - Passed");
}

// Test Case 7: Login Button Disabled
async function testLoginButtonDisabled(driver) {
    await driver.get("https://your-react-app-url.com/login");
    const loginButton = await driver.findElement(By.id("btn-continue-login"));

    // Check if the button is disabled when fields are empty
    const isDisabled = await loginButton.getAttribute("disabled");
    if (isDisabled) {
        console.log("Test Case 7: Login Button Disabled - Passed");
    } else {
        console.log("Test Case 7: Login Button Disabled - Failed");
    }
}
