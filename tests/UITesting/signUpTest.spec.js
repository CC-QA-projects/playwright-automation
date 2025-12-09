import { test, expect } from '@playwright/test';
import { SigninPage } from '../../pages/SigninPage.js';

test.beforeEach(async ({ page }) => {
    await page.goto('https://demoblaze.com/');
});


test.skip('Sign in with valid user credentials', async ({ page }) => {
    const signinPage = new SigninPage(page);

    await signinPage.openSignInModal();
    await signinPage.isModalVisible();
    await signinPage.fillSigninForm('CalvinTEST1233', 'testing123');
    await signinPage.submitSigninForm();
    await signinPage.assertSignupDialog();
})

test.skip('Sign in with valid user 2 credentials', async ({ page }) => {
    const signinPage = new SigninPage(page);
    await signinPage.openSignInModal();
    await signinPage.isModalVisible();
    await signinPage.fillSigninForm('CalvinTEST2333', 'testing123');
    await signinPage.submitSigninForm();
    await signinPage.assertSignupDialog();
})