import { expect } from '@playwright/test';

class CartPage {
    constructor(page) {
        this.page = page;
        this.placeOrderButton = page.getByRole('button', { name: 'Place Order' });
        this.nameField = page.getByRole('textbox', { name: 'Total: 360 Name:' });
        this.countryField = page.getByRole('textbox', { name: 'Country:' });
        this.cityField = page.getByRole('textbox', { name: 'City:' });
        this.creditCardField = page.getByRole('textbox', { name: 'Credit card:' });
        this.monthField = page.getByRole('textbox', { name: 'Month:' });
        this.yearField = page.getByRole('textbox', { name: 'Year:' });
        this.purchaseButton = page.getByRole('button', { name: 'Purchase' });
        this.okButton = page.getByRole('button', { name: 'OK' });

    }
    async clickPlaceOrder() {
        await this.placeOrderButton.click();
    }
    async fillForm() {
        await this.nameField.fill('Calvin');
        await this.countryField.fill('Canada');
        await this.cityField.fill('Toronto');
        await this.creditCardField.fill('12345678');
        await this.monthField.fill('August');
        await this.yearField.fill('2025');
        await this.purchaseButton.click();
    }

    async clickPurchaseButton() {
        await this.purchaseButton.click();
    }
    async verifyPurchase() { 
        await expect(this.page.locator('body')).toContainText('Thank you for your purchase!');
    }

    async clickOkbutton() {
        await this.okButton.click();
    }
}

export { CartPage };