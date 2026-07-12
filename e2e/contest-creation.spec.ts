import { test, expect, setupScenario, SCENARIOS } from './testUtils';

test.describe('Contest Creation', () => {
  test.beforeEach(async ({ page }) => {
    // Use empty scenario for contest creation tests
    await setupScenario(page, SCENARIOS.EMPTY);
  });

  test('should open contest creation modal when clicking create button', async ({ page }) => {
    const createButton = page.getByRole('button').filter({ hasText: /Nouveau thème/ });
    await createButton.click();
    
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();
    
    const title = page.getByRole('heading', { name: 'Créer un thème' });
    await expect(title).toBeVisible();
  });

  test('should display form fields in creation modal', async ({ page }) => {
    const createButton = page.getByRole('button').filter({ hasText: /Nouveau thème/ });
    await createButton.click();
    
    // Check all form fields are visible
    await expect(page.getByLabel('Titre')).toBeVisible();
    await expect(page.getByLabel(/Description/)).toBeVisible();
    await expect(page.getByLabel(/Photo d'illustration/)).toBeVisible();
    await expect(page.getByLabel(/Soumission/)).toBeVisible();
    await expect(page.getByLabel(/Vote/)).toBeVisible();
    
    // Check buttons
    await expect(page.getByRole('button', { name: 'Annuler' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Créer' })).toBeVisible();
  });

  test('should show error when submitting empty form', async ({ page }) => {
    const createButton = page.getByRole('button').filter({ hasText: /Nouveau thème/ });
    await createButton.click();
    
    const submitButton = page.getByRole('button', { name: 'Créer' });
    await submitButton.click();
    
    const error = page.getByRole('alert');
    await expect(error).toBeVisible();
    await expect(error).toContainText('Le titre du thème est requis.');
  });

  test('should show error when submission or vote days are less than 1', async ({ page }) => {
    const createButton = page.getByRole('button').filter({ hasText: /Nouveau thème/ });
    await createButton.click();
    
    // Fill name but set days to 0
    await page.getByLabel('Titre').fill('Test Contest');
    await page.getByLabel('Soumission').fill('0');
    await page.getByLabel('Vote').fill('0');
    
    const submitButton = page.getByRole('button', { name: 'Créer' });
    await submitButton.click();
    
    const error = page.getByRole('alert');
    await expect(error).toBeVisible();
    await expect(error).toContainText('Les durées doivent être ≥ 1 jour.');
  });

  test('should create a new contest successfully', async ({ page }) => {
    const createButton = page.getByRole('button').filter({ hasText: /Nouveau thème/ });
    await createButton.click();
    
    // Fill the form with valid data
    await page.getByLabel('Titre').fill('Concours Test E2E');
    await page.getByLabel('Description').fill('Un concours de test pour E2E');
    await page.getByLabel('Soumission').fill('15');
    await page.getByLabel('Vote').fill('3');
    
    const submitButton = page.getByRole('button', { name: 'Créer' });
    await submitButton.click();
    
    // Should be redirected to contest detail page
    await expect(page).toHaveURL(/\/contest\//);
    
    // Should display contest name
    await expect(page.getByText('Concours Test E2E')).toBeVisible();
  });

  test('should cancel contest creation', async ({ page }) => {
    const createButton = page.getByRole('button').filter({ hasText: /Nouveau thème/ });
    await createButton.click();
    
    const cancelButton = page.getByRole('button', { name: 'Annuler' });
    await cancelButton.click();
    
    const modal = page.getByRole('dialog');
    await expect(modal).not.toBeVisible();
    
    // Should still be on homepage
    await expect(page).toHaveURL('/');
  });
});
