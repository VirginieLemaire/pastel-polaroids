import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import BottomNav from './BottomNav';

const meta = {
  component: BottomNav,
  tags: ['ai-generated'],
} satisfies Meta<typeof BottomNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Navigation principale')).toBeVisible();
    await expect(canvas.getByText('Accueil')).toBeVisible();
    await expect(canvas.getByText('Résultats')).toBeVisible();
  },
};
