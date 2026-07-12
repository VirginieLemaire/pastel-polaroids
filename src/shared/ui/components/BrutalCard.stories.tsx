import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import BrutalCard from './BrutalCard';

const meta = {
  component: BrutalCard,
  tags: ['ai-generated','autodocs'],
} satisfies Meta<typeof BrutalCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: 'Card content' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Card content')).toBeVisible();
  },
};

export const Mint: Story = { args: { children: 'Mint card', color: 'mint' } };

export const Pink: Story = { args: { children: 'Pink card', color: 'pink' } };

export const Lavender: Story = { args: { children: 'Lavender card', color: 'lavender' } };

export const Butter: Story = { args: { children: 'Butter card', color: 'butter' } };

export const Sky: Story = { args: { children: 'Sky card', color: 'sky' } };

export const Peach: Story = { args: { children: 'Peach card', color: 'peach' } };

export const Large: Story = { args: { children: 'Large card', large: true } };
