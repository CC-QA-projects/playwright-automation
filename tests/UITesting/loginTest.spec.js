import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage.js';
import { readCredentials } from '../../utils/excelReader.js';

// Use the default credentials path from the utility (project root `testData/LoginTest.xlsx`)
const credentials = readCredentials();

test.beforeEach(async ({ page }) => {
  await page.goto('https://demoblaze.com/');
});


test('Login to demoblaze and assert successful login', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.openLoginModal();
  await loginPage.login('CalvinTEST1233', 'testing123');
  await loginPage.isWelcomeUsernameVisible();

});

for (const { username, password } of credentials) {
  test(`Using DDT to Login to demoblaze and assert successful login for ${username}`, async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.openLoginModal();
    await loginPage.login(username, password);
    await loginPage.isWelcomeUsernameVisible();
  })
}


