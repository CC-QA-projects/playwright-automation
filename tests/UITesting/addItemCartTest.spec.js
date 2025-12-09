import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage.js';
import { CartPage } from '../../pages/CartPage.js';
import { SamsungProductPage } from '../../pages/SamsungProductPage.js';

  test.beforeEach(async ({ page }) => {
    await page.goto('https://demoblaze.com/');
  });

test('User adds an item to the cart and proceeds to checkout', async ({ page }) => {
    const homePage = new HomePage(page); 
    const cartPage = new CartPage(page);
    const samsungProductPage = new SamsungProductPage(page);
    
    await homePage.clickSamsungGalaxyS6(); 
    await samsungProductPage.clickAddToCart();
    await samsungProductPage.clickCartLink();
    await cartPage.clickPlaceOrder();   
    await cartPage.fillForm();
    await cartPage.clickPurchaseButton();
    await cartPage.verifyPurchase();
    await cartPage.clickOkbutton();
})
