const { test, expect } = require('@playwright/test');
const { SigninPage } = require('../pages/SigninPage');

test.beforeEach(async ({ page }) => {
    await page.goto('https://demoblaze.com/');
});


test('Sign in with valid credentials', async ({ page }) => {
    const signinPage = new SigninPage(page);

    await signinPage.openSignInModal();

    // Wait for the modal to be visible
    await signinPage.isModalVisible();

    // Fill in the username and password fields
    await signinPage.fillSigninForm('CalvinTEST1', 'testing123');

    // Submit the form
    await signinPage.submitSigninForm();

    // Assert that the sign in was successful
    await signinPage.assertSignupDialog();
})

test('Sign in with valid credentials 2', async ({ page }) => {
    const signinPage = new SigninPage(page);

    await signinPage.openSignInModal();

    // Wait for the modal to be visible
    await signinPage.isModalVisible();

    // Fill in the username and password fields
    await signinPage.fillSigninForm('CalvinTEST2', 'testing123');

    // Submit the form
    await signinPage.submitSigninForm();

    // Assert that the sign in was successful
    await signinPage.assertSignupDialog();
});