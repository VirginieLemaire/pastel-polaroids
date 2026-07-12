import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import BrutalButton from './BrutalButton';

const meta = {
  component: BrutalButton,
  tags: ['ai-generated', 'autodocs'],
} satisfies Meta<typeof BrutalButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// Smoke check with CssCheck - one per project
export const CssCheck: Story = {
  args: { children: 'Submit' },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: /submit/i });
    // BrutalButton uses bg-pastel-mint by default (colorClass['mint'] = 'bg-pastel-mint')
    // From index.css: --pastel-mint: 159 50% 80% → #b3e6d4 (actual computed value)
    // which converts to rgb(179, 230, 212)
    await expect(getComputedStyle(button).backgroundColor).toBe('rgb(179, 230, 212)');
  },
};

export const Primary: Story = {
  args: { children: 'Click me' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: /click me/i })).toBeVisible();
  },
};

export const WithIcon: Story = { args: { children: 'Save', icon: '💾' } };

export const Large: Story = { args: { children: 'Large', size: 'lg' } };

export const Small: Story = { args: { children: 'Small', size: 'sm' } };

export const Round: Story = { args: { children: '+', shape: 'round', size: 'md' } };

export const Pink: Story = { args: { children: 'Pink', color: 'pink' } };

export const Lavender: Story = { args: { children: 'Lavender', color: 'lavender' } };
