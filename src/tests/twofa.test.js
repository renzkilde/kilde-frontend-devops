const { Builder, By, until } = require("selenium-webdriver");
const config = require("./browserstack.config.js");

jest.setTimeout(20000);

describe("Login Page Test on BrowserStack", () => {
  let driver;

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

  test("Check if 'Welcome back!' is displayed", async () => {
    await driver.get("https://dev.kilde.sg/login?utm_source=browserstack");

    const welcomeElement = await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(), 'Welcome back!')]")),
      50000
    );

    const text = await welcomeElement.getText();
    expect(text).toBe("Welcome back!");
  });

  test("Query device info", async () => {
    const deviceInfo = await driver.executeScript(
      'browserstack_executor: {"action": "deviceInfo", "arguments": {"deviceProperties": ["simOptions"]}}'
    );
    console.log(deviceInfo);
  });
});
