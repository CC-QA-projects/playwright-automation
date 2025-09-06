const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage'); 

const path = require('path');
const { readCredentials } = require('../utils/excelreader');
const filePath = path.join(__dirname, '../testData/LoginTest.xlsx');
const credentials = readCredentials(filePath);

test.beforeEach(async ({ page }) => {
    await page.goto('https://demoblaze.com/');
  });


test.skip('Login to demoblaze and assert successful login', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.openLoginModal();
  await loginPage.login('CalvinTEST', 'testing123');

  const welcomeText = await loginPage.getWelcomeText();
  expect(welcomeText).toContain('Welcome CalvinTEST');
});

for (const { username, password } of credentials) {
  test(`Using DDT to Login to demoblaze and assert successful login for ${username}`, async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.openLoginModal();
    await loginPage.login(username, password);

    const welcomeText = await loginPage.getWelcomeText();
    expect(welcomeText).toContain(`Welcome ${username}`);
  })
}


