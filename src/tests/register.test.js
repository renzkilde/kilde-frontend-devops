require("dotenv").config();
const { Builder, By, until } = require("selenium-webdriver");
const { measurePageLoadTime, waitForUrlChange } = require("./common.test");
const { testDevices } = require("./test.config");
const chrome = require("selenium-webdriver/chrome");

const username = process.env.BROWSERSTACK_USERNAME;
const accessKey = process.env.BROWSERSTACK_ACCESS_KEY;

const productionURL = "https://app.kilde.sg/register?utm_source=browserstack";
const tempEmailURL = "https://tempmail.so/";

async function runTest(capabilities) {
  console.log("⌛️ === AUTOMATED TEST STARTED === ⌛️");

  const driver = await new Builder()
    .usingServer(
      `https://${username}:${accessKey}@hub-cloud.browserstack.com/wd/hub`
    )
    .withCapabilities(capabilities)
    .build();

  try {
    await testRegister(driver, capabilities);
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
      sessionName: `Register - ${new Date().toISOString()}`, // Dynamic session name
    },
  };
  runTest(updatedCapabilities);
});

async function testRegister(driver, capabilities) {
  // Open temporary email service
  await driver.get(tempEmailURL);
  await driver.wait(until.elementLocated(By.id("inbox-name")), 5000); // Wait for the email elements to load

  // Extract the email address from the span element
  const tempEmailElement = await driver.findElement(By.id("inbox-name"));
  const tempEmail = await tempEmailElement.getText();

  // Open registration page in a new tab
  await driver.executeScript("window.open(arguments[0])", productionURL);
  await driver.switchTo().window((await driver.getAllWindowHandles())[1]);

  // Wait for the "Welcome!" element to load
  await driver.wait(
    until.elementLocated(By.css(".kl-pi-title.mb-10.mt-0")),
    10000
  );

  // Fill registration form
  await driver.findElement(By.name("firstName")).sendKeys("BrowserStack");
  await driver.findElement(By.name("lastName")).sendKeys("Automate");
  await driver.findElement(By.name("email")).sendKeys(tempEmail);
  await driver
    .findElement(By.className("form-control"))
    .sendKeys("+91918075353890");
  await driver
    .findElement(By.css('input[name="password"][placeholder="Password"]'))
    .sendKeys(process.env.PASSWORD);
  await driver
    .findElement(
      By.css('input[name="password"][placeholder="Confirm Password"]')
    )
    .sendKeys(process.env.PASSWORD);
  await driver.findElement(By.className("ant-checkbox-input")).click();
  await driver.findElement(By.id("btn-create-account")).click();

  // Switch back to temporary email tab
  await driver.switchTo().window((await driver.getAllWindowHandles())[0]);
  await driver.sleep(10000); // Wait for 10 seconds to load all elements

  // Close the popup if present
  try {
    const closeButton = await driver.findElement(
      By.css('button[popup-modal-close=""]')
    );
    await driver.sleep(5000); // Wait for 5 seconds before clicking
    await closeButton.click();
  } catch (error) {
    // Ignore if the popup is not present
  }

  // Click on the "Kilde" email
  await driver.findElement(By.css(".font-bold.text-base.truncate")).click();

  // Click on the "View In Full Screen" button
  await driver.findElement(By.id("inbox-view-full-screen")).click();
  await driver.sleep(5000); // Wait for 5 seconds to load elements in full screen

  // Click the "Verify Your Email" button
  await driver
    .findElement(By.xpath("//button[contains(text(), 'Verify Your Email')]"))
    .click();

  console.log(
    `✅ Registration and email verification for ${capabilities.deviceName} - PASSED`
  );
}
