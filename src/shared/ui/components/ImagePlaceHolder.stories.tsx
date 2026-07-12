import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import ImagePlaceHolder from './ImagePlaceHolder';

const meta = {
  component: ImagePlaceHolder,
  tags: ['ai-generated','autodocs'],
} satisfies Meta<typeof ImagePlaceHolder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { className: '' },
  play: async ({ canvas }) => {
    const placeholder = canvas.getByRole('presentation', { hidden: true });
    await expect(placeholder).toBeVisible();
  },
};

export const WithClassName: Story = {
  args: { className: 'w-32 h-32' },
};
