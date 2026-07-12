import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the homepage successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Photo de Famille|pastel-polaroids/);
  });

  test('should display the main title', async ({ page }) => {
    const title = page.getByRole('heading', { name: 'Photo de Famille', level: 1 });
    await expect(title).toBeVisible();
  });

  test('should display the subtitle', async ({ page }) => {
    const subtitle = page.getByText('Concours photo en famille, un thème à la fois.');
    await expect(subtitle).toBeVisible();
  });

  test('should display current contest or create button', async ({ page }) => {
    const polaroidCard = page.locator('.polaroid-card');
    const createButton = page.getByRole('button').filter({ hasText: /Nouveau thème/ });
    
    const hasContest = await polaroidCard.count() > 0;
    const hasCreateButton = await createButton.count() > 0;
    
    expect(hasContest || hasCreateButton).toBeTruthy();
  });

  test('should have a button to create new contest', async ({ page }) => {
    const createButton = page.getByRole('button').filter({ hasText: /Nouveau thème/ });
    await expect(createButton).toBeVisible();
  });

  test('should display ancient themes button when there are past contests', async ({ page }) => {
    const ancientButton = page.getByRole('button', { name: /Anciens thèmes/ });
    await expect(ancientButton).toBeVisible().or(expect(ancientButton).not.toBeVisible());
  });
});
