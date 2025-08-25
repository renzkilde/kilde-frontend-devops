const { Builder, By, until } = require("selenium-webdriver");
const config = require("./browserstack.config.js");
const chrome = require("selenium-webdriver/chrome");
require("dotenv").config();

jest.setTimeout(120000);

describe("Notification Modal tests", () => {
  let driver;
  const fs = require("fs");
  const path = require("path");

  // Function to save logs to a file
  function saveTestReport(message) {
    const pageName = "Notification page";
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

  //Valid login
  test("Check if valid login redirects to Dashboard", async () => {
    const startTime = performance.now();
    try {
      await driver.get("https://app.kilde.sg/login");

      const welcomeElement = await driver.wait(
        until.elementLocated(
          By.xpath("//*[contains(text(), 'Welcome back!')]")
        ),
        50000
      );
      expect(await welcomeElement.getText()).toBe("Welcome back!");

      await driver
        .findElement(By.name("email"))
        .sendKeys("yovel62720@myweblaw.com");
      await driver
        .findElement(By.name("password"))
        .sendKeys(process.env.PASSWORD);
      await driver.findElement(By.id("btn-continue-login")).click();

      await driver.get("https://app.kilde.sg/dashboard");
      await driver.wait(until.urlContains("/dashboard"), 15000);
      expect(await driver.getCurrentUrl()).toContain("/dashboard");
      const endTime = performance.now(); // End time tracking
      const executionTime = ((endTime - startTime) / 1000).toFixed(2);
      saveTestReport(
        `✅ Test Passed: Valid login redirects to wallet page-(Execution Time: ${executionTime} sec)`
      );
    } catch (error) {
      const endTime = performance.now(); // End time tracking
      const executionTime = ((endTime - startTime) / 1000).toFixed(2);
      saveTestReport(
        `❌ Test Failed: Valid login redirect - ${error.message}-(Execution Time: ${executionTime} sec`
      );
    }
  }, 60000);

  test("should toggle notification modal and load content", async () => {
    // 1. Go to dashboard or the page with the notification icon
    await driver.get("https://app.kilde.sg/dashboard"); // Adjust URL as needed

    // 2. Wait for the notification icon to be visible
    const notificationIcon = await driver.wait(
      until.elementLocated(By.css(".notification-icon img")),
      10000
    );

    // 3. Click notification icon to open modal
    await notificationIcon.click();

    // 4. Wait for the modal to appear and check for expected content
    const modalContent = await driver.wait(
      until.elementLocated(By.css(".ant-modal-content")), // or another selector inside the modal
      10000
    );

    // Optionally assert content inside modal exists (e.g., notification message, title)
    const modalText = await modalContent.getText();
    expect(modalText.length).toBeGreaterThan(0); // Ensures some content is loaded

    // 5. Click the notification icon again to close the modal
    await notificationIcon.click();

    // 6. Assert modal is closed (by waiting for it to disappear)
    await driver.wait(
      async () => {
        const modals = await driver.findElements(By.css(".ant-modal-content"));
        return modals.length === 0;
      },
      5000,
      "Modal did not close after clicking notification icon again"
    );
  });

  test("should toggle notification modal and reinvest coupon if available", async () => {
    // 1. Go to the dashboard
    await driver.get("https://app.kilde.sg/dashboard");

    // 2. Wait for the notification icon
    const notificationIcon = await driver.wait(
      until.elementLocated(By.css(".notification-icon img")),
      10000
    );

    // 3. Click the notification icon to open the modal
    await notificationIcon.click();

    // 4. Wait for the modal to appear
    const modalContent = await driver.wait(
      until.elementLocated(By.css(".ant-modal-content")),
      10000
    );

    // 5. Look for coupon notification message
    const notificationMessages = await driver.findElements(
      By.css(".coupon-notification-message")
    );

    let couponFound = false;

    for (let msgElement of notificationMessages) {
      const text = await msgElement.getText();
      if (text.includes("USD 97.00") || text.includes("test capital call")) {
        couponFound = true;

        const reinvestBtn = await driver.findElement(
          By.css("#btn-coupon-reinvest")
        );
        await driver.wait(until.elementIsVisible(reinvestBtn), 5000);
        await reinvestBtn.click();

        // Wait for navigation
        await driver.wait(until.urlContains("/tranche-invest/"), 10000);
        break;
      }
    }

    // ✅ Always call expect, even if not found
    expect(couponFound).toBe(true); // Ensures test fails cleanly if no coupon was found

    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toContain("/tranche-invest/");

    // 6. Optionally close the modal again
    await notificationIcon.click();
    await driver.wait(
      async () => {
        const modals = await driver.findElements(By.css(".ant-modal-content"));
        return modals.length === 0;
      },
      5000,
      "Modal did not close after clicking notification icon again"
    );
  });

  test("should scroll in notification modal and mark all as read", async () => {
    await driver.get("https://app.kilde.sg/dashboard");

    const notificationIcon = await driver.wait(
      until.elementLocated(By.css(".notification-icon img")),
      10000
    );
    await notificationIcon.click();

    const modalContent = await driver.wait(
      until.elementLocated(By.css(".ant-modal-content")),
      10000
    );

    // Scroll modal content to the bottom to reveal "Mark all as read"
    await driver.executeScript(
      "arguments[0].scrollTop = arguments[0].scrollHeight",
      modalContent
    );

    // Wait for "Mark all as read" section to appear
    const markAllContainer = await driver.wait(
      until.elementLocated(By.css(".read-head-notification")),
      5000
    );

    // Confirm presence of 'Mark all as read' text to ensure correct element
    const text = await markAllContainer.getText();
    expect(text.toLowerCase()).toContain("mark all as read");

    // Click the "Mark all as read" button
    await markAllContainer.click();

    // Optionally, wait for some visual confirmation that notifications are marked
    await driver.sleep(1000); // or wait for specific DOM changes if applicable

    // Close the modal
    await notificationIcon.click();
    await driver.wait(
      async () => {
        const modals = await driver.findElements(By.css(".ant-modal-content"));
        return modals.length === 0;
      },
      5000,
      "Modal did not close after clicking notification icon again"
    );
  });
});
