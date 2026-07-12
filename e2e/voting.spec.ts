import { test, expect, setupScenario, SCENARIOS } from './testUtils';

test.describe('Voting', () => {
  test.beforeEach(async ({ page }) => {
    // Use one-active-vote scenario for voting tests
    await setupScenario(page, SCENARIOS.ONE_ACTIVE_VOTE);
  });

  test('should display contest in vote phase', async ({ page }) => {
    // The scenario has contest "mock-1" in vote phase
    // It should be visible on the homepage
    const polaroidCards = page.locator('.polaroid-card');
    await expect(polaroidCards).toHaveCountGreaterThanOrEqual(1);
  });

  test('should navigate to contest photos page', async ({ page }) => {
    // Navigate to the contest photos page
    // In the scenario, mock-1 is the active contest in vote phase
    await page.goto('/contest/mock-1/photos');
    
    // Should display the photos page
    await expect(page.getByText(/Photos du thème/)).toBeVisible();
  });

  test('should display vote stars on photos', async ({ page }) => {
    await page.goto('/contest/mock-1/photos');
    
    // In vote phase, photos should display empty stars for voting
    const voteStars = page.getByRole('group', { name: /Noter la photo/ });
    await expect(voteStars).toHaveCountGreaterThanOrEqual(1);
  });

  test('should have 5 star buttons for voting', async ({ page }) => {
    await page.goto('/contest/mock-1/photos');
    
    const firstVoteGroup = page.getByRole('group', { name: /Noter/ }).first();
    const stars = firstVoteGroup.getByRole('button');
    
    await expect(stars).toHaveCount(5);
    
    // Each star should have aria-label with rating value
    for (let i = 1; i <= 5; i++) {
      await expect(stars.nth(i - 1)).toHaveAttribute('aria-label', new RegExp(`${i} sur 5`));
    }
  });

  test('should allow clicking on stars to rate', async ({ page }) => {
    await page.goto('/contest/mock-1/photos');
    
    // In the mock scenario, user-1 (current user) can vote for photo-2 (by user-2)
    // Find the vote group for photo-2
    const voteGroups = page.getByRole('group', { name: /Noter/ });
    
    if (await voteGroups.count() > 0) {
      // Click on the 4th star (rating of 4) of the first votable photo
      const firstGroup = voteGroups.first();
      const star4 = firstGroup.getByRole('button').nth(3); // 4th star (index 3)
      
      await star4.click();
      
      // The star should now be highlighted (filled)
      await expect(star4).toHaveClass(/text-yellow-500/);
    }
  });

  test('should display status badge as vote phase', async ({ page }) => {
    await page.goto('/contest/mock-1/photos');
    
    const statusBadge = page.getByText('vote');
    await expect(statusBadge).toBeVisible();
  });
});
