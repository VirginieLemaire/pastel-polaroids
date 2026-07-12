import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import PolaroidCard from './PolaroidCard';

const meta = {
  component: PolaroidCard,
  tags: ['ai-generated'],
} satisfies Meta<typeof PolaroidCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'My Photo',
    description: 'A beautiful photo from the contest',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('My Photo')).toBeVisible();
    await expect(canvas.getByText('A beautiful photo from the contest')).toBeVisible();
  },
};

export const WithImage: Story = {
  args: {
    imageUrl: 'https://via.placeholder.com/300x300',
    title: 'Photo with Image',
  },
};

export const WithRotation: Story = {
  args: {
    title: 'Rotated Photo',
    rotation: 5,
  },
};

export const Winner: Story = {
  args: {
    title: 'Winning Photo',
    isWinner: true,
    averageRating: 4.5,
  },
};

export const WithRating: Story = {
  args: {
    title: 'Rated Photo',
    averageRating: 3.8,
  },
};

export const Interactive: Story = {
  args: {
    title: 'Clickable Photo',
    onClick: () => console.log('Clicked'),
  },
};
