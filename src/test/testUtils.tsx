/**
 * Utilitaires pour les tests
 */
import { render, RenderOptions } from '@testing-library/react';
import { TestRouterProvider } from './testRouter';
import { ContestProvider } from '@/features/contests/ContestContext';
import { PhotoProvider } from '@/features/photos/PhotoContext';
import { VoteProvider } from '@/features/votes/VoteContext';
import { UserProvider } from '@/features/user/UserContext';
import type { Contest } from '@/features/contests/types';
import type { Photo } from '@/features/photos/types';
import type { Vote } from '@/features/votes/types';
// Re-export scenarios for use in tests
import { DEMO_SCENARIOS as MOCK_SCENARIOS, getScenarioById, DEFAULT_SCENARIO_ID } from '@/features/demo/scenarios';

export { MOCK_SCENARIOS, getScenarioById, DEFAULT_SCENARIO_ID };

// Type pour les providers combinés
interface AllProvidersProps {
  children: React.ReactNode;
  initialContests?: Contest[];
  initialPhotos?: Photo[];
  initialVotes?: Vote[];
}

/**
 * Composant qui combine tous les providers nécessaires pour les tests
 */
export const AllProviders = ({
  children,
  initialContests = [],
  initialPhotos = [],
  initialVotes = [],
}: AllProvidersProps) => (
  <TestRouterProvider>
    <UserProvider>
      <ContestProvider>
        <PhotoProvider>
          <VoteProvider>
            {children}
          </VoteProvider>
        </PhotoProvider>
      </ContestProvider>
    </UserProvider>
  </TestRouterProvider>
);

/**
 * Helper personnalisé pour render avec tous les providers
 */
export const renderWithProviders = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & {
    initialContests?: Contest[];
    initialPhotos?: Photo[];
    initialVotes?: Vote[];
  }
) => {
  const { initialContests = [], initialPhotos = [], initialVotes = [], ...restOptions } = options || {};
  
  return render(ui, {
    wrapper: ({ children }) => (
      <AllProviders
        initialContests={initialContests}
        initialPhotos={initialPhotos}
        initialVotes={initialVotes}
      >
        {children}
      </AllProviders>
    ),
    ...restOptions,
  });
};

/**
 * Helper pour créer un contest mocké facilement
 */
export const createMockContest = (
  overrides: Partial<Contest> = {}
): Contest => ({
  id: `contest-${Math.random().toString(36).substr(2, 9)}`,
  name: 'Test Contest',
  description: 'A test contest',
  authorId: 'user-1',
  coverImage: 'https://example.com/cover.jpg',
  submissionDays: 7,
  voteDays: 3,
  createdAt: new Date().toISOString(),
  photos: [],
  ...overrides,
});

/**
 * Helper pour créer une photo mockée facilement
 */
export const createMockPhoto = (
  overrides: Partial<Photo> = {}
): Photo => ({
  id: `photo-${Math.random().toString(36).substr(2, 9)}`,
  title: 'Test Photo',
  description: 'A test photo',
  imageUrl: 'https://example.com/photo.jpg',
  authorId: 'user-1',
  contestId: 'contest-1',
  createdAt: new Date().toISOString(),
  ...overrides,
});

/**
 * Helper pour créer un vote mocké facilement
 */
export const createMockVote = (
  overrides: Partial<Vote> = {}
): Vote => ({
  id: `vote-${Math.random().toString(36).substr(2, 9)}`,
  photoId: 'photo-1',
  contestId: 'contest-1',
  voterId: 'user-1',
  rating: 3,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

/**
 * Attendre un certain nombre de millisecondes
 */
export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
