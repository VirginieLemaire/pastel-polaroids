import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import ShareButton from './ShareButton';

const meta = {
  component: ShareButton,
  tags: ['ai-generated', 'autodocs'],
} satisfies Meta<typeof ShareButton>;

export default meta;
type Story = StoryObj<typeof meta>;

const baseArgs = {
  title: "Concours photo : Vacances d'été",
  text: 'Viens voter pour les photos du concours « Vacances d\'été » !',
  url: 'https://example.com/contest/mock-1',
};

export const Default: Story = {
  args: baseArgs,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: /partager/i })).toBeVisible();
  },
};

export const ClipboardFallback: Story = {
  args: baseArgs,
  play: async ({ canvas }) => {
    // Environnement de test sans panneau de partage natif : forcer le repli
    // presse-papiers de façon déterministe, sans dépendre du navigateur réel.
    Object.defineProperty(navigator, 'share', { value: undefined, configurable: true });
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: () => Promise.resolve() },
      configurable: true,
    });

    await userEvent.click(canvas.getByRole('button', { name: /partager/i }));

    await expect(canvas.getByRole('button', { name: /lien copié/i })).toBeVisible();
  },
};

export const WithImage: Story = {
  args: { ...baseArgs, imageSrc: 'https://images.unsplash.com/photo-123?w=1200&h=630&fit=crop' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: /partager/i })).toBeVisible();
  },
};
