const { Builder, By, until } = require("selenium-webdriver");
const config = require("./browserstack.config.js");
const chrome = require("selenium-webdriver/chrome");
require("dotenv").config();

jest.setTimeout(120000);

describe("Google Login Flow", () => {
  let driver;
  const fs = require("fs");
  const path = require("path");

  // Function to save logs to a file
  function saveTestReport(message) {
    const pageName = "Google Login";
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

  beforeAll(async () => {
    const options = new chrome.Options();
    options.addArguments("--no-first-run");
    options.addArguments("--no-default-browser-check");
    options.excludeSwitches = ["enable-automation", "load-extension"];

    driver = await new Builder()
      .forBrowser("chrome")
      .usingServer(
        `https://${config.user}:${config.key}@${config.server}/wd/hub`
      )
      .withCapabilities(config.capabilities[0])
      .setChromeOptions(options)
      .build();
  }, 60000);

  afterAll(async () => {
    if (driver) await driver.quit();
  });

  test("should complete Google signin flow", async () => {
    const startTime = performance.now();

    try {
      // 1. Open login page
      await driver.get("https://dev.kilde.sg/login");

      // 2. Click 'Sign up with Google'
      const googleButton = await driver.findElement(By.id("btn-google-login"));
      await googleButton.click();

      // 3. Wait for popup and switch to it
      await driver.wait(
        async () => (await driver.getAllWindowHandles()).length > 1,
        10000
      );
      const windows = await driver.getAllWindowHandles();
      await driver.switchTo().window(windows[1]);

      // 4. Enter email
      const emailInput = await driver.wait(
        until.elementLocated(By.css("input[type='email']")),
        10000
      );
      await driver.wait(until.elementIsVisible(emailInput), 5000);
      await emailInput.sendKeys(process.env.BROWSERSTACK_BO_EMAIL);

      const nextButton = await driver.wait(
        until.elementLocated(By.id("identifierNext")),
        5000
      );
      await nextButton.click();

      // Wait for and re-fetch password input
      await driver.wait(
        until.elementLocated(By.css("input[type='password']")),
        10000
      );
      const passwordInput = await driver.findElement(
        By.css("input[type='password']")
      );
      await driver.wait(until.elementIsVisible(passwordInput), 5000);
      await passwordInput.clear(); // Optional safety
      await passwordInput.sendKeys(process.env.PASSWORD);

      // Click "Next" using fresh element
      const nextPasswordBtn = await driver.wait(
        until.elementLocated(By.id("passwordNext")),
        5000
      );
      await driver.wait(until.elementIsEnabled(nextPasswordBtn), 3000);
      await nextPasswordBtn.click();

      // 6. Optional: Handle "Continue" button if it appears
      try {
        await driver.wait(
          until.elementLocated(By.xpath("//button[contains(., 'Continue')]")),
          5000
        );
        const continueBtn = await driver.findElement(
          By.xpath("//button[contains(., 'Continue')]")
        );
        await driver.wait(until.elementIsVisible(continueBtn), 2000);
        await continueBtn.click();
      } catch (_) {
        console.log("No Continue button — skipping...");
      }

      // 7. Wait for popup to close and return to main window
      await driver.wait(
        async () => (await driver.getAllWindowHandles()).length === 1,
        10000
      );
      await driver.switchTo().window(windows[0]);

      // 8. Wait for verification redirect
      await driver.wait(until.urlContains("/verification/individual"), 15000);
      const currentUrl = await driver.getCurrentUrl();
      console.log("✅ Redirected to:", currentUrl);

      const endTime = performance.now();
      const executionTime = ((endTime - startTime) / 1000).toFixed(2);

      await saveTestReport(
        `✅ Google Sign-In Passed: Redirected to (${currentUrl}) - (Execution Time: ${executionTime} sec)`
      );

      expect(currentUrl).toContain("/verification/individual");
    } catch (error) {
      const endTime = performance.now();
      const executionTime = ((endTime - startTime) / 1000).toFixed(2);

      await saveTestReport(
        `❌ Google Sign-In Failed: ${error.message} - (Execution Time: ${executionTime} sec)`
      );

      throw error;
    }
  }, 45000);
});
