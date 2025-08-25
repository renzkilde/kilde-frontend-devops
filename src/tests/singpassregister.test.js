const { Builder, By, until } = require("selenium-webdriver");
const config = require("./browserstack.config.js");
const chrome = require("selenium-webdriver/chrome");
require("dotenv").config();

jest.setTimeout(120000);

describe("Singpass Registration Flow", () => {
  let driver;
  const fs = require("fs");
  const path = require("path");

  // Function to save logs to a file
  function saveTestReport(message) {
    const pageName = "Singpass register page";
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

  test("should complete Singpass registration flow", async () => {
    const startTime = performance.now();
    try {
      // 1. Open registration page
      await driver.get("https://dev.kilde.sg/register");

      // 2. Click 'Sign up with Singpass'
      const singpassButton = await driver.findElement(
        By.id("btn-singpass-signup")
      );
      await singpassButton.click();

      // 3. Wait for Singpass login page and click on a test user
      await driver.wait(
        until.urlContains("test.api.myinfo.gov.sg/mockpass-sp"),
        10000
      );

      const dropdown = await driver.findElement(By.name("code"));
      const options = await dropdown.findElements(By.tagName("option"));
      await options[2].click();

      // 4. Click "I Login"
      const loginBtn = await driver.findElement(
        By.xpath("//button[contains(., 'Login')]")
      );
      await loginBtn.click();

      // 5. Click "I Agree"
      await driver.wait(
        until.elementLocated(By.xpath("//button[contains(., 'I Agree')]")),
        10000
      );
      const agreeBtn = await driver.findElement(
        By.xpath("//button[contains(., 'I Agree')]")
      );
      await agreeBtn.click();

      // 6. Wait for redirect to local callback
      await driver.wait(
        until.urlContains("http://localhost:3001/callback"),
        5000
      );

      const currentUrl = await driver.getCurrentUrl();

      console.log("✅ Redirected to:", currentUrl);

      const endTime = performance.now();
      const executionTime = ((endTime - startTime) / 1000).toFixed(2);

      saveTestReport(
        `✅ Test Passed: Redirected to callback URL (${currentUrl}) - (Execution Time: ${executionTime} sec)`
      );
    } catch (error) {
      const endTime = performance.now();
      const executionTime = ((endTime - startTime) / 1000).toFixed(2);

      saveTestReport(
        `❌ Test Failed: Singpass registration flow - ${error.message} - (Execution Time: ${executionTime} sec)`
      );
      throw error; // still throw so the test fails properly
    }
  });
});
