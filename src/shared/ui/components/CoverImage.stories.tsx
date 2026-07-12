import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import CoverImage from './CoverImage';

const meta = {
  component: CoverImage,
  tags: ['ai-generated','autodocs'],
} satisfies Meta<typeof CoverImage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    src: 'https://placehold.co/600x400',
    alt: 'Placeholder image',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('img')).toBeVisible();
  },
};

export const Priority: Story = {
  args: {
    src: 'https://placehold.co/600x400',
    alt: 'Priority image',
    priority: true,
  },
};

export const WithAspectRatio: Story = {
  args: {
    src: 'https://placehold.co/600x400',
    alt: 'Square image',
    aspectRatio: '1',
  },
};

export const WithCustomClass: Story = {
  args: {
    src: 'https://placehold.co/600x400',
    alt: 'Custom styled image',
    className: 'rounded-lg',
  },
};
