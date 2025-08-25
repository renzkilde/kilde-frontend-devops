const { Builder, By, until, Key } = require("selenium-webdriver");
const config = require("./browserstack.config.js");

jest.setTimeout(20000);

describe("Wallet add bank Test on BrowserStack", () => {
  let driver;
  const loginURL = "https://app.kilde.sg/login?utm_source=browserstack";
  const testURL = "https://app.kilde.sg/wallet?utm_source=browserstack";
  const fs = require("fs");
  const path = require("path");

  // Function to save logs to a file
  function saveTestReport(message) {
    const pageName = "Wallet-Add bank page";
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
    driver = await new Builder()
      .usingServer(
        `https://${config.user}:${config.key}@${config.server}/wd/hub`
      )
      .withCapabilities(config.capabilities[0]) // Select the first capability object
      .build();
  }, 40000);

  afterAll(async () => {
    if (driver) await driver.quit();
  });

  //Valid login
  test("Check if valid login redirects to wallet page", async () => {
    const startTime = performance.now();
    try {
      await driver.get(loginURL);

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
      await driver.findElement(By.name("password")).sendKeys("Test@12345");
      await driver.findElement(By.id("btn-continue-login")).click();

      await driver.get(testURL); // Navigate to wallet
      await driver.wait(until.urlContains("/wallet"), 15000);
      expect(await driver.getCurrentUrl()).toContain("/wallet");
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

  // Wallet Balance Test
  test("Check if wallet balance section is displayed", async () => {
    const startTime = performance.now();
    try {
      await driver.get(testURL);

      const balanceSection = await driver.wait(
        until.elementLocated(By.xpath("//*[contains(text(), 'Your Balance')]")),
        20000
      );
      expect(await balanceSection.isDisplayed()).toBe(true);

      expect(
        await driver
          .findElement(
            By.xpath("//*[contains(text(), 'USD')]/following-sibling::p")
          )
          .getText()
      ).toBe("$0");
      expect(
        await driver
          .findElement(
            By.xpath("//*[contains(text(), 'EUR')]/following-sibling::p")
          )
          .getText()
      ).toBe("€0");
      expect(
        await driver
          .findElement(
            By.xpath("//*[contains(text(), 'SGD')]/following-sibling::p")
          )
          .getText()
      ).toBe("S$0");
      const endTime = performance.now(); // End time tracking
      const executionTime = ((endTime - startTime) / 1000).toFixed(2);
      saveTestReport(
        `✅ Test Passed: Wallet balance section is displayed-(Execution Time: ${executionTime} sec`
      );
    } catch (error) {
      const endTime = performance.now(); // End time tracking
      const executionTime = ((endTime - startTime) / 1000).toFixed(2);
      saveTestReport(
        `❌ Test Failed: Wallet balance section - ${error.message}-(Execution Time: ${executionTime} sec`
      );
    }
  });

  // Bank Details Test
  test("Check if Bank Details section is displayed", async () => {
    const startTime = performance.now();
    try {
      await driver.get(testURL);

      // Wait for the Bank Details section
      const bankDetailsSection = await driver.wait(
        until.elementLocated(By.xpath("//*[contains(text(), 'Bank Details')]")),
        30000
      );
      expect(await bankDetailsSection.isDisplayed()).toBe(true);

      // Wait for Add Bank icon
      const addBankIcon = await driver.wait(
        until.elementLocated(
          By.xpath("//img[contains(@alt, 'add_bank_account')]")
        ),
        15000
      );
      expect(await addBankIcon.isDisplayed()).toBe(true);

      // Save test success report
      const endTime = performance.now();
      const executionTime = ((endTime - startTime) / 1000).toFixed(2);
      saveTestReport(
        `✅ Test Passed: Bank Details section is displayed - (Execution Time: ${executionTime} sec)`
      );
    } catch (error) {
      const endTime = performance.now();
      const executionTime = ((endTime - startTime) / 1000).toFixed(2);
      saveTestReport(
        `❌ Test Failed: Bank Details section - ${error.message} (Execution Time: ${executionTime} sec)`
      );
      throw error;
    }
  });

  // Add Bank Modal Test
  test("Check if Add Bank Details modal opens when clicking Add Bank", async () => {
    const startTime = performance.now();
    try {
      await driver.get(testURL);

      const addBankButton = await driver.wait(
        until.elementLocated(
          By.xpath("//img[contains(@alt, 'add_bank_account')]")
        ),
        10000
      );
      await addBankButton.click();

      const modal = await driver.wait(
        until.elementLocated(By.className("ant-modal-content")),
        10000
      );
      expect(await modal.isDisplayed()).toBe(true);

      const modalTitle = await driver.wait(
        until.elementLocated(
          By.xpath("//*[contains(text(), 'Add your bank details')]")
        ),
        10000
      );
      expect(await modalTitle.isDisplayed()).toBe(true);
      const endTime = performance.now(); // End time tracking
      const executionTime = ((endTime - startTime) / 1000).toFixed(2);
      saveTestReport(
        `✅ Test Passed: Add Bank Details modal opens when clicking Add Bank-(Execution Time: ${executionTime} sec`
      );
    } catch (error) {
      const endTime = performance.now(); // End time tracking
      const executionTime = ((endTime - startTime) / 1000).toFixed(2);
      saveTestReport(
        `❌ Test Failed: Add Bank Details modal open - ${error.message}-(Execution Time: ${executionTime} sec`
      );
    }
  });

  // Modal Cancel Test
  test("Check if Add Bank Details modal closes when clicking Cancel", async () => {
    const startTime = performance.now();
    try {
      await driver.get(testURL);

      const addBankButton = await driver.wait(
        until.elementLocated(
          By.xpath("//img[contains(@alt, 'add_bank_account')]")
        ),
        10000
      );
      await addBankButton.click();

      const modal = await driver.wait(
        until.elementLocated(By.className("ant-modal-content")),
        10000
      );
      expect(await modal.isDisplayed()).toBe(true);

      const cancelButton = await driver.wait(
        until.elementLocated(By.xpath("//button/span[text()='Cancel']")),
        10000
      );
      await cancelButton.click();

      await driver.wait(until.stalenessOf(modal), 10000);
      expect(
        (await driver.findElements(By.className("ant-modal-content"))).length
      ).toBe(0);
      const endTime = performance.now(); // End time tracking
      const executionTime = ((endTime - startTime) / 1000).toFixed(2);
      saveTestReport(
        `✅ Test Passed: Add Bank modal closes on Cancel-(Execution Time: ${executionTime} sec`
      );
    } catch (error) {
      const endTime = performance.now(); // End time tracking
      const executionTime = ((endTime - startTime) / 1000).toFixed(2);
      saveTestReport(
        `❌ Test Failed: Add Bank modal Cancel - ${error.message}-(Execution Time: ${executionTime} sec`
      );
    }
  });

  //if error messages appear when clicking Add Bank Details without filling the form
  test("Check if error messages appear when clicking Add Bank Details without filling the form", async () => {
    const startTime = performance.now();
    try {
      await driver.get(testURL);

      // Open the Add Bank Details modal
      const addBankButton = await driver.wait(
        until.elementLocated(
          By.xpath("//img[contains(@alt, 'add_bank_account')]")
        ),
        10000
      );
      await addBankButton.click();

      // Wait for modal to appear
      const modal = await driver.wait(
        until.elementLocated(By.className("ant-modal-content")),
        10000
      );
      expect(await modal.isDisplayed()).toBe(true);

      // Click "Add Bank Details" button without filling the form
      const submitButton = await driver.wait(
        until.elementLocated(
          By.xpath("//button/span[text()='Add Bank Details']")
        ),
        10000
      );
      await submitButton.click();

      // Validate error messages
      const bankNameError = await driver.wait(
        until.elementLocated(
          By.xpath("//span[contains(text(), 'Bank name is required')]")
        ),
        5000
      );
      expect(await bankNameError.isDisplayed()).toBe(true);

      const accountNumberError = await driver.wait(
        until.elementLocated(
          By.xpath("//span[contains(text(), 'Account number is required')]")
        ),
        5000
      );
      expect(await accountNumberError.isDisplayed()).toBe(true);

      const swiftCodeError = await driver.wait(
        until.elementLocated(
          By.xpath("//span[contains(text(), 'SWIFT code is required')]")
        ),
        5000
      );
      expect(await swiftCodeError.isDisplayed()).toBe(true);

      const accountHolderNameError = await driver.wait(
        until.elementLocated(
          By.xpath(
            "//span[contains(text(), 'Account holder name is required')]"
          )
        ),
        5000
      );
      expect(await accountHolderNameError.isDisplayed()).toBe(true);
      const endTime = performance.now(); // End time tracking
      const executionTime = ((endTime - startTime) / 1000).toFixed(2);
      saveTestReport(
        ` ✅ Test Passed: Error messages appear when clicking 'Add Bank Details' without filling the form-(Execution Time: ${executionTime} sec`
      );
    } catch (error) {
      const endTime = performance.now(); // End time tracking
      const executionTime = ((endTime - startTime) / 1000).toFixed(2);
      saveTestReport(
        `❌ Test Failed: Error messages on empty form - ${error.message}-(Execution Time: ${executionTime} sec`
      );
    }
  });

  //Verify SWIFT Code autofills when a bank name is selected
  test("Verify SWIFT Code autofills when a bank name is selected", async () => {
    const startTime = performance.now();
    try {
      await driver.get(testURL);

      // Open the Add Bank Details modal
      const addBankButton = await driver.wait(
        until.elementLocated(
          By.xpath("//img[contains(@alt, 'add_bank_account')]")
        ),
        10000
      );
      await addBankButton.click();

      // Wait for the modal to appear
      const modal = await driver.wait(
        until.elementLocated(By.className("ant-modal-content")),
        10000
      );
      expect(await modal.isDisplayed()).toBe(true);

      // Click the Bank Name dropdown
      const bankDropdown = await driver.wait(
        until.elementLocated(By.id("rc_select_1")),
        5000
      );
      await bankDropdown.click();

      const bankOption = await driver.wait(
        until.elementLocated(
          By.xpath(
            "//div[contains(@class, 'ant-select-item') and contains(text(), 'DBS Bank')]"
          )
        ),
        5000
      );

      // Ensure the element is visible and clickable
      await driver.wait(until.elementIsVisible(bankOption), 5000);

      // Click the DBS Bank option
      await bankOption.click();

      // Verify the SWIFT Code field auto-fills with "DBSSSGSG"
      const swiftCodeInput = await driver.wait(
        until.elementLocated(By.name("swiftCode")),
        5000
      );
      const swiftValue = await swiftCodeInput.getAttribute("value");
      expect(swiftValue).toBe("DBSSSGSG");
      const endTime = performance.now(); // End time tracking
      const executionTime = ((endTime - startTime) / 1000).toFixed(2);
      saveTestReport(
        `✅ Test Passed: SWIFT Code auto-filled correctly when selecting DBS Bank-(Execution Time: ${executionTime} sec`
      );
    } catch (error) {
      const endTime = performance.now(); // End time tracking
      const executionTime = ((endTime - startTime) / 1000).toFixed(2);
      saveTestReport(
        `❌ Test Failed: SWIFT Code autofill error - ${error.message}-(Execution Time: ${executionTime} sec`
      );
    }
  });

  //Verify error message when account number is less than 5 characters
  test("Verify error message when account number is less than 5 characters", async () => {
    const startTime = performance.now();
    try {
      await driver.get(testURL);

      // Open the Add Bank Details modal
      const addBankButton = await driver.wait(
        until.elementLocated(
          By.xpath("//img[contains(@alt, 'add_bank_account')]")
        ),
        10000
      );
      await addBankButton.click();

      // Wait for the modal to appear
      const modal = await driver.wait(
        until.elementLocated(By.className("ant-modal-content")),
        10000
      );
      expect(await modal.isDisplayed()).toBe(true);

      const bankDropdown = await driver.wait(
        until.elementLocated(By.id("rc_select_1")),
        5000
      );
      await bankDropdown.click();

      const bankOption = await driver.wait(
        until.elementLocated(
          By.xpath(
            "//div[contains(@class, 'ant-select-item') and contains(text(), 'DBS Bank')]"
          )
        ),
        5000
      );

      // Ensure the element is visible and clickable
      await driver.wait(until.elementIsVisible(bankOption), 5000);

      // Click the DBS Bank option
      await bankOption.click();

      // Find the Account Number input field
      const accountNumberInput = await driver.wait(
        until.elementLocated(By.name("accountNumber")),
        5000
      );

      // Enter an invalid account number (less than 5 characters)
      await accountNumberInput.clear();

      await accountNumberInput.sendKeys("23");
      await driver
        .findElement(By.name("accountHolderName"))
        .sendKeys("John Doe");

      // Click "Add Bank Details" button without filling the form
      const submitButton = await driver.wait(
        until.elementLocated(
          By.xpath("//button/span[text()='Add Bank Details']")
        ),
        10000
      );
      await submitButton.click();

      // Wait for the error message to appear
      const errorMessage = await driver.wait(
        until.elementLocated(
          By.xpath(
            "//span[contains(text(), 'Account number must be at least 5 characters long.')]"
          )
        ),
        5000
      );

      // Verify the error message is displayed
      expect(await errorMessage.isDisplayed()).toBe(true);
      const endTime = performance.now(); // End time tracking
      const executionTime = ((endTime - startTime) / 1000).toFixed(2);
      saveTestReport(
        `✅ Test Passed: Error message displayed when account number is less than 5 characters-(Execution Time: ${executionTime} sec`
      );
    } catch (error) {
      const endTime = performance.now(); // End time tracking
      const executionTime = ((endTime - startTime) / 1000).toFixed(2);
      saveTestReport(
        `❌ Test Failed: Error message did not appear - ${error.message}-(Execution Time: ${executionTime} sec`
      );
    }
  });

  //Verify bank details submission and success notification
  test("Verify bank details submission and success notification", async () => {
    const startTime = performance.now();
    try {
      // Ensure no modal is open before clicking
      await driver.wait(async () => {
        const modals = await driver.findElements(
          By.className("ant-modal-content")
        );
        return modals.length === 0;
      }, 10000);

      // Open the Add Bank Details modal
      const addBankButton = await driver.wait(
        until.elementLocated(
          By.xpath("//img[contains(@alt, 'add_bank_account')]")
        ),
        10000
      );

      // Ensure button is visible & clickable
      await driver.executeScript(
        "arguments[0].scrollIntoView();",
        addBankButton
      );
      await driver.wait(until.elementIsVisible(addBankButton), 5000);
      await driver.executeScript("arguments[0].click();", addBankButton); // Use JS click

      // Wait for modal to appear
      const modal = await driver.wait(
        until.elementLocated(By.className("ant-modal-content")),
        10000
      );
      expect(await modal.isDisplayed()).toBe(true);

      // Enter bank details
      const bankDropdown = await driver.wait(
        until.elementLocated(By.id("rc_select_1")),
        5000
      );
      await bankDropdown.click();

      const bankOption = await driver.wait(
        until.elementLocated(
          By.xpath(
            "//div[contains(@class, 'ant-select-item') and contains(text(), 'DBS Bank')]"
          )
        ),
        5000
      );
      await driver.wait(until.elementIsVisible(bankOption), 5000);
      await bankOption.click();

      await driver.findElement(By.name("accountNumber")).sendKeys("123456");
      await driver
        .findElement(By.name("accountHolderName"))
        .sendKeys("John Doe");

      // Click the "Add Bank Details" button
      const submitButton = await driver.wait(
        until.elementLocated(
          By.xpath("//button[span[text()='Add Bank Details']]")
        ),
        5000
      );
      await driver.wait(until.elementIsVisible(submitButton), 5000);
      await driver.wait(until.elementIsEnabled(submitButton), 5000);
      await submitButton.click();

      // Wait for the modal to close
      await driver.wait(async () => {
        try {
          return !(await modal.isDisplayed());
        } catch (err) {
          return true; // If modal is not found, consider it closed
        }
      }, 10000);

      // Verify success notification appears
      const successNotification = await driver.wait(
        until.elementLocated(
          By.xpath("//div[contains(@class, 'ant-notification-notice-success')]")
        ),
        10000
      );

      const successMessage = await successNotification.findElement(
        By.xpath(
          ".//div[contains(text(), 'Your banking information has been submitted successfully.')]"
        )
      );

      expect(await successNotification.isDisplayed()).toBe(true);
      expect(await successMessage.getText()).toContain(
        "Your banking information has been submitted successfully."
      );

      const endTime = performance.now(); // End time tracking
      const executionTime = ((endTime - startTime) / 1000).toFixed(2);

      saveTestReport(
        `✅ Test Passed: Modal closed and success notification appeared.-(Execution Time: ${executionTime} sec`
      );
    } catch (error) {
      const endTime = performance.now(); // End time tracking
      const executionTime = ((endTime - startTime) / 1000).toFixed(2);
      saveTestReport(
        `❌ Test Failed: ${error.message}-(Execution Time: ${executionTime} sec`
      );
      console.error("Error details:", error);
    }
  });
});
