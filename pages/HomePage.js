import { expect } from '@playwright/test';

class HomePage {

  constructor(page) {
    this.page = page;

    this.samsungLink = page.getByRole('link', { name: 'Samsung galaxy s6' });

  }

  async clickSamsungGalaxyS6() {
    await this.samsungLink.click();
  }
}

export { HomePage };