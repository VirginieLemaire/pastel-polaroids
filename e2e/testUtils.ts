import { test as base, expect } from '@playwright/test';
import { MOCK_SCENARIOS, type MockScenario, setStoredScenarioId, getScenarioById } from '../src/dev/mockScenarios';

// Export all scenarios for reuse across test files
export { MOCK_SCENARIOS, MockScenario, getScenarioById, expect };

// Scenario IDs as const for type safety
export const SCENARIOS = {
  EMPTY: 'empty',
  ONE_ACTIVE_SUBMISSION: 'one-active-submission',
  ONE_ACTIVE_VOTE: 'one-active-vote',
  ONE_ACTIVE_REST_CLOSED: 'one-active-rest-closed',
  ALL_CLOSED: 'all-closed',
} as const;

// Type for scenario IDs
export type ScenarioId = keyof typeof SCENARIOS;

/**
 * Custom test fixture that provides scenario setup utilities
 */
export const test = base.extend({
  /**
   * Set up a specific mock scenario in localStorage
   * @param scenarioId - The ID of the scenario to set up
   */
  setupScenario: async ({ page, context }, use, scenarioId: string) => {
    await context.clearCookies();
    await page.goto('/');
    await page.evaluate((id: string) => {
      localStorage.clear();
      sessionStorage.clear();
      localStorage.setItem('dev:mockScenario', id);
    }, scenarioId);
    
    // Reload to ensure scenario is applied
    await page.reload();
    
    await use();
  },
});

/**
 * Helper to set up a scenario in a test
 * Usage: await setupScenario(page, 'one-active-vote');
 */
export async function setupScenario(page: any, scenarioId: string, path: string = '/'): Promise<void> {
  // Navigate to the page first to ensure we have the right origin
  await page.goto(path);
  
  // Now we can safely access localStorage
  await page.evaluate((id: string) => {
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem('dev:mockScenario', id);
  }, scenarioId);
  
  // Reload to ensure scenario is applied
  await page.reload();
  
  // Wait for the app to be fully loaded (React hydrated and data loaded)
  await page.waitForSelector('h1:has-text("Photo de Famille")', { timeout: 5000 });
  
  // Wait a bit more for data to be loaded from context
  await page.waitForTimeout(500);
}

/**
 * Helper to get a scenario's contests and votes
 */
export function getScenario(scenarioId: string): MockScenario {
  return getScenarioById(scenarioId);
}

/**
 * Helper to clear all storage (for tests that need clean state)
 */
export async function clearStorage(page: any): Promise<void> {
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}

export default test;
