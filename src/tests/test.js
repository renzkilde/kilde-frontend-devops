const { Builder, By, until } = require("selenium-webdriver");

const username = "testsreerag_fPS86YiUT";
const accessKey = "8m1Et7b7uFfL3ikZ7utg";

async function runTest() {
  const driver = await new Builder()
    .usingServer(
      `https://${username}:${accessKey}@hub-cloud.browserstack.com/wd/hub`
    )
    .withCapabilities({
      browserName: "chrome",
      "browserstack.local": "false",
      "browserstack.selenium_version": "3.141.59",
      os: "Windows",
      os_version: "10",
      browser_version: "latest",
      name: "React Test on BrowserStack",
    })
    .build();

  try {
    await driver.get("https://app.kilde.sg/login");

    const heading = await driver.findElement(
      By.className("kl-pi-title mb-10 mt-0")
    );
    await driver.wait(until.elementTextIs(heading, "Welcome!"), 10000);

    console.log("😎 TEST PASSED 😎");
  } catch (error) {
    console.error("❌ TEST FAILED ❌", error);
  } finally {
    await driver.quit();
  }
}

runTest();
