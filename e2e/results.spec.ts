import { test, expect, setupScenario, SCENARIOS } from './testUtils';

test.describe('Results Page', () => {
  test.beforeEach(async ({ page }) => {
    // Use all-closed scenario for results page tests
    await setupScenario(page, SCENARIOS.ALL_CLOSED);
    await page.goto('/photos');
  });

  test('should load results page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Photo de Famille|pastel-polaroids/);
    await expect(page.getByRole('heading', { name: 'Résultats' })).toBeVisible();
  });

  test('should display summary information', async ({ page }) => {
    // Should display the number of photos and closed contests
    const summary = page.getByText(/\d+ photo/);
    await expect(summary).toBeVisible();
  });

  test('should display photos grid', async ({ page }) => {
    const photoGrid = page.locator('.grid');
    await expect(photoGrid).toBeVisible();
  });

  test('should display winner badges on winning photos', async ({ page }) => {
    // In the all-closed scenario, there should be winning photos
    const winnerBadges = page.getByText('Gagnant');
    await expect(winnerBadges).toHaveCountGreaterThanOrEqual(1);
  });

  test('should display star ratings on photos', async ({ page }) => {
    // Photos should display their average rating with stars
    const starDisplays = page.locator('.display-stars');
    await expect(starDisplays).toHaveCountGreaterThanOrEqual(1);
  });

  test('should have winners only filter', async ({ page }) => {
    const filterButton = page.getByRole('button', { name: /Voir seulement les photos gagnantes/ });
    await expect(filterButton).toBeVisible();
  });

  test('should filter to show only winners when clicking filter', async ({ page }) => {
    const filterButton = page.getByRole('button', { name: /Voir seulement les photos gagnantes/ });
    await filterButton.click();
    
    // Button text should change to "Voir toutes les photos"
    await expect(page.getByRole('button', { name: 'Voir toutes les photos' })).toBeVisible();
    
    // All visible photos should have winner badge
    const photoCards = page.locator('.polaroid-card');
    const visibleCards = await photoCards.count();
    
    if (visibleCards > 0) {
      const winnerBadges = page.getByText('Gagnant');
      await expect(winnerBadges).toHaveCount(visibleCards);
    }
  });

  test('should show contest filter buttons', async ({ page }) => {
    // Should display filter buttons for each closed contest
    const contestFilterButtons = page.getByRole('button').filter({ 
      hasText: /\d+$/ 
    });
    await expect(contestFilterButtons).toHaveCountGreaterThanOrEqual(1);
  });

  test('should display trophy icon', async ({ page }) => {
    const trophyIcon = page.locator('svg').filter({ hasText: /Trophy/ });
    await expect(trophyIcon).toHaveCount(1);
  });

  test('should navigate back to homepage', async ({ page }) => {
    const backLink = page.getByRole('link', { name: /Retour/ });
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveAttribute('href', '/');
  });

  test('should open photo detail modal on click', async ({ page }) => {
    const photoCards = page.locator('.polaroid-card');
    const firstCard = photoCards.first();
    
    await firstCard.click();
    
    // Should open modal with photo details
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();
    
    // Modal should display photo information
    await expect(modal.getByText(/Titre|Description/)).toBeVisible();
  });
});
