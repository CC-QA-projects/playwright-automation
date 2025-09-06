const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');

  test.beforeEach(async ({ page }) => {
    await page.goto('https://demoblaze.com/');
  });

test('User logs in and then logs out', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.openLoginModal();
    await loginPage.isLoginmodalVisible();
    await loginPage.login('CalvinTEST', 'testing123');
    await loginPage.isWelcomeUsernameVisible();
    await loginPage.clickLogout();
    await loginPage.isSignupLinkVisible();
    await loginPage.isLoginLinkVisible();

})
