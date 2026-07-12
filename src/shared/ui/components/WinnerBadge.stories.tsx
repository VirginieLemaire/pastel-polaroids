import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import WinnerBadge from './WinnerBadge';

const meta = {
  component: WinnerBadge,
  tags: ['ai-generated'],
} satisfies Meta<typeof WinnerBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('photo gagnante')).toBeVisible();
  },
};

export const WithClassName: Story = {
  args: { className: 'rounded-lg' },
};
