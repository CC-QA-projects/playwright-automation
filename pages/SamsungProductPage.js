import { expect } from '@playwright/test';

class SamsungProductPage {

    constructor(page) {
        this.page = page;
        page.once('dialog', dialog => {
            console.log(`Dialog message: ${dialog.message()}`);
            dialog.dismiss().catch(() => { });
        });
        this.addToCartButton = page.getByRole('link', { name: 'Add to cart' });
        this.cartLink = page.getByRole('link', { name: 'Cart', exact: true });
    }
    async clickAddToCart() {
        await this.addToCartButton.click();
    }
    async clickCartLink() {
        await this.cartLink.click();
    }
}

export { SamsungProductPage };