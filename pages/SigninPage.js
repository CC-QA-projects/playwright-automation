import { expect } from '@playwright/test';
class SigninPage {
    constructor(page) {
        this.page = page;
        this.signUpLink = 'a#signin2';
        this.modal = '#signInModal';
        this.usernameField = 'input#sign-username';
        this.passwordField = 'input#sign-password';
        this.submitButton = 'button[onclick="register()"]';
        this.expectedMessage = 'Sign up successful.';
    }

    async openSignInModal() {
        await this.page.click(this.signUpLink);
        await this.page.waitForSelector(this.modal);
    }

    async fillSigninForm(username, password) {
        await this.page.fill(this.usernameField, username);
        await this.page.fill(this.passwordField, password);
    }

    async submitSigninForm() {
        await this.page.click(this.submitButton);
    }

    async isModalVisible() {
        return await this.page.isVisible(this.modal);
    }

    async assertSignupDialog(expectedMessage = this.expectedMessage) {
        const dialog = await this.page.waitForEvent('dialog');
        expect(dialog.message()).toBe(expectedMessage);
        await dialog.accept();
    }
}

export { SigninPage };
