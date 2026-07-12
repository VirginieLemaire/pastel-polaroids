import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import DisplayStars from './DisplayStars';

const meta = {
  component: DisplayStars,
  tags: ['ai-generated'],
} satisfies Meta<typeof DisplayStars>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FullRating: Story = {
  args: { rating: 5, showRatingText: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('5/5')).toBeVisible();
  },
};

export const PartialRating: Story = {
  args: { rating: 4.7, showRatingText: true },
};

export const HalfRating: Story = {
  args: { rating: 2.5, showRatingText: true },
};

export const LowRating: Story = {
  args: { rating: 1.2, showRatingText: true },
};

export const NoRating: Story = {
  args: { rating: 0, showRatingText: true },
};

export const WithoutText: Story = {
  args: { rating: 4, showRatingText: false },
};

export const SmallStars: Story = {
  args: { rating: 4.5, size: 3, showRatingText: true },
};

export const LargeStars: Story = {
  args: { rating: 3.8, size: 8, showRatingText: true },
};
