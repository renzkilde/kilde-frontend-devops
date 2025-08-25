const { Builder, By, until } = require("selenium-webdriver");
const { BS_CONFIG, TEST_DEVICES } = require("./test.config");
const { measurePageLoadTime, waitForUrlChange } = require("./common.test");

const username = BS_CONFIG.username;
const accessKey = BS_CONFIG.accessKey;
const testURL = "https://app.kilde.sg/login?utm_source=browserstack";

async function runTest(capabilities) {
  console.log("⌛️ === AUTOMATED TEST STARTED === ⌛️");
  const driver = await new Builder()
    .usingServer(
      `https://${username}:${accessKey}@hub-cloud.browserstack.com/wd/hub`
    )
    .withCapabilities(capabilities)
    .build();

  try {
    // Test Case 0: Valid Login
    await measurePageLoadTime(driver, capabilities, testURL, 0);

    // Test Case 1: Valid Login
    // await testValidLogin(driver, capabilities);

    // Test Case 2: Invalid Email
    // await testInvalidEmail(driver);

    // Test Case 3: Invalid Password
    // await testInvalidPassword(driver);

    // Test Case 4: Empty Email
    // await testEmptyEmail(driver);

    // Test Case 5: Empty Password
    // await testEmptyPassword(driver);

    // Test Case 6: Redirect after Successful Login
    // await testRedirectAfterLogin(driver);

    // Test Case 7: Login Button Disabled
    // await testLoginButtonDisabled(driver);

    // TODO CHECK LOGIN API RESPONSE & REDIRECTION TIME
    // BROWSER STACK BROWSER ISSUE
  } catch (error) {
    console.error("❌ TEST FAILED:", error);
  } finally {
    // Close the browser
    await driver.quit();
  }
}

TEST_DEVICES.forEach((capabilities) => {
  runTest(capabilities);
});

// Test Case 1: Valid Login
async function testValidLogin(driver, capabilities) {
  await driver.get(testURL);
  await driver
    .findElement(By.name("email"))
    .sendKeys("browserstacktest@gmail.com");
  await driver.findElement(By.name("password")).sendKeys("Test@12345");
  await driver.findElement(By.id("btn-continue-login")).click();

  await waitForUrlChange(driver, 10000);
  const currentUrl = await driver.getCurrentUrl();
  console.log(
    `✅ TEST CASE 1 [${capabilities.name}]: Valid Login and redirected to ${currentUrl} - PASSED`
  );
}

// Test Case 2: Invalid Email
async function testInvalidEmail(driver) {
  await driver.get(testURL);
  await driver.findElement(By.name("email")).sendKeys("invalname@@.com");
  await driver.findElement(By.name("password")).sendKeys("Test@12345");
  await driver.findElement(By.id("btn-continue-login")).click();

  const errorMessage = await driver
    .findElement(By.className("error-msg"))
    .getText();
  if (errorMessage === "Email is Required") {
    console.log("Test Case 2: Invalid Email - Passed");
  } else {
    console.log("Test Case 2: Invalid Email - Failed");
  }
}

// Test Case 3: Invalid Password
async function testInvalidPassword(driver) {
  await driver.get(testURL);
  await driver
    .findElement(By.name("email"))
    .sendKeys("browserstacktest@gmail.com");
  await driver.findElement(By.name("password")).sendKeys("wrongPassword");
  await driver.findElement(By.id("btn-continue-login")).click();

  // Wait for the notification to appear
  const notification = await driver.wait(
    until.elementLocated(By.css(".ant-notification-notice-message")),
    10000 // Wait for up to 10 seconds
  );

  const notificationText = await notification.getText();

  if (notificationText === "Invalid credentials") {
    console.log("Test Case 3: Invalid Password - Passed");
  } else {
    console.log("Test Case 3: Invalid Password - Failed");
  }
}

// Test Case 4: Empty Email
async function testEmptyEmail(driver) {
  await driver.get("https://your-react-app-url.com/login");
  await driver.findElement(By.id("password")).sendKeys("validPassword");
  await driver.findElement(By.id("btn-continue-login")).click();

  const errorMessage = await driver.findElement(By.id("email-error")).getText();
  if (errorMessage === "Email is required.") {
    console.log("Test Case 4: Empty Email - Passed");
  } else {
    console.log("Test Case 4: Empty Email - Failed");
  }
}

// Test Case 5: Empty Password
async function testEmptyPassword(driver) {
  await driver.get("https://your-react-app-url.com/login");
  await driver.findElement(By.id("email")).sendKeys("validuser@example.com");
  await driver.findElement(By.id("btn-continue-login")).click();

  const errorMessage = await driver
    .findElement(By.id("password-error"))
    .getText();
  if (errorMessage === "Password is required.") {
    console.log("Test Case 5: Empty Password - Passed");
  } else {
    console.log("Test Case 5: Empty Password - Failed");
  }
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
