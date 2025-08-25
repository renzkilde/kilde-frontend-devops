require("dotenv").config();
const { Builder, By, until } = require("selenium-webdriver");
const { testDevices } = require("./test.config");

const username = process.env.BROWSERSTACK_USERNAME;
const accessKey = process.env.BROWSERSTACK_ACCESS_KEY;

const productionURL = "https://app.kilde.sg/register?utm_source=browserstack";

const fs = require("fs");
const path = require("path");

async function runTest(capabilities) {
  console.log("⌛️ === AUTOMATED TEST STARTED === ⌛️");

  const driver = await new Builder()
    .usingServer(
      `https://${username}:${accessKey}@hub-cloud.browserstack.com/wd/hub`
    )
    .withCapabilities(capabilities)
    .build();

  try {
    //Test 1
    await testEmptyFirstName(driver, capabilities);

    //Test 2
    await testEmptyLastName(driver, capabilities);

    // Test 3
    await testEmptyEmailField(driver, capabilities);

    //Test 4
    await testInvalidEmailFormat(driver, capabilities);

    //Test 5
    await testPasswordMismatch(driver, capabilities);

    //Test 6
    await testWeakPassword(driver, capabilities);

    //Test 7
    await testEmptyMobileNumber(driver, capabilities);

    //Test 8
    await testTermsChecked(driver, capabilities);
  } catch (error) {
    console.error("❌ TEST FAILED:", error);
  } finally {
    await driver.quit();
  }
}

testDevices.forEach((capabilities) => {
  const updatedCapabilities = {
    ...capabilities,
    "bstack:options": {
      ...capabilities["bstack:options"], // Preserve existing options
      sessionName: `Register-Page-validation - ${new Date().toISOString()}`, // Dynamic session name
    },
  };
  runTest(updatedCapabilities);
});

// Function to save logs to a file
function saveTestReport(message) {
  const pageName = "Register page";
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

async function testEmptyFirstName(driver, capabilities) {
  try {
    const startTime = performance.now();
    await driver.get(productionURL);

    // Wait for the "Welcome!" element to load
    await driver.wait(
      until.elementLocated(By.css(".kl-pi-title.mb-10.mt-0")),
      10000
    );

    // Fill other fields but leave the email field empty
    await driver.findElement(By.name("firstName")).sendKeys("");

    // Click Register button
    const submitButton = await driver.findElement(
      By.css("button[type='submit']")
    );
    await submitButton.click();

    // Wait for error message and check for email error specifically
    const errorMessage = driver.findElement(
      By.css(".ant-form-item-explain-error")
    );
    const errorText = await errorMessage.getText();

    const endTime = performance.now(); // End time tracking
    const executionTime = ((endTime - startTime) / 1000).toFixed(2);
    let result;
    if (errorText === "First name is required") {
      result = `✅ Test Case 1 [${capabilities.deviceName}]: Empty First name  - PASSED-(Execution Time: ${executionTime} sec`;
    } else {
      result = `❌ Test Case 1 [${capabilities.deviceName}]: Empty First name  - FAILED-(Execution Time: ${executionTime} sec`;
    }
    console.log(result);
    saveTestReport(result);
  } catch (error) {
    console.error(`❌ Test Case 1: An error occurred - ${error.message}`);
  }
}

async function testEmptyLastName(driver, capabilities) {
  try {
    const startTime = performance.now();
    await driver.get(productionURL);

    // Wait for the "Welcome!" element to load
    await driver.wait(
      until.elementLocated(By.css(".kl-pi-title.mb-10.mt-0")),
      10000
    );

    // Fill other fields but leave the email field empty
    await driver.findElement(By.name("firstName")).sendKeys("BrowserStack");
    await driver.findElement(By.name("lastName")).clear();
    await driver.findElement(By.name("email")).clear();

    // Click Register button
    const submitButton = await driver.findElement(
      By.css("button[type='submit']")
    );
    await submitButton.click();

    // Wait for error message and check for email error specifically
    const errorMessage = driver.findElement(
      By.css(".ant-form-item-explain-error")
    );
    const errorText = await errorMessage.getText();

    const endTime = performance.now(); // End time tracking
    const executionTime = ((endTime - startTime) / 1000).toFixed(2);
    let result;
    if (errorText === "Last name is required") {
      result = `✅ Test Case 2 [${capabilities.deviceName}]: Empty Last name - PASSED-(Execution Time: ${executionTime} sec`;
    } else {
      result = `❌ Test Case 2 [${capabilities.deviceName}]: Empty Last name - FAILED-(Execution Time: ${executionTime} sec`;
    }
    console.log(result);
    saveTestReport(result);
  } catch (error) {
    console.error(`❌ Test Case 2: An error occurred - ${error.message}`);
  }
}

async function testEmptyEmailField(driver, capabilities) {
  try {
    const startTime = performance.now();
    await driver.get(productionURL);

    // Wait for the "Welcome!" element to load
    await driver.wait(
      until.elementLocated(By.css(".kl-pi-title.mb-10.mt-0")),
      10000
    );

    // Fill other fields but leave the email field empty
    await driver.findElement(By.name("firstName")).sendKeys("BrowserStack");
    await driver.findElement(By.name("lastName")).sendKeys("Automate");
    await driver.findElement(By.name("email")).clear();

    // Click Register button
    const submitButton = await driver.findElement(
      By.css("button[type='submit']")
    );
    await submitButton.click();

    // Wait for error message and check for email error specifically
    const errorMessage = driver.findElement(
      By.css(".ant-form-item-explain-error")
    );
    const errorText = await errorMessage.getText();
    const endTime = performance.now(); // End time tracking
    const executionTime = ((endTime - startTime) / 1000).toFixed(2);
    let result;
    if (errorText === "Email is Required") {
      result = `✅ Test Case 3 [${capabilities.deviceName}]: Empty Email Field - PASSED-(Execution Time: ${executionTime} sec`;
    } else {
      result = `❌ Test Case 3 [${capabilities.deviceName}]: Empty Email Field - FAILED-(Execution Time: ${executionTime} sec`;
    }
    console.log(result);
    saveTestReport(result);
  } catch (error) {
    console.error(`❌ Test Case 3: An error occurred - ${error.message}`);
  }
}

async function testInvalidEmailFormat(driver, capabilities) {
  try {
    const startTime = performance.now();
    await driver.get(productionURL);

    // Wait for the "Welcome!" element to load
    await driver.wait(
      until.elementLocated(By.css(".kl-pi-title.mb-10.mt-0")),
      10000
    );

    // Fill other fields but leave the email field empty
    await driver.findElement(By.name("firstName")).sendKeys("BrowserStack");
    await driver.findElement(By.name("lastName")).sendKeys("Automate");
    await driver.findElement(By.name("email")).sendKeys("invalidemail");

    // Click Register button
    const submitButton = await driver.findElement(
      By.css("button[type='submit']")
    );
    await submitButton.click();

    // Wait for error message and check for email error specifically
    const errorMessage = driver.findElement(
      By.css(".ant-form-item-explain-error")
    );
    const errorText = await errorMessage.getText();
    const endTime = performance.now(); // End time tracking
    const executionTime = ((endTime - startTime) / 1000).toFixed(2);
    let result;
    if (errorText === "Email is Required") {
      result = `✅ Test Case 4 [${capabilities.deviceName}]: Empty Email Field - PASSED-(Execution Time: ${executionTime} sec`;
    } else {
      result = `❌ Test Case 4 [${capabilities.deviceName}]: Empty Email Field - FAILED-(Execution Time: ${executionTime} sec`;
    }
    console.log(result);
    saveTestReport(result);
  } catch (error) {
    console.error(
      `❌ Test Case 4 [${capabilities.deviceName}]: An error occurred - ${error.message}`
    );
  }
}

async function testPasswordMismatch(driver, capabilities) {
  try {
    const startTime = performance.now();
    await driver.get(productionURL);

    // Wait for the "Welcome!" element to load
    await driver.wait(
      until.elementLocated(By.css(".kl-pi-title.mb-10.mt-0")),
      10000
    );

    // Fill other fields but leave the email field empty
    await driver.findElement(By.name("firstName")).sendKeys("BrowserStack");
    await driver.findElement(By.name("lastName")).sendKeys("Automate");
    await driver.findElement(By.name("email")).sendKeys("sushma@gmail.com");
    const phoneInput = driver.findElement(
      By.css(".react-tel-input.sb-phone-field input")
    );

    // Clear the existing value and send new value
    phoneInput.clear();
    phoneInput.sendKeys("+91 98765-43210");

    await driver
      .findElement(By.css('input[name="password"][placeholder="Password"]'))
      .sendKeys(process.env.PASSWORD);
    await driver
      .findElement(
        By.css('input[name="cPassword"][placeholder="Confirm Password"]')
      )
      .sendKeys(process.env.WEAK_PASSWORD);

    // Click Register button
    const submitButton = await driver.findElement(
      By.css("button[type='submit']")
    );
    await submitButton.click();

    const errorMessage = driver.findElement(
      By.css(".ant-form-item-explain-error")
    );
    const errorText = await errorMessage.getText();

    const endTime = performance.now(); // End time tracking
    const executionTime = ((endTime - startTime) / 1000).toFixed(2);
    let result;
    if (errorText === "Passwords don't match!") {
      result = `✅ Test Case 5 [${capabilities.deviceName}]: Password Mismatch - PASSED-(Execution Time: ${executionTime} sec`;
    } else {
      result = `❌ Test Case 5 [${capabilities.deviceName}]: Password Mismatch - FAILED-(Execution Time: ${executionTime} sec`;
    }
    console.log(result);
    saveTestReport(result);
  } catch (error) {
    console.error(`❌ Test Case 5: An error occurred - ${error.message}`);
  }
}

async function testWeakPassword(driver, capabilities) {
  const startTime = performance.now();
  await driver.get(productionURL);
  await driver.findElement(By.name("firstName")).sendKeys("BrowserStack");
  await driver.findElement(By.name("lastName")).sendKeys("Automate");
  await driver.findElement(By.name("email")).sendKeys("sushma@gmail.com");
  await driver
    .findElement(By.id("password"))
    .sendKeys(process.env.WEAK_PASSWORD);
  await driver
    .findElement(By.id("cPassword"))
    .sendKeys(process.env.WEAK_PASSWORD);

  await driver.findElement(By.id("btn-create-account")).click();

  const errorMessage = driver.findElement(
    By.css(".ant-form-item-explain-error")
  );
  const errorText = await errorMessage.getText();

  const endTime = performance.now(); // End time tracking
  const executionTime = ((endTime - startTime) / 1000).toFixed(2);
  let result;
  if (
    errorText ===
    "Use at least 10 characters, including 1 uppercase, 1 lower case, 1 special character, and 1 number"
  ) {
    result = `✅ Test Case 6 [${capabilities.deviceName}]: Weak Password - Passed-(Execution Time: ${executionTime} sec`;
  } else {
    result = `✅ Test Case 6 [${capabilities.deviceName}]: Weak Password - Failed-(Execution Time: ${executionTime} sec`;
  }
  console.log(result);
  saveTestReport(result);
}

async function testEmptyMobileNumber(driver, capabilities) {
  try {
    const startTime = performance.now();
    await driver.get(productionURL);

    // Wait for the "Welcome!" element to load
    await driver.wait(
      until.elementLocated(By.css(".kl-pi-title.mb-10.mt-0")),
      10000
    );

    // Fill other fields but leave the email field empty
    await driver.findElement(By.name("firstName")).sendKeys("BrowserStack");
    await driver.findElement(By.name("lastName")).sendKeys("Automate");
    await driver.findElement(By.name("email")).sendKeys("sushma@gmail.com");
    await driver
      .findElement(By.css('input[name="password"][placeholder="Password"]'))
      .sendKeys(process.env.PASSWORD);
    await driver
      .findElement(
        By.css('input[name="cPassword"][placeholder="Confirm Password"]')
      )
      .sendKeys(process.env.PASSWORD);

    await driver.findElement(By.className("ant-checkbox-input")).click();
    await driver.findElement(By.id("btn-create-account")).click();

    const errorMessage = driver.findElement(
      By.css(".ant-form-item-explain-error")
    );
    const errorText = await errorMessage.getText();

    const endTime = performance.now(); // End time tracking
    const executionTime = ((endTime - startTime) / 1000).toFixed(2);
    let result;
    if (errorText === "Please enter mobile number") {
      result = `✅ Test Case 7 [${capabilities.deviceName}]:Empty Mobile Number - PASSED-(Execution Time: ${executionTime} sec`;
    } else {
      result = `❌ Test Case 7 [${capabilities.deviceName}]: Empty Mobile Number - FAILED-(Execution Time: ${executionTime} sec`;
    }
    console.log(result);
    saveTestReport(result);
  } catch (error) {
    console.error(`❌ Test Case 7: An error occurred - ${error.message}`);
  }
}

async function testTermsChecked(driver, capabilities) {
  try {
    const startTime = performance.now();
    await driver.get(productionURL);

    // Wait for the "Welcome!" element to load
    await driver.wait(
      until.elementLocated(By.css(".kl-pi-title.mb-10.mt-0")),
      10000
    );

    // Fill other fields but leave the email field empty
    await driver.findElement(By.name("firstName")).sendKeys("BrowserStack");
    await driver.findElement(By.name("lastName")).sendKeys("Automate");
    await driver.findElement(By.name("email")).sendKeys("sushma@gmail.com");
    await driver
      .findElement(By.className("form-control"))
      .sendKeys("+91918075353890");
    await driver
      .findElement(By.css('input[name="password"][placeholder="Password"]'))
      .sendKeys(process.env.PASSWORD);
    await driver
      .findElement(
        By.css('input[name="cPassword"][placeholder="Confirm Password"]')
      )
      .sendKeys(process.env.PASSWORD);

    await driver.findElement(By.id("btn-create-account")).click();

    const errorMessage = await driver
      .findElement(By.css("label.error-msg"))
      .getText();

    const endTime = performance.now(); // End time tracking
    const executionTime = ((endTime - startTime) / 1000).toFixed(2);
    let result;
    if (
      errorMessage.includes("Please accept the Terms of Use & Privacy Policy")
    ) {
      result = `✅ Test Case 8 [${capabilities.deviceName}]: Terms and Conditions Unchecked - PASSED-(Execution Time: ${executionTime} sec`;
    } else {
      result = `❌ Test Case 8 [${capabilities.deviceName}]: Terms and Conditions Unchecked - FAILED-(Execution Time: ${executionTime} sec`;
    }
    console.log(result);
    saveTestReport(result);
  } catch (error) {
    console.error(`❌ Test Case 8: An error occurred - ${error.message}`);
  }
}
