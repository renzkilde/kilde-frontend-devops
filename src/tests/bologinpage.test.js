const { Builder, By, until, Key } = require("selenium-webdriver");
const config = require("./browserstack.config.js");
const chrome = require("selenium-webdriver/chrome");
require("dotenv").config();

jest.setTimeout(120000);

describe("Backoffice Login Test on BrowserStack", () => {
  let driver;
  const fs = require("fs");
  const path = require("path");

  // Function to save logs to a file
  async function saveTestReport(message) {
    const logFilePath = path.join(__dirname, "test-report.log");
    const logEntry = `[${new Date().toISOString()}] ${message}\n`;

    // Log to console immediately
    console.log(logEntry);

    try {
      await fs.appendFile(logFilePath, logEntry);
    } catch (err) {
      console.error("Failed to write log file:", err);
    }
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
  }, 120000);

  afterAll(async () => {
    if (driver) await driver.quit();
  });

  test("should load login page and click Login with Google", async () => {
    await driver.get("https://bo.kilde.sg/");

    const loginButton = await driver.wait(
      until.elementLocated(
        By.xpath(
          "//div[@role='button' and .//span[text()='Login with Google']]"
        )
      ),
      10000
    );

    await driver.executeScript(
      "arguments[0].scrollIntoView(true);",
      loginButton
    );
    await driver.sleep(500);
    await loginButton.click();

    await driver.wait(until.urlContains("accounts.google.com"), 10000);

    // Enter email
    await driver.wait(
      until.elementLocated(By.xpath("//input[@type='email']")),
      10000
    );
    let emailField = await driver.findElement(
      By.xpath("//input[@type='email']")
    );
    await driver.wait(until.elementIsVisible(emailField), 10000);
    await emailField.sendKeys(process.env.BROWSERSTACK_BO_EMAIL);

    const emailNextBtn = await driver.findElement(
      By.xpath("//span[text()='Next']/parent::button")
    );
    await emailNextBtn.click();

    // Wait for transition and locate password field again (handle potential DOM changes)
    await driver.wait(
      until.elementLocated(By.xpath("//input[@type='password']")),
      30000
    );
    let passwordField;
    let attempts = 0;
    while (attempts < 3) {
      try {
        passwordField = await driver.findElement(
          By.xpath("//input[@type='password']")
        );
        await driver.wait(until.elementIsVisible(passwordField), 30000);
        await passwordField.clear(); // ensure it is cleared before typing
        await passwordField.sendKeys(process.env.PASSWORD);
        break; // success
      } catch (error) {
        if (error.name === "StaleElementReferenceError") {
          attempts++;
          await driver.sleep(500);
        } else {
          throw error;
        }
      }
    }

    const passwordNextBtn = await driver.wait(
      until.elementLocated(By.xpath("//span[text()='Next']/parent::button")),
      10000
    );
    await passwordNextBtn.click();

    // Give time for login to proceed and popup (if any) to appear
    // await driver.sleep(20000);
    try {
      const continueButton = await driver.wait(
        until.elementLocated(By.xpath("//button//span[text()='Continue']")),
        30000
      );
      if (continueButton) {
        await continueButton.click();
        console.log("Managed profile popup handled.");
      }
    } catch (error) {
      console.log("No managed profile popup appeared.");
    }

    // Now confirm login success by checking if dashboard loads
    try {
      await driver.wait(until.urlContains("bo.kilde.sg/"), 20000);
      await driver.get("https://bo.kilde.sg/#!borrowers"); // or the expected post-login page

      const dashboard = await driver.wait(
        until.elementLocated(By.css(".v-expand")), // Use actual dashboard element selector
        10000
      );

      expect(await dashboard.isDisplayed()).toBe(true);
      saveTestReport("TEST CASE 1: Login successful, dashboard loaded.");
      console.log("Login successful, dashboard loaded.");
    } catch (err) {
      console.log("Login may have failed or dashboard didn't load.");
      throw err; // Let the test fail here if it's not loaded
    }
  });
});
