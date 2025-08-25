const measurePageLoadTime = async (driver, capabilities, url, count) => {
  const startTime = new Date().getTime();
  await driver.get(url);
  const endTime = new Date().getTime();
  const pageLoadTime = endTime - startTime;
  console.log(
    `✅ TEST CASE ${count}: ${capabilities.name}: ${pageLoadTime} ms - PASSED`
  );
};

async function waitForUrlChange(driver, timeout = 10000) {
  const originalUrl = await driver.getCurrentUrl();

  await driver.wait(async () => {
    const currentUrl = await driver.getCurrentUrl();
    return currentUrl !== originalUrl;
  }, timeout);
}

module.exports = {
  measurePageLoadTime,
  waitForUrlChange,
};
