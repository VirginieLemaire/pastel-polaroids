import type { Preview } from '@storybook/react-vite';
import '../src/styles.css';
import { TestRouterProvider } from '../src/test/testRouter';
import { UserProvider } from '../src/features/user';
import { ContestProvider } from '../src/features/contests';
import { PhotoProvider } from '../src/features/photos';
import { VoteProvider } from '../src/features/votes';

const preview: Preview = {
  decorators: [
    (Story) => (
      <UserProvider>
        <ContestProvider>
          <PhotoProvider>
            <VoteProvider>
              <TestRouterProvider>
                <Story />
              </TestRouterProvider>
            </VoteProvider>
          </PhotoProvider>
        </ContestProvider>
      </UserProvider>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'error'
    }
  },
  tags: ['autodocs']
};

export default preview;