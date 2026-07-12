import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import StatusBadge from './StatusBadge';
import type { ContestStatus } from '@/features/contests/types';

const meta = {
  component: StatusBadge,
  tags: ['ai-generated'],
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Submission: Story = {
  args: { status: 'submission' as ContestStatus },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Soumission')).toBeVisible();
  },
};

export const Vote: Story = { args: { status: 'vote' as ContestStatus } };

export const Closed: Story = { args: { status: 'closed' as ContestStatus } };
