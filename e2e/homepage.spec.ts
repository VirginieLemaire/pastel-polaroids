import { test, expect, setupScenario, SCENARIOS } from './testUtils';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    // Use default scenario for homepage tests (one-active-rest-closed)
    await setupScenario(page, SCENARIOS.ONE_ACTIVE_REST_CLOSED);
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
    // Either a contest card (brutal-border div with specific size) or the create button text should be visible
    const contestCard = page.locator('div.brutal-border.w-64').first();
    const createButtonText = page.getByText('Nouveau thème');
    
    const contestCardOrButton = contestCard.or(createButtonText);
    await expect(contestCardOrButton).toBeVisible({ timeout: 5000 });
  });

  test('should have a button to create new contest when no active contest', async ({ page }) => {
    // This test checks the button appears when there's no active contest
    // We use empty scenario for this
    await setupScenario(page, SCENARIOS.EMPTY);
    
    // Find button by aria-label since the visible text is "+" which might not be accessible
    const createButton = page.getByRole('button', { name: 'Créer un nouveau thème' });
    await expect(createButton).toBeVisible();
    
    // Also check the visible "+" symbol and "Nouveau thème" text
    await expect(page.getByText('＋')).toBeVisible();
    await expect(page.getByText('Nouveau thème')).toBeVisible();
  });

  test('should display ancient themes button when there are past contests', async ({ page }) => {
    const ancientButton = page.getByRole('button', { name: /Anciens thèmes/ });
    await expect(ancientButton).toBeVisible();
  });
});
